import React, { useEffect } from "react";
import StatsCards from "@/components/ui/StatsCards";
import { useGetAdminDashboardStatsQuery } from "@/services/Api";
import profilePersons from "@/assests/icons/profilePersons.svg";
import minusIcon from "@/assests/icons/minusIcon.svg";
import volumeIcon from "@/assests/icons/volumIcon.svg";
import cupIcon from "@/assests/icons/cupIcon.svg";
import trendingIcon from "@/assests/icons/trendingIcon.svg";

const systemStatus = [
  {
    label: "Prediction Engine",
    value: "Active",
    color: "bg-[#05C16833] text-[#14CA74]",
    borderColor: "#47A785",
  },
  {
    label: "Data Feed Connected",
    value: "Connected",
    color: "bg-[#05C16833] text-[#14CA74]",
    borderColor: "#47A785",
  },
  {
    label: "Last Update",
    value: "3min Ago",
    color: "bg-[#4F3DED33] text-[#4F3DED]",
    borderColor: "#4F3DED",
  },
];

export default function Dashboard() {
  const { data: dashboardStats = {}, isFetching, refetch } = useGetAdminDashboardStatsQuery();
  useEffect(() => {
    refetch()
  }, [])

  return (
    <main className="px-2 lg:px-0 py-6">
      <h2 className="text-white text-xl lg:text-2xl font-semibold mb-6">
        Overview
      </h2>

      <div className="mb-6">
        <StatsCards
          items={[
            {
              label: "Total Matches",
              value: dashboardStats.showOnHomepageMatches?.toString() || "0",
              icon: minusIcon
            },
            {
              label: "Live Matches",
              value: dashboardStats.liveMatches?.toString() || "0",
              icon: volumeIcon
            },
            {
              label: "Whitelisted Leagues",
              value: dashboardStats.whitelistedLeagues?.toString() || "0",
              icon: cupIcon,
            },
            {
              label: "Trending Matches",
              value: dashboardStats.trendingMatches?.toString() || "0",
              icon: trendingIcon
            },
          ]}
        />
      </div>

    </main>
  );
}
