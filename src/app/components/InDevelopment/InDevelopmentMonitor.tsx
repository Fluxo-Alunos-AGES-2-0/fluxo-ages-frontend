import React from 'react';

export const InDevelopmentMonitor = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full my-4 select-none h-[290px]">
      <div className="transform scale-75 origin-center flex flex-col items-center">
        <div className="relative w-[480px] h-[320px] bg-white border-[10px] border-[#0F172A] rounded-md shadow-md p-4 flex flex-col justify-between">
          <div className="w-full flex items-center justify-between border-b border-gray-100 pb-2">
            <div className="flex gap-1.5 pl-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]" />
            </div>
          </div>

          <div className="w-full h-full pt-4 grid grid-cols-2 gap-6">
            <div className="flex flex-col justify-between py-1">
              <div className="space-y-2">
                <div className="h-3 w-[85%] bg-[#D1D5DB] rounded-sm" />
                <div className="h-3 w-[55%] bg-[#D1D5DB] rounded-sm" />
              </div>
              
              <div className="flex justify-center text-[#5850EC] font-light -my-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="65" height="65" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="16 18 22 12 16 6"></polyline>
                  <polyline points="8 6 2 12 8 18"></polyline>
                </svg>
              </div>

              <div className="space-y-2">
                <div className="h-3 w-[75%] bg-[#D1D5DB] rounded-sm" />
                <div className="h-3 w-[45%] bg-[#D1D5DB] rounded-sm" />
              </div>
            </div>

            <div className="flex flex-col justify-between py-1">              
              <div className="flex items-center justify-end gap-1.5 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mr-1 text-[#374151]">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-[22px] h-[26px] border-2 border-gray-400 rounded p-0.5 flex flex-col gap-0.5 justify-center items-center">
                    <div className="h-[2px] w-3 bg-gray-400" />
                    <div className="h-[2px] w-3 bg-gray-400" />
                    <div className="h-[2px] w-3 bg-gray-400" />
                  </div>
                ))}
              </div>

              <div className="space-y-3 flex flex-col justify-center h-full pt-2">                
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full border-2 border-gray-700 flex items-center justify-center bg-white text-[#10B981] font-bold text-sm">
                    ✓
                  </div>
                  <div className="h-3 flex-1 bg-[#5850EC] rounded-full" />
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full border-2 border-gray-700 flex items-center justify-center bg-white text-[#4F46E5] text-sm">
                    🪲
                  </div>
                  <div className="h-3 flex-1 bg-[#5850EC] rounded-full" />
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full border-2 border-gray-700 flex items-center justify-center bg-[#5850EC] text-white text-xs font-bold">
                    !
                  </div>
                  <div className="h-3 flex-1 bg-[#5850EC] rounded-full" />
                </div>

              </div>
            </div>

          </div>
        </div>

        <div className="flex flex-col items-center w-full">
          <div className="w-16 h-12 bg-[#E2E8F0]" />
          <div className="w-48 h-1 bg-[#CBD5E1] rounded-full" />
        </div>

      </div>
    </div>
  );
};