import React from "react";

/**
 * Reusable stats cards grid
 * items: Array<{ label: string; value: string | number; icon?: ReactNode }>
 */
const StatsCards = ({ items = [], className = "" }) => {
  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}
    >
      {items.map((c) => (
        <div key={c.label} className="bg-[#282353] rounded-xl p-6 overflow-hidden shadow">
          <div className="flex items-center gap-3">
            <div className="">
              <div className="bg-[#6C5CF8] p-2 rounded-full flex items-center justify-center w-10 h-10">
                {typeof c.icon === "string" ? (
                  <img src={c.icon} alt="" className="w-5 h-5" />
                ) : (
                  c.icon || null
                )}
              </div>
            </div>
            <div>
              <div className="text-white text-md font-medium truncate">{c.label}</div>
              <div className="text-2xl font-medium text-white">{c.value}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
