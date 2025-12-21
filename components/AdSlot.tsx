
import React from 'react';

const AdSlot: React.FC = () => {
  return (
    <div className="mt-12 py-8 border-t border-b border-gray-100 dark:border-gray-800">
      <div className="flex justify-center">
        <div className="w-full max-w-[728px] h-[90px] bg-gray-50 dark:bg-gray-900/50 rounded-lg flex flex-col items-center justify-center border border-dashed border-gray-200 dark:border-gray-800 group transition-all hover:bg-gray-100 dark:hover:bg-gray-900">
          <span className="text-[10px] uppercase tracking-widest opacity-30 mb-1">Sponsored Advertisement</span>
          <div className="text-xs opacity-20 group-hover:opacity-40 transition-opacity">
            AdSense Slot Placeholder
          </div>
          {/* In production, place actual AdSense code here:
              <ins className="adsbygoogle"
                   style={{display:'block'}}
                   data-ad-client="ca-pub-XXXXX"
                   data-ad-slot="XXXXX"
                   data-ad-format="auto"></ins>
          */}
        </div>
      </div>
    </div>
  );
};

export default AdSlot;
