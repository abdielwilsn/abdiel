import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

const TreeBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const location = useLocation();
  const animationFrameId = useRef<number>();
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Make canvas non-critical for LCP
    canvas.setAttribute('aria-hidden', 'true');
    canvas.setAttribute('role', 'presentation');

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    // Track user interaction to start animation early
    const startOnInteraction = () => {
      setHasInteracted(true);
      window.removeEventListener('scroll', startOnInteraction);
      window.removeEventListener('click', startOnInteraction);
      window.removeEventListener('keydown', startOnInteraction);
    };
    window.addEventListener('scroll', startOnInteraction, { once: true });
    window.addEventListener('click', startOnInteraction, { once: true });
    window.addEventListener('keydown', startOnInteraction, { once: true });

    // Reduce complexity a bit (still looks great)
    const maxDepth = 9; // Was 11 → fewer branches, faster render

    interface Branch {
      startX: number;
      startY: number;
      endX: number;
      endY: number;
      width: number;
      angle: number;
      length: number;
      depth: number;
      // For wind animation
      swayPhase: number;
      swayAmplitude: number;
      children: Branch[];
    }

    let tree: Branch | null = null;
    let growthComplete = false;

    const generateTree = (): Branch => {
      const build = (
        x: number,
        y: number,
        angle: number,
        length: number,
        depth: number,
        width: number
      ): Branch => {
        const endX = x + Math.cos(angle) * length;
        const endY = y + Math.sin(angle) * length;

        const children: Branch[] = [];
        if (depth < maxDepth) {
          const angleOffset1 = -0.2 - Math.random() * 0.4;
          const angleOffset2 = 0.2 + Math.random() * 0.4;
          const reduction = 0.75 + Math.random() * 0.15;

          children.push(
            build(endX, endY, angle + angleOffset1, length * reduction, depth + 1, width * 0.7),
            build(endX, endY, angle + angleOffset2, length * reduction, depth + 1, width * 0.7)
          );
        }

        return {
          startX: x,
          startY: y,
          endX,
          endY,
          width,
          angle,
          length,
          depth,
          swayPhase: Math.random() * Math.PI * 2,
          swayAmplitude: depth > maxDepth - 4 ? 2 + Math.random() * 3 : 0, // Only tips sway
          children,
        };
      };

      return build(
        window.innerWidth / 2,
        window.innerHeight,
        -Math.PI / 2,
        130 + Math.random() * 20,
        0,
        3
      );
    };

    // Immediate: Paint a very subtle static background so LCP isn't waiting
    const paintInitial = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const isDark = document.documentElement.classList.contains('dark');
      ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(window.innerWidth / 2, window.innerHeight);
      ctx.lineTo(window.innerWidth / 2, window.innerHeight * 0.7);
      ctx.stroke();
    };
    paintInitial();

    // Full growth animation (runs once)
    const growTree = () => {
      if (!tree) tree = generateTree();

      const startTime = Date.now();
      const duration = 12000; // 12s growth

      const drawBranchPartial = (branch: Branch, progress: number) => {
        const levelProgress = Math.min(
          (progress - branch.depth / maxDepth) / (1 / maxDepth),
          1
        );
        if (levelProgress <= 0) return false;

        const currentLength = branch.length * levelProgress;
        const currentEndX = branch.startX + Math.cos(branch.angle) * currentLength;
        const currentEndY = branch.startY + Math.sin(branch.angle) * currentLength;

        ctx.beginPath();
        ctx.moveTo(branch.startX, branch.startY);
        ctx.lineTo(currentEndX, currentEndY);
        ctx.lineWidth = branch.width;
        ctx.stroke();

        return levelProgress >= 1;
      };

      const animateGrowth = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = document.documentElement.classList.contains('dark')
          ? 'rgba(255, 255, 255, 0.06)'
          : 'rgba(0, 0, 0, 0.06)';

        let complete = true;
        const traverse = (branch: Branch) => {
          const fullyGrown = drawBranchPartial(branch, progress);
          if (!fullyGrown) complete = false;
          if (fullyGrown) {
            branch.children.forEach(traverse);
          }
        };
        traverse(tree!);

        if (!complete && progress < 1) {
          animationFrameId.current = requestAnimationFrame(animateGrowth);
        } else {
          growthComplete = true;
        }
      };

      animateGrowth();
    };

    // Subtle wind animation (only tips move, very cheap)
    const windAnimation = () => {
      if (!growthComplete || !tree) return;

      let time = 0;
      const animateWind = () => {
        time += 0.015;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = document.documentElement.classList.contains('dark')
          ? 'rgba(255, 255, 255, 0.06)'
          : 'rgba(0, 0, 0, 0.06)';

        const drawWithSway = (branch: Branch) => {
          let dx = 0,
            dy = 0;
          if (branch.swayAmplitude > 0) {
            const sway = Math.sin(time + branch.swayPhase) * branch.swayAmplitude;
            dx = Math.cos(branch.angle + Math.PI / 2) * sway;
            dy = Math.sin(branch.angle + Math.PI / 2) * sway;
          }

          ctx.beginPath();
          ctx.moveTo(branch.startX, branch.startY);
          ctx.lineTo(branch.endX + dx, branch.endY + dy);
          ctx.lineWidth = branch.width;
          ctx.stroke();

          branch.children.forEach(drawWithSway);
        };

        drawWithSway(tree!);

        animationFrameId.current = requestAnimationFrame(animateWind);
      };

      animateWind();
    };

    // Start animation: either after delay or on first interaction
    const startAnimation = () => {
      growTree();
      // When growth finishes, switch to lightweight wind
      const checkGrowth = setInterval(() => {
        if (growthComplete) {
          clearInterval(checkGrowth);
          windAnimation();
        }
      }, 500);
    };

    const timer = setTimeout(() => {
      if (!hasInteracted) startAnimation();
    }, 4000); // 4-second delay

    if (hasInteracted) {
      clearTimeout(timer);
      startAnimation();
    }

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', startOnInteraction);
      window.removeEventListener('click', startOnInteraction);
      window.removeEventListener('keydown', startOnInteraction);
      clearTimeout(timer);
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, [location.pathname, hasInteracted]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: 'transparent' }} // Ensure no flash
    />
  );
};

export default TreeBackground;