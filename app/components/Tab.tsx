"use client";

import React from "react";

interface TabsProps {
  tabs: string[];
  activeTab: string;
  onTabClick: (tab: string) => void;
}

const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onTabClick }) => {
  return (
    <div className="flex w-full">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabClick(tab)}
          className={`flex-1 py-3 text-center font-semibold text-sm relative transition-all ${
            activeTab === tab
              ? "text-white after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-1 after:w-full after:bg-blue-500"
              : "text-gray-400 hover:text-white"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default Tabs;
