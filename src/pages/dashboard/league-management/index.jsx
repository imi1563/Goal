import React, { useState, useEffect, useMemo, useRef } from "react";
import StatsCards from "@/components/ui/StatsCards";
import ReusableTable from "@/components/ui/ReusableTable";
import minusIcon from "@/assests/icons/minusIcon.svg";
import volumeIcon from "@/assests/icons/volumIcon.svg";
import cupIcon from "@/assests/icons/cupIcon.svg";
import trendingIcon from "@/assests/icons/trendingIcon.svg";
import { Plus, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useUpdateLeagueStatusMutation, useGetAdminDashboardStatsQuery, useGetLeaguesAdminQuery, useActiveLeaguesMutation, useDeactivateLeaguesMutation, useGetCountriesQuery } from "@/services/Api";
import axios from "axios";
import { toast } from "react-hot-toast";
import { BASE_URL, BASE_URL_IMAGE } from "../../../services/ApiEndpoints";
import Loader from "../../../components/ui/Loader";

// Column definitions moved inline to the table component to avoid reference issues

// Toggle Switch Component
const ToggleSwitch = ({ isOn, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${isOn ? 'bg-[#4F3DED]' : 'bg-[#323159]'
        }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out ${isOn ? 'translate-x-6' : 'translate-x-1'
          }`}
      />
    </button>
  );
};

const StatusPill = ({ value }) => (
  <span className="px-5 py-0.5 text-[11px] rounded-full bg-[#048FD52B] text-[#048FD5] font-medium">
    {value}
  </span>
);

const LeagueManagement = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const toastRef = useRef(null);
  const [loadingId, setLoadingId] = useState(null);
  const [updateLeagueStatus] = useUpdateLeagueStatusMutation();
  const { data: dashboardStats = {} } = useGetAdminDashboardStatsQuery();
  const [activeLeagues] = useActiveLeaguesMutation();
  const [deactivateLeagues] = useDeactivateLeaguesMutation();
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [countryFilter, setCountryFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, searchQuery, countryFilter]);

  // API call with filters
  const { data: leaguesAdmin = [], isLoading: isLoadingLeaguesAdmin, isError, isFetching } = useGetLeaguesAdminQuery({
    page: currentPage,
    limit: itemsPerPage,
    status: statusFilter !== 'all' ? statusFilter : undefined,
    search: searchQuery || undefined,
    country: countryFilter || undefined,
  }, {
    skip: !countryFilter,
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true
  });

  // Get countries for dropdown
  const { data: countriesData, isLoading: countriesLoading } = useGetCountriesQuery();

  const leagues = leaguesAdmin?.data?.items?.leagues || [];
  const countries = countriesData || [];

  const tableData = useMemo(() => {
    return leagues.map((league) => ({
      id: league._id,
      name: league.name,
      country: league.country,
      whitelisted: 'Yes',
      isActive: league.isActive || false,
      status: <StatusPill value={league.isActive ? 'Active' : 'Inactive'} />
    }));
  }, [leagues]);

  // // Handle status update when toggle is clicked
  const handleStatusUpdate = async ({ id, status }) => {
    try {
      setLoadingId(id);
      if (status) {
        const response = await activeLeagues(id);
        // if (response.data) {
        setIsModalOpen(true);
        // }
      } else {
        await deactivateLeagues(id);
      }
      toast.success("League status updated successfully", {
        duration: 3000,
        position: 'top-right',
      });
      // setCurrentPage(1);
    } catch (error) {
      const errorMessage = error?.data?.message || error?.error?.data?.message || 'Failed to update league status';
      toastRef.current = toast.error(errorMessage, {
        duration: 3000,
        position: 'top-right',
      });
    } finally {
      setLoadingId(null);
    }
  };

  // Calculate total pages for pagination
  const totalPages = leaguesAdmin?.data?.totalPages || 0;

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  return (
    <div className="px-2 lg:px-0 py-6">
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#2A2550] rounded-lg w-full max-w-md p-6 relative">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X size={24} />
            </button>
            <h3 className="text-xl font-semibold text-white mb-4">Processing Information</h3>
            <p className="text-gray-300">The league activation process has started. It may take 2–3 minutes to generate predictions and update all related data. You can safely close this window.</p>
            <div className="flex justify-end mt-6">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-white bg-[#4F3DED] rounded-md hover:bg-[#3A2DB8] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4F3DED]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-white text-xl lg:text-2xl font-semibold">
          League Management
        </h1>
        <button
          className="text-white font-medium text-lg px-4 py-3 rounded-xl flex items-center gap-2"
          style={{
            background: "linear-gradient(0deg, #4F3DED 0%, #7768FC 100%)",
          }}
        >
          <Plus className="w-4 h-4" />
          Add League
        </button>
      </div>

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
              icon: cupIcon
            },
            {
              label: "Trending Matches",
              value: dashboardStats.trendingMatches?.toString() || "0",
              icon: trendingIcon
            },
          ]}
        />
      </div>

      <div className="bg-[#2A2550] rounded-2xl py-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center px-6 mb-4 gap-4">
          <h2 className="text-white text-xl font-medium">League Table</h2>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            {/* Country Dropdown */}
            <div className="relative">
              <select
                className="bg-[#3A3570] text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pr-8 appearance-none"
                value={countryFilter}
                onChange={(e) => setCountryFilter(e.target.value)}
                disabled={countriesLoading}
              >
                <option value="">All Countries</option>
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Status Dropdown */}
            <div className="relative">
              <select
                className="bg-[#3A3570] text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pr-8 appearance-none"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                className="bg-[#3A3570] text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
                placeholder="Search leagues by name, country and type..."
                onChange={(e) => {
                  // Clear previous timeout
                  if (searchTimeout) clearTimeout(searchTimeout);
                  // Set a new timeout to update search query after user stops typing
                  setSearchTimeout(setTimeout(() => {
                    setSearchQuery(e.target.value);
                  }, 500));
                }}
              />
            </div>
          </div>
        </div>
        {(isLoadingLeaguesAdmin || isFetching) ? (
          <Loader />
        ) : isError ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-red-400 text-lg">
              Failed to load leagues. Please try again later.
            </div>
          </div>
        ) : tableData.length === 0 ? (
          <div className="flex flex-col justify-center items-center py-16">
            <div className="text-6xl mb-4">🏆</div>
            <div className="text-white text-xl font-medium mb-2"> {countryFilter ? "No League Data Available" : "Select a country to view leagues"}</div>
            <div className="text-[#AEB9E1] text-sm">There are currently no leagues to display</div>
          </div>
        ) : (
          <>
            <ReusableTable
              columns={[
                {
                  key: 'name',
                  label: 'League',
                  width: '25%',
                  render: (value, row) => (
                    <div className="flex items-center">
                      <div className="text-white font-medium">{value}</div>
                    </div>
                  )
                },
                {
                  key: 'country',
                  label: 'Country',
                  width: '25%',
                  render: (value) => <span className="text-white/80">{value}</span>
                },
                {
                  key: 'whitelisted',
                  label: 'Whitelisted',
                  width: '20%',
                  render: () => <span className="text-white/80">Yes</span>
                },
                {
                  key: 'status',
                  label: 'Status',
                  width: '20%',
                  render: (value, row) => (
                    <StatusPill value={row.isActive ? 'Active' : 'Inactive'} />
                  )
                },
                {
                  key: 'action',
                  label: 'Action',
                  width: '10%',
                  render: (value, row) => (
                    <div className="flex justify-center">
                      {loadingId === row.id ? (
                        <div className="flex justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        </div>
                      ) : (
                        <ToggleSwitch
                          isOn={row.isActive}
                          onToggle={() => handleStatusUpdate({ id: row.id, status: !row.isActive })}
                        />
                      )}
                    </div>
                  )
                }
              ]}
              data={tableData}
              totalPages={leaguesAdmin?.data?.totalPages}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default LeagueManagement;
