import React, { useState, useMemo, useEffect } from "react";
import { GoTag } from "react-icons/go";
import { GrHomeRounded } from "react-icons/gr";
import { IoPersonOutline } from "react-icons/io5";
import { ChevronUp, ChevronDown, Edit, X, Trash, AlertTriangle, Plus, RefreshCcw } from "lucide-react";

// Helper function to calculate predictions based on percentages
const calculatePredictions = (prediction) => {
  if (!prediction?.outcomes)
    return { matchPrediction: null, goalsPrediction: null, bttsPrediction: null };

  const { outcomes, showFlags } = prediction;

  let matchPrediction = null;
  if (outcomes?.homeWinBoolean) {
    matchPrediction = '1X';
  } else if (outcomes?.drawBoolean) {
    matchPrediction = 'X2';
  } else if (outcomes?.awayWinBoolean) {
    matchPrediction = '12';
  }

  const goalsPrediction = outcomes?.over25Boolean ? 'Over 2.5' : 'Under 2.5';

  const bttsPrediction = showFlags?.bttsShow ? 'BTTS' : null;

  return { matchPrediction, goalsPrediction, bttsPrediction };
};

import { useAddAiPickedWinnerMutation, useAddPlayOfTheDayMutation, useDeleteAiPickedWinnerMutation, useDeletePlayOfTheDayMutation, useFeaturedMatchMutation, useGetMatchesQuery, useUpdateDoubleOrNothingMatchesMutation, useUpdateHomePageMatchesMutation, useGetCountriesQuery, useGetLeaguesByCountryQuery, useDeleteMatchMutation } from "../../../../services/Api";
import Pagination from "../../../../components/ui/Pagination";
import Loader from "../../../../components/ui/Loader";
import Modal from "../../../../components/ui/Modal";
import Button from "../../../../components/ui/Button";
import { ToastContainer, toast } from "react-toastify";
import PredictionModal from "./PredicationModal";
import DoubleOrNothingModal from "./doubleOrNothingModal";

// Utility function to format match time
const formatMatchTime = (date) => {
  if (!date) return '';

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const matchDate = new Date(date);
  const matchDay = new Date(matchDate.getFullYear(), matchDate.getMonth(), matchDate.getDate());

  // Format time as HH:mm
  const timeString = matchDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });

  if (matchDay.getTime() === today.getTime()) {
    return `Today, ${timeString}`;
  } else if (matchDay.getTime() === tomorrow.getTime()) {
    return `Tomorrow, ${timeString}`;
  } else {
    // For other days, show the full date
    return matchDate.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  }
};

const DotIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <circle cx="5" cy="12" r="2.5" fill="#AEB9E1CC" />
    <circle cx="12" cy="12" r="2.5" fill="#AEB9E1CC" />
    <circle cx="19" cy="12" r="2.5" fill="#AEB9E1CC" />
  </svg>
);

const TAG_STYLES = {
  trending: { bg: "#4A3349", text: "#FFCA15" },
  high: { bg: "#124F49", text: "#14CA74" },
  published: { bg: "#4B3440", text: "#FF6658" },
};

const Tag = ({ children, variant, color = "#6c5cf8" }) => {
  const preset = variant && TAG_STYLES[variant];
  const backgroundColor = preset ? preset.bg : `${color}20`;
  const textColor = preset ? preset.text : color;

  return (
    <span
      className="inline-flex items-center justify-center rounded-full h-8 w-28 px-2 text-[12px] font-semibold mr-2 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] leading-none"
      style={{ backgroundColor, color: textColor }}
    >
      {children}
    </span>
  );
};

const Row = ({ label, percent, icon }) => (
  <div className="flex items-center justify-between py-2">
    <div className="flex items-center gap-2 text-[#b2b2d6] text-[16px] font-medium">
      {icon}
      {label}
    </div>
    <div className="text-md font-medium text-white">{percent}%</div>
  </div>
);

const Tile = ({ title, percent, color = "#17b26a" }) => (
  <div className="bg-[#323159] rounded-lg px-5 py-7">
    <div className="flex items-center justify-between">
      <div className="text-xl font-medium text-white">{title}</div>
      <div className="text-xl font-semibold" style={{ color }}>
        {percent}%
      </div>
    </div>
  </div>
);

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


