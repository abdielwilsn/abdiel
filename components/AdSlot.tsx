import React, { useEffect } from "react";

const AdSlot: React.FC = () => {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error("AdSense push failed", e);
    }
  }, []);

  return (
    <div className="mt-12 py-8 border-t border-b border-gray-100 dark:border-gray-800">
      <div className="flex justify-center">
        <div className="w-full max-w-[728px] min-h-[90px] bg-gray-50 dark:bg-gray-900/50 rounded-lg flex flex-col items-center justify-center border border-dashed border-gray-200 dark:border-gray-800 group transition-all hover:bg-gray-100 dark:hover:bg-gray-900">
          <span className="text-[10px] uppercase tracking-widest opacity-30 mb-2">
            Sponsored Advertisement
          </span>

          <ins
            class="adsbygoogle"
            style="display:block"
            data-ad-format="fluid"
            data-ad-layout-key="-fb+5w+4e-db+86"
            data-ad-client="ca-pub-4700530184261512"
            data-ad-slot="1557802205"
          ></ins>
        </div>
      </div>
    </div>
  );
};

export default AdSlot;
