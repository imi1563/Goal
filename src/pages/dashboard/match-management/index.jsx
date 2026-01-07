import React from "react";
import StatsCards from "@/components/ui/StatsCards";
import MatchCard from "./features/MatchCard";
import { Plus } from "lucide-react";
import { useGetAdminDashboardStatsQuery } from "@/services/Api";
import minusIcon from "@/assests/icons/minusIcon.svg";
import publishedIcon from "@/assests/icons/publishedIcon.svg";
import manualIcon from "@/assests/icons/manualIcon.svg";
import taggedIcon from "@/assests/icons/TaggedIcon.svg";

const MatchManagement = () => {
  const { data: dashboardStats = {} } = useGetAdminDashboardStatsQuery();

  return (
    <div className="px-2 lg:px-0 py-6">
      {/* <div className="flex justify-between items-center mb-6">
        <h1 className="text-white text-xl lg:text-2xl font-semibold">
          Match Management
        </h1>
        <button
          className="text-white font-medium text-lg px-4 py-3 rounded-xl flex items-center gap-2"
          style={{
            background: "linear-gradient(0deg, #4F3DED 0%, #7768FC 100%)",
          }}
        >
          <Plus className="w-4 h-4" />
          Add Match
        </button>
      </div> */}
      {/* <StatsCards
        items={[
          { 
            label: "Total Matches", 
            value: dashboardStats.totalMatches?.toString() || "0", 
            icon: minusIcon 
          },
          { 
            label: "Published", 
            value: dashboardStats.totalMatches?.toString() || "0", 
            icon: publishedIcon 
          },
          { 
            label: "Manual Override", 
            value: "0", 
            icon: manualIcon 
          },
          { 
            label: "Tagged matches", 
            value: dashboardStats.trendingMatches?.toString() || "0", 
            icon: taggedIcon 
          },
        ]}
      /> */}
      <div className="mt-6">
        <MatchCard />
      </div>
    </div>
  );
};

export default MatchManagement;