const MatchCard = () => {
  // Sample data - in real app this would come from props or API
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pageSize, setPageSize] = useState(20);
  const [loadingId, setLoadingId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [aiLoading, setAiloading] = useState(null);
  const [homeLoading, setHomeLoading] = useState(null);
  const [doubleOrNothingLoading, setDoubleOrNothingLoading] = useState(null);
  const [playLoading, setPlayloading] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDoubleOrNothingModalOpen, setIsDoubleOrNothingModalOpen] = useState(false);
  const [countryFilter, setCountryFilter] = useState('');
  const [leagueFilter, setLeagueFilter] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [confirmDeleteLabel, setConfirmDeleteLabel] = useState('');

  const queryParams = {
    page: currentPage,
    pageSize: pageSize,
    status: statusFilter !== 'all' ? statusFilter : undefined,
    search: searchQuery || undefined,
    country: countryFilter || undefined,
    league: leagueFilter || undefined
  };
  const { data, isLoading, isError, isFetching, refetch: matchRefetch } = useGetMatchesQuery(queryParams, {
    skip: !countryFilter || !leagueFilter,
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true
  });
  const { data: countriesData, isLoading: countriesLoading } = useGetCountriesQuery();
  const { data: leaguesData, isLoading: leaguesLoading, refetch } = useGetLeaguesByCountryQuery({
    country: countryFilter
  }, {
    skip: !countryFilter
  });
  useEffect(() => {
    if (countryFilter != '') {
      refetch();
    }
  }, [countryFilter])

  const allMatches = data?.data?.items?.matches || [];
  const countries = countriesData || [];
  const leagues = leaguesData || [];
  const [featuredMatch] = useFeaturedMatchMutation()
  const [addPlayOfTheDay] = useAddPlayOfTheDayMutation()
  const [deletePlayOfTheDay] = useDeletePlayOfTheDayMutation()
  const [addAiPickedWinner] = useAddAiPickedWinnerMutation()
  const [deleteAiPickedWinner] = useDeleteAiPickedWinnerMutation()
  const [updateHomePageMatches] = useUpdateHomePageMatchesMutation()
  const [updateDoubleOrNothingMatches] = useUpdateDoubleOrNothingMatchesMutation()
  const [deleteMatch] = useDeleteMatchMutation()


  // Sorting state
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'asc'
  });

  const handleTrendingToggle = async (matchId, currentStatus) => {
    try {
      setLoadingId(matchId);
      const data = {
        featured: !currentStatus
      };
      await featuredMatch({ matchId, data }).unwrap();
      toast.success(`Match ${!currentStatus ? 'featured' : 'unfeatured'} successfully`, {
        duration: 3000,
        position: 'top-right',
      });
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to update match status', {
        duration: 3000,
        position: 'top-right',
      });
    } finally {
      setLoadingId(null);
    }
  };
  const handleDoubleOrNothingToggle = async (match) => {
    // if (match?.doubleOrNothing) {
    try {
      setDoubleOrNothingLoading(match?._id);
      const data = {
        doubleOrNothing: !match?.doubleOrNothing
      };
      await updateDoubleOrNothingMatches({ id: match?._id, data }).unwrap();
      toast.success(`Match ${!match?.doubleOrNothing ? 'Enabled Double or Nothing' : 'Disabled Double or Nothing'} successfully`, {
        duration: 3000,
        position: 'top-right',
      });
    } catch (error) {
      toast.error(error?.data?.error || 'Failed to update match status', {
        duration: 3000,
        position: 'top-right',
      });
    } finally {
      setDoubleOrNothingLoading(null);
    }
    // } else {
    //   setSelectedMatch(match);
    //   setIsDoubleOrNothingModalOpen(true);
    // }

  };
  const handlePlayOfTheDayToggle = async (matchId, currentStatus) => {
    try {
      setPlayloading(matchId);
      if (currentStatus) {
        await deletePlayOfTheDay(matchId).unwrap();
      } else {
        await addPlayOfTheDay(matchId).unwrap();
      }
      toast.success(`Match ${!currentStatus ? 'featured' : 'unfeatured'} successfully`, {
        duration: 3000,
        position: 'top-right',
      });
    } catch (error) {
      toast.error(error?.data?.error || 'Failed to update match status', {
        duration: 3000,
        position: 'top-right',
      });
    } finally {
      setPlayloading(null);
    }
  };
  const handleDeleteMatch = async (matchId) => {
    try {
      setDeleteLoading(matchId);
      await deleteMatch(matchId).unwrap();
      toast.success('Match deleted successfully', {
        duration: 3000,
        position: 'top-right',
      });
    } catch (error) {
      toast.error(error?.data?.error || 'Failed to delete match', {
        duration: 3000,
        position: 'top-right',
      });
    } finally {
      setDeleteLoading(null);
    }
  };

  const askDeleteMatch = (match) => {
    setConfirmDeleteId(match?._id);
    const label = `${match?.homeTeam?.name || 'Home'} vs ${match?.awayTeam?.name || 'Away'}`;
    setConfirmDeleteLabel(label);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteMatch = async () => {
    if (!confirmDeleteId) return;
    await handleDeleteMatch(confirmDeleteId);
    setIsDeleteModalOpen(false);
    setConfirmDeleteId(null);
    setConfirmDeleteLabel('');
  };
  const handleAiToggle = async (matchId, currentStatus) => {
    try {
      setAiloading(matchId);
      if (currentStatus) {
        await deleteAiPickedWinner(matchId).unwrap();
      } else {
        await addAiPickedWinner(matchId).unwrap();
      }
      toast.success(`Match ${!currentStatus ? 'featured' : 'unfeatured'} successfully`, {
        duration: 3000,
        position: 'top-right',
      });
    } catch (error) {
      toast.error(error?.data?.error || 'Failed to update match status', {
        duration: 3000,
        position: 'top-right',
      });
    } finally {
      setAiloading(null);
    }
  };

  const handleEditPredictions = (match) => {
    setSelectedMatch(match);
    setIsModalOpen(true);
  };


  const handleHomeToggle = async (matchId, currentStatus) => {
    setHomeLoading(matchId);
    try {

      await updateHomePageMatches(matchId).unwrap();
      toast.success(`Match ${!currentStatus ? 'added to' : 'removed from'} display successfully`, {
        duration: 3000,
        position: 'top-right',
      });
    } catch (error) {
      toast.error(error?.data?.error || 'Failed to update match status', {
        duration: 3000,
        position: 'top-right',
      });
    } finally {
      setHomeLoading(null);
    }
  };

  // Sorting function
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const SortIcon = ({ column }) => {
    if (sortConfig.key !== column) {
      return (
        <div className="flex flex-col ml-1">
          <ChevronUp className="w-3 h-3 text-[#AEB9E1] opacity-30" />
          <ChevronDown className="w-3 h-3 text-[#AEB9E1] opacity-30 -mt-1" />
        </div>
      );
    }

    return (
      <div className="flex flex-col ml-1">
        <ChevronUp className={`w-3 h-3 ${sortConfig.direction === 'asc' ? 'text-[#4F3DED]' : 'text-[#AEB9E1] opacity-30'}`} />
        <ChevronDown className={`w-3 h-3 ${sortConfig.direction === 'desc' ? 'text-[#4F3DED]' : 'text-[#AEB9E1] opacity-30'} -mt-1`} />
      </div>
    );
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-white text-xl lg:text-2xl font-semibold">
          Match Management
        </h1>
        <div className="flex justify-center items-center gap-2">
          <button
            className="text-white font-medium text-lg px-4 py-3 rounded-xl flex items-center gap-2"
            style={{
              background: "linear-gradient(0deg, #4F3DED 0%, #7768FC 100%)",
            }}
            onClick={matchRefetch}
          >
            <RefreshCcw className="w-4 h-4" />
            Refresh
          </button>
          <button
            className="text-white font-medium text-lg px-4 py-3 rounded-xl flex items-center gap-2"
            style={{
              background: "linear-gradient(0deg, #4F3DED 0%, #7768FC 100%)",
            }}
          >
            <Plus className="w-4 h-4" />
            Add Match
          </button>
        </div>

      </div>
      <div className="bg-[#2A2550] rounded-2xl py-4 mt-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center px-6 mb-4 gap-4">
          <h2 className="text-white text-xl font-medium">Matches</h2>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            {/* Country Dropdown */}
            <div className="relative">
              <select
                className="bg-[#3A3570] text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pr-8 appearance-none"
                value={countryFilter}
                onChange={(e) => {
                  setCountryFilter(e.target.value);
                  setLeagueFilter(''); // Reset league when country changes
                }}
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

            {/* League Dropdown */}
            <div className="relative">
              <select
                className="bg-[#3A3570] text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pr-8 appearance-none"
                value={leagueFilter}
                onChange={(e) => setLeagueFilter(e.target.value)}
                disabled={!countryFilter || leaguesLoading}
              >
                <option value="">All Leagues</option>
                {leagues.map((league) => (
                  <option key={league.leagueId} value={league.leagueId}>
                    {league.name}
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
                <option value="NS">Not Started</option>
                <option value="live">Live</option>
                {/* <option value="FT">Finished</option> */}
                {/* <option value="TBD">To be Defined</option> */}
                <option value="PST">Postponed</option>
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
                placeholder="Search matches..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
        {(isFetching || isLoading) ? <Loader /> :
          <>
            <div className="w-full overflow-x-auto">


              <table className="w-full">
                <thead className="bg-[#1A1B3A]">
                  <tr>
                    <th
                      className="px-4 xl:px-6 py-4 min-w-36 xl:py-5 text-left text-sm xl:text-base font-bold uppercase tracking-wider cursor-pointer hover:bg-[#252654] transition-colors"
                      style={{ color: '#6C5CF8' }}
                      onClick={() => handleSort('match')}
                    >
                      <div className="flex items-center">
                        Match
                        <SortIcon column="match" />
                      </div>
                    </th>
                    <th
                      className="px-4 xl:px-6 py-4 min-w-24 xl:py-5 text-left text-sm xl:text-base font-bold uppercase tracking-wider cursor-pointer hover:bg-[#252654] transition-colors"
                      style={{ color: '#6C5CF8' }}
                      onClick={() => handleSort('league')}
                    >
                      <div className="flex items-center">
                        League & Time
                        <SortIcon column="league" />
                      </div>
                    </th>
                    <th
                      className="px-4 xl:px-6 py-4 min-w-92 xl:py-5 text-center text-sm xl:text-base font-bold uppercase tracking-wider cursor-pointer hover:bg-[#252654] transition-colors"
                      style={{ color: '#6C5CF8' }}
                      onClick={() => handleSort('homeWin')}
                    >
                      <div className="flex items-center justify-center">
                        Win Predictions (%)
                        <SortIcon column="homeWin" />
                      </div>
                    </th>
                    {/* <th
                    className="px-4 xl:px-6 py-4 min-w-44 xl:py-5 text-center text-sm xl:text-base font-bold uppercase tracking-wider cursor-pointer hover:bg-[#252654] transition-colors"
                    style={{ color: '#6C5CF8' }}
                    onClick={() => handleSort('over25Goals')}
                  >
                    <div className="flex items-center justify-center">
                      Markets
                      <SortIcon column="over25Goals" />
                    </div>
                  </th> */}
                    <th
                      className="px-4 xl:px-6 py-4 min-w-32 xl:py-5 text-center text-sm xl:text-base font-bold uppercase tracking-wider cursor-pointer hover:bg-[#252654] transition-colors"
                      style={{ color: '#6C5CF8' }}
                      onClick={() => handleSort('status')}
                    >
                      <div className="flex items-center justify-center">
                        Status
                        <SortIcon column="status" />
                      </div>
                    </th>
                    {/* <th
                    className="px-4 xl:px-6 py-4 min-w-44 xl:py-5 text-center text-sm xl:text-base font-bold uppercase tracking-wider cursor-pointer hover:bg-[#252654] transition-colors"
                    style={{ color: '#6C5CF8' }}
                    onClick={() => handleSort('trending')}
                  >
                    <div className="flex items-center justify-center">
                      Trending
                      <SortIcon column="trending" />
                    </div>
                  </th>
                  <th
                    className="px-4 xl:px-6 py-4 min-w-44 xl:py-5 text-center text-sm xl:text-base font-bold uppercase tracking-wider cursor-pointer hover:bg-[#252654] transition-colors"
                    style={{ color: '#6C5CF8' }}
                    onClick={() => handleSort('trending')}
                  >
                    <div className="flex items-center justify-center">
                      Match Display
                      <SortIcon column="trending" />
                    </div>
                  </th>
                  <th
                    className="px-4 xl:px-6 py-4 min-w-44 xl:py-5 text-center text-sm xl:text-base font-bold uppercase tracking-wider cursor-pointer hover:bg-[#252654] transition-colors"
                    style={{ color: '#6C5CF8' }}
                    onClick={() => handleSort('trending')}
                  >
                    <div className="flex items-center justify-center">
                      Double or Nothing
                      <SortIcon column="trending" />
                    </div>
                  </th> */}
                    <th
                      className="px-4 xl:px-6 py-4 min-w-[6rem] xl:py-5 text-center text-sm xl:text-base font-bold uppercase tracking-wider cursor-pointer hover:bg-[#252654] transition-colors"
                      style={{ color: '#6C5CF8' }}
                      onClick={() => handleSort('trending')}
                    >
                      <div className="flex items-center justify-center">
                        Action
                        <SortIcon column="trending" />
                      </div>
                    </th>
                    <th
                      className="px-4 xl:px-6 py-4 min-w-[8rem] xl:py-5 text-center text-sm xl:text-base font-bold uppercase tracking-wider cursor-pointer hover:bg-[#252654] transition-colors"
                      style={{ color: '#6C5CF8' }}
                      onClick={() => handleSort('trending')}
                    >
                      <div className="flex items-center justify-center">
                        Prediction
                        <SortIcon column="trending" />
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#4F3DED]">
                  {allMatches?.filter((match) => match?.status?.long !== 'Match Finished')?.map((match) => (
                    <tr key={match.id} className="hover:bg-[#323159] transition-colors duration-150">
                      {/* Match Column */}
                      <td className="px-4 xl:px-6 py-3 xl:py-4 ">
                        <div className="text-sm xl:text-base font-medium text-white h-28 flex items-center">
                          <div className="">
                            <div className="lg:inline">{match?.homeTeam?.name}</div>{" "}
                            <span className="text-[#AEB9E1] font-normal text-xs xl:text-sm">vs</span>{" "}
                            <div className="lg:inline">{match?.awayTeam?.name}</div>
                          </div>
                        </div>
                        {match?.status?.long !== 'Match Finished' && (
                          <>
                            <div className="flex items-center gap-2 mt-4">
                              {loadingId === match?._id ? (
                                <div className="flex justify-center">
                                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                </div>
                              ) : (
                                <div className="text-white">
                                  <div className="flex gap-2 items-center">
                                    <label htmlFor="" className="truncate">Trending</label>
                                    <ToggleSwitch
                                      isOn={match?.featured}
                                      onToggle={() => handleTrendingToggle(match?._id, match?.featured)}
                                    />
                                  </div>
                                </div>
                              )}
                            </div>

                          </>
                        )}
                      </td>

                      {/* League & Time Column */}
                      <td className="px-4 xl:px-6 py-3 xl:py-4">
                        <div className="h-28 flex items-center">
                          <div className="">
                            <div className="text-xs xl:text-sm text-[#AEB9E1]">
                              {match?.league?.name}
                            </div>
                            <div className="text-xs text-[#AEB9E1] mt-1">
                              {formatMatchTime(match?.date)}
                            </div>
                          </div>
                        </div>
                        {match?.status?.long !== 'Match Finished' && (
                          <>
                            <div className="flex items-center justify-center gap-2 mt-4">
                              {homeLoading === match?._id ? (
                                <div className="flex justify-center">
                                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                </div>
                              ) : (
                                <div className="text-white">
                                  <div className="flex gap-2 items-center">
                                    <label htmlFor="" className="truncate" >Show on Homepage</label>
                                    <ToggleSwitch
                                      isOn={match?.showOnHomepage}
                                      onToggle={() => handleHomeToggle(match?._id, match?.showOnHomepage)}
                                    />
                                  </div>
                                </div>
                              )}
                            </div>

                          </>
                        )}
                      </td>

                      {/* Win Predictions Column */}
                      <td className="px-4 xl:px-6 py-3 xl:py-4">
                        <div className="flex gap-4 items-center min-h-28">
                          <div className="flex flex-col gap-1 text-center min-w-[120px]">
                            <div className="flex items-center justify-between text-xs">
                              <div className="flex items-center gap-1">
                                <GrHomeRounded className="w-3 h-3 text-[#AEB9E1]" />
                                <span className="text-[#AEB9E1] hidden xl:inline">Home</span>
                                <span className="text-[#AEB9E1] xl:hidden">H</span>
                              </div>
                              <span className="text-white font-medium">{match?.prediction?.outcomes?.homeWin?.toFixed(2) || 0}%</span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                              <div className="flex items-center gap-1">
                                <IoPersonOutline className="w-3 h-3 text-[#AEB9E1]" />
                                <span className="text-[#AEB9E1] hidden xl:inline">Draw</span>
                                <span className="text-[#AEB9E1] xl:hidden">D</span>
                              </div>
                              <span className="text-white font-medium">{match?.prediction?.outcomes?.draw?.toFixed(2) || 0}%</span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                              <div className="flex items-center gap-1">
                                <IoPersonOutline className="w-3 h-3 text-[#AEB9E1]" />
                                <span className="text-[#AEB9E1] hidden xl:inline">Away</span>
                                <span className="text-[#AEB9E1] xl:hidden">A</span>
                              </div>
                              <span className="text-white font-medium">{match?.prediction?.outcomes?.awayWin?.toFixed(2) || 0}%</span>
                            </div>
                          </div>

                          <div className="flex flex-col gap-2 min-w-[100px]">
                            <div className="bg-[#323159] rounded-md px-2 xl:px-3 py-1 xl:py-2 text-center">
                              <div className="text-xs text-[#AEB9E1]">
                                <span className="hidden xl:inline truncate">Over 2.5 Goals</span>
                                <span className="xl:hidden">O2.5</span>
                              </div>
                              <div className="text-sm font-semibold text-[#14CA74]">{match?.prediction?.outcomes?.over25?.toFixed(2) || 0}%</div>
                            </div>
                            <div className="bg-[#323159] rounded-md px-2 xl:px-3 py-1 xl:py-2 text-center">
                              <div className="text-xs text-[#AEB9E1]">
                                <span className="hidden xl:inline truncate">Both Team Score</span>
                                <span className="xl:hidden">BTTS</span>
                              </div>
                              <div className="text-sm font-semibold text-[#9F2CE7]">{match?.prediction?.outcomes?.btts?.toFixed(2) || 0}%</div>
                            </div>
                          </div>
                        </div>
                        {match?.status?.long !== 'Match Finished' && (
                          <>

                            <div className="flex items-center justify-center gap-2 mt-4">
                              {doubleOrNothingLoading === match?._id ? (
                                <div className="flex justify-center">
                                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                </div>
                              ) : (
                                <div className="text-white">
                                  <div className="flex gap-2 items-center">
                                    <label htmlFor="" className="truncate" >Double Or Nothing</label>
                                    <ToggleSwitch
                                      isOn={match?.doubleOrNothing
                                      }
                                      onToggle={() => handleDoubleOrNothingToggle(match)}
                                    />
                                  </div>
                                </div>
                              )}
                            </div>

                          </>
                        )}

                      </td>

                      <td className="px-4 xl:px-6 py-3 xl:py-4 text-center">
                        <div className="h-28 flex items-center">
                          <span className={`text-xs font-semibold px-2 xl:px-2.5 py-1 rounded-full ${match?.status?.long !== 'Not Started'
                            ? 'bg-[#05C16833] text-[#1ed760]'
                            : 'bg-[#4B3440] text-[#FF6658]'
                            }`}>
                            <span className="hidden xl:inline truncate">{match?.status?.long}</span>
                            <span className="xl:hidden">{match?.status?.short}</span>
                          </span>
                        </div>
                        {match?.status?.long !== 'Match Finished' && (
                          <>
                            <div className="flex items-center justify-center gap-2 mt-4">
                              {playLoading === match?._id ? (
                                <div className="flex justify-center">
                                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                </div>
                              ) : (
                                <div className="text-white">
                                  <div className="flex gap-2 items-center">
                                    <label htmlFor="" className="truncate">Play of Day</label>
                                    <ToggleSwitch
                                      isOn={match?.playOfDay}
                                      onToggle={() => handlePlayOfTheDayToggle(match?._id, match?.playOfDay)}
                                    />
                                  </div>

                                </div>
                              )}
                            </div>

                          </>
                        )}
                      </td>

                      <td className="px-4 xl:px-6 py-3 xl:py-4 flex flex-col gap-2 text-center">
                        <div className="h-28 flex items-center">
                          <div className="space-y-1 ">
                            {(() => {
                              const { matchPrediction, goalsPrediction, bttsPrediction } = calculatePredictions(match?.prediction);

                              return (
                                <>
                                  {matchPrediction && (
                                    <div className="bg-black rounded-[30px] text-white text-xs font-medium text-center w-fit mx-auto px-4 py-1">
                                      {matchPrediction}
                                    </div>
                                  )}
                                  {goalsPrediction && (
                                    <div className="bg-black rounded-[30px] text-white text-xs font-medium text-center w-fit mx-auto px-4 py-1">
                                      {goalsPrediction}
                                    </div>
                                  )}
                                  {bttsPrediction && (
                                    <div className="bg-black rounded-[30px] text-white text-xs font-medium text-center w-fit mx-auto px-4 py-1">
                                      {bttsPrediction}
                                    </div>
                                  )}
                                </>
                              );
                            })()}
                          </div>
                        </div>
                        {match?.status?.long !== 'Match Finished' && (
                          <>

                            <div className="flex items-center justify-center gap-2 mt-4">
                              {aiLoading === match?._id ? (
                                <div className="flex justify-center">
                                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                </div>
                              ) : (
                                <div className="text-white">
                                  <div className="flex gap-2 items-center">
                                    <label htmlFor="" className="truncate" >AI Picker</label>
                                    <ToggleSwitch
                                      isOn={match?.aiPicked}
                                      onToggle={() => handleAiToggle(match?._id, match?.aiPicked)}
                                    />
                                  </div>
                                </div>
                              )}

                            </div>
                          </>
                        )}
                      </td>
                      <td className="px-4 xl:px-6 py-3 xl:py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {deleteLoading === match?._id ? (
                            <div className="flex justify-center">
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            </div>
                          ) : (
                            <>
                              <button
                                onClick={() => askDeleteMatch(match)}
                                className="p-1.5 text-[#AEB9E1] hover:text-white hover:bg-[#4F3DED] rounded-full transition-colors"
                                title="Delete Match"
                              >
                                <Trash size={18} />
                              </button>

                            </>
                          )}

                          <button
                            onClick={() => handleEditPredictions(match)}
                            className="p-1.5 text-[#AEB9E1] hover:text-white hover:bg-[#4F3DED] rounded-full transition-colors"
                            title="Edit Predictions"
                          >
                            <Edit size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>



            </div>
            {allMatches.length === 0 ? (
              <div className="flex items-center justify-center text-center h-[12.5rem]">
                <p className="text-white text-lg"> {(countryFilter && leagueFilter) ? `No matches found` : "Select a country and league to view matches"} </p>
              </div>
            ) :
              <Pagination
                currentPage={currentPage}
                totalPages={data?.data?.totalPages}
                pageSize={pageSize}
                onPageChange={setCurrentPage}
              />
            }
          </>
        }
        <PredictionModal
          isOpen={isModalOpen}
          onClose={() => { setIsModalOpen(false); setSelectedMatch(null) }}
          match={selectedMatch}
        />
        <DoubleOrNothingModal
          isOpen={isDoubleOrNothingModalOpen}
          onClose={() => { setIsDoubleOrNothingModalOpen(false); setSelectedMatch(null) }}
          match={selectedMatch}
          setDoubleOrNothingLoading={setDoubleOrNothingLoading}
        />
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => { setIsDeleteModalOpen(false); setConfirmDeleteId(null); setConfirmDeleteLabel(''); }}
          title="Delete match?"
          size="sm"
        >
          <div className="space-y-5">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-full bg-red-100 p-2 text-red-600">
                <AlertTriangle size={18} />
              </div>
              <div>
                <p className="text-sm text-gray-900 font-semibold">You are about to delete:</p>
                <p className="text-sm text-gray-700 mt-0.5">{confirmDeleteLabel}</p>
                <p className="text-xs text-gray-500 mt-2">This action cannot be undone and will permanently remove the match.</p>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={() => { setIsDeleteModalOpen(false); setConfirmDeleteId(null); setConfirmDeleteLabel(''); }}>Cancel</Button>
              <Button variant="danger" size="sm" onClick={confirmDeleteMatch} disabled={!!deleteLoading && deleteLoading === confirmDeleteId}>Delete</Button>
            </div>
          </div>
        </Modal>
      </div>
    </>

  );
};

export default MatchCard;
