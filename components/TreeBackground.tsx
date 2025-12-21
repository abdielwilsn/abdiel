
import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const TreeBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const location = useLocation();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const startTime = Date.now();
    const duration = 15000; // 15 seconds for a very slow, gradual growth
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    interface Branch {
      x: number;
      y: number;
      angle: number;
      length: number;
      depth: number;
      maxWidth: number;
      // Pre-calculated randomness for consistent frames
      angleOffset1: number;
      angleOffset2: number;
      lengthReduction: number;
    }

    // High depth for a very complex tree
    const maxDepth = 11;
    
    // Seed the tree structure so it doesn't change every frame, only grows
    const generateTreeStructure = (
      x: number, 
      y: number, 
      angle: number, 
      length: number, 
      depth: number, 
      maxWidth: number
    ): any => {
      if (depth >= maxDepth) return null;

      const angleOffset1 = -0.2 - Math.random() * 0.4;
      const angleOffset2 = 0.2 + Math.random() * 0.4;
      const lengthReduction = 0.75 + Math.random() * 0.15;

      return {
        x, y, angle, length, depth, maxWidth,
        angleOffset1, angleOffset2, lengthReduction,
        left: generateTreeStructure(
          0, 0, // values calculated during draw
          angle + angleOffset1,
          length * lengthReduction,
          depth + 1,
          maxWidth * 0.7
        ),
        right: generateTreeStructure(
          0, 0, // values calculated during draw
          angle + angleOffset2,
          length * lengthReduction,
          depth + 1,
          maxWidth * 0.7
        )
      };
    };

    const treeRoot = generateTreeStructure(
      window.innerWidth / 2,
      window.innerHeight,
      -Math.PI / 2,
      120 + Math.random() * 30,
      0,
      3
    );

    const drawLine = (x1: number, y1: number, x2: number, y2: number, width: number) => {
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.lineWidth = width;
      ctx.stroke();
    };

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const isDark = document.documentElement.classList.contains('dark');
      ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)';

      const renderNode = (node: any, parentX: number, parentY: number) => {
        if (!node) return;

        // Spread growth across depths
        const levelStart = node.depth / maxDepth;
        const levelEnd = (node.depth + 1) / maxDepth;
        let localProgress = 0;
        
        if (progress > levelStart) {
          localProgress = Math.min((progress - levelStart) / (levelEnd - levelStart), 1);
        }

        if (localProgress <= 0) return;

        const currentLength = node.length * localProgress;
        const endX = parentX + Math.cos(node.angle) * currentLength;
        const endY = parentY + Math.sin(node.angle) * currentLength;
        
        drawLine(parentX, parentY, endX, endY, node.maxWidth);

        if (localProgress === 1) {
          renderNode(node.left, endX, endY);
          renderNode(node.right, endX, endY);
        }
      };

      if (treeRoot) {
        renderNode(treeRoot, window.innerWidth / 2, window.innerHeight);
      }

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [location.pathname]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
    />
  );
};

export default TreeBackground;
