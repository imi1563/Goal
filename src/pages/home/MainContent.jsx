import React, { useMemo, useState, useEffect, useRef } from "react";
import { useGetTodayFixturesActiveQuery, useGetTomorrowFixturesActiveQuery, useGetPredictionsByDateQuery } from "@/services/Api";
import PlayOfDay from "./features/playOfDay";
import AiPickedWinner from "./features/aiPickedWinner";
import { useGetDoubleOrNothingMatchesQuery, useGetLiveMatchesQuery, useGetHomepageScoresQuery } from "../../services/Api";
import dateFormat from "dateformat";
import moment from "moment-timezone";
import AccordianData from "./components/AccordianData";
import TomorrowMatch from "../dashboard/match-management/features/tomorrowMatch";
import Pagination from "../../components/ui/Pagination";

// Utility function to return double chance values
const getFilterDisplayName = (filter) => {
  switch (filter) {
    case 'win-draw-win':
      return 'Win/Draw/Win';
    case 'both-teams-to-score':
      return 'Both Teams To Score';
    case 'over-under-goals':
      return 'Over/Under Goals';
    case 'corner-predictions':
      return 'Corners';
    default:
      return '';
  }
};

const calculateDoubleChance = () => ({
  homeOrDraw: '1X',
  awayOrDraw: 'X2',
  homeOrAway: '12'
});





export default function MainContent() {
  // State for collapsibles
  // const [openIndexes, setOpenIndexes] = useState([]);
  const [openIndexes, setOpenIndexes] = useState(["collapsible-0"]); // open first by default
  const [selectValues, setSelectValues] = useState({});
  // State for over dropdown
  const [openOverDropdown, setOpenOverDropdown] = useState(null);
  const [selectedOverValues, setSelectedOverValues] = useState({});
  const [selectedGoals, setSelectedGoals] = useState({});
  const [activeFilter, setActiveFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20);

  // Handle filter button click
  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
    setCurrentPage(1); // Reset to first page when filter changes
    // Here you can add any additional logic when a filter is selected
  };

  // Ref for dropdown
  const dropdownRef = useRef(null);

  // Handle clicks outside dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenOverDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Auto-switch to 'today' view when UK midnight passes
  useEffect(() => {
    const ukTimezone = 'Europe/London';

    const checkUKMidnight = () => {
      const nowUK = moment.tz(ukTimezone);
      const currentHour = nowUK.hour();
      const currentMinute = nowUK.minute();

      // If it's past midnight in UK (00:00-00:01), switch to 'today' view
      if (currentHour === 0 && currentMinute <= 1) {
        setActiveView('today');
        setCurrentPage(1);
      }
    };

    // Check immediately
    checkUKMidnight();

    // Set up interval to check every minute
    const intervalId = setInterval(checkUKMidnight, 60000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const [activeView, setActiveView] = useState('today');
  const queryParams = {
    filter: activeFilter == 'all' ? undefined : activeFilter,
    page: currentPage,
    pageSize: pageSize,
  }
  const { data, isFetching, isLoading, refetch } = useGetLiveMatchesQuery(queryParams);
  const { data: doubleOrNothingData } = useGetDoubleOrNothingMatchesQuery();
  const { data: homepageScoresData, isFetching: isFetchingScores, isLoading: isLoadingScores } = useGetHomepageScoresQuery({ limit: 1000000, page: 1 }, {
    pollingInterval: 30000, // Refetch every 30 seconds

  });

  const liveMatchesData = data?.data?.leagues || [];
  const pagination = data?.data?.pagination || {
    page: 1,
    pageSize: 20,
    totalItems: 0,
    totalPages: 1
  };

  const filteredLeagues = useMemo(() => {
    const ukTimezone = 'Europe/London';

    // Get current time in UK timezone
    const nowUK = moment.tz(ukTimezone);

    // Calculate UK midnight boundaries for filtering (in UK timezone)
    const todayUK = nowUK.clone().startOf('day');
    const tomorrowUK = todayUK.clone().add(1, 'day');
    const dayAfterTomorrowUK = tomorrowUK.clone().add(1, 'day');

    const filterMatchesByDate = (matches) => {
      return matches.filter(match => {
        // Backend se UTC time mein match.date aa raha hai, isko UK timezone mein convert karo
        // Parse UTC date string and convert to UK timezone for comparison
        const matchDateUK = moment.utc(match.date).tz(ukTimezone);

        if (activeView === 'today') {
          // Compare in UK timezone - match should be on today's date (same day as today's UK midnight)
          // Match date must be >= today's UK midnight (00:00) and < tomorrow's UK midnight (00:00)
          return matchDateUK.isSameOrAfter(todayUK, 'day') && matchDateUK.isBefore(tomorrowUK, 'day');
        }
        if (activeView === 'tomorrow') {
          // Compare in UK timezone - match should be on tomorrow's date (same day as tomorrow's UK midnight)
          // Match date must be >= tomorrow's UK midnight (00:00) and < day after tomorrow's UK midnight (00:00)
          return matchDateUK.isSameOrAfter(tomorrowUK, 'day') && matchDateUK.isBefore(dayAfterTomorrowUK, 'day');
        }
        return true; // Should not happen if activeView is controlled
      });
    };
    const dateFilteredLeagues = liveMatchesData.map(league => ({
      ...league,
      matches: filterMatchesByDate(league.matches)
    }));

    if (activeFilter === 'all') {
      return dateFilteredLeagues.filter(league => league.matches.length > 0);
    }

    return dateFilteredLeagues.map(league => {

      const filteredMatches = league.matches.filter(match => {
        const flags = match.prediction?.showFlags;
        if (!flags) return false;

        switch (activeFilter) {
          case 'win-draw-win':
            return flags.homeWinShow || flags.drawShow || flags.awayWinShow;
          case 'both-teams-to-score':
            return flags.bttsShow;
          case 'over-under-goals':
            return flags.over25Show || flags.over15Show;
          case 'corner-predictions':
            return flags.overCornersShow;
          default:
            return true;
        }
      });

      return { ...league, matches: filteredMatches };
    }).filter(league => league.matches.length > 0);
  }, [liveMatchesData, activeFilter, activeView]);



  // Handle Today button click
  const handleTodayClick = () => {
    setActiveView('today');
    setCurrentPage(1); // Reset to first page when switching views
    refetch();
  };

  // Handle Tomorrow button click
  const handleTomorrowClick = () => {
    setActiveView('tomorrow');
    setCurrentPage(1); // Reset to first page when switching views
    refetch();
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to top of the leagues section when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Toggle over dropdown
  const toggleOverDropdown = (gameIndex) => {
    setOpenOverDropdown(openOverDropdown === gameIndex ? null : gameIndex);
  };

  // Select over value
  const selectOverValue = (gameIndex, value) => {
    setSelectedOverValues((prev) => ({
      ...prev,
      [gameIndex]: value,
    }));
    setOpenOverDropdown(null);
    setSelectedGoals(value);
  };

  return (
    <section className="w-full bg-[#1E1B3A] min-h-screen px-3 md:px-6 py-6 flex justify-start">
      <div className="w-full max-w-[1300px] mx-auto flex flex-wrap lg:flex-row gap-8 px-2">
        {/* Main Left Content */}
        <div className="flex-1 flex flex-col gap-4 min-w-0 relative">

          {/* Double or nothing - Figma style */}




          {/* {activeView === 'today' ? ( */}
          <>
            <div className="flex flex-wrap items-center justify-between gap-2 md:gap-4 bg-transparent px-1 py-3 mb-4 mt-0 ml-2">
              {/* Left: Sort results by section */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[#D7D4EC] text-sm md:text-base font-body">
                  Sort results by
                </span>
                <button
                  onClick={() => handleFilterClick('all')}
                  className={`font-medium px-3 py-1.5 md:px-4 md:py-2 rounded-full shadow transition focus:outline-none text-xs md:text-[15px] whitespace-nowrap ${activeFilter === 'all'
                    ? 'bg-[#09C7A4] text-[#1A1733]'
                    : 'bg-transparent text-white border border-[#2c2752] hover:bg-[#2c2752]/40'
                    }`}
                >
                  All
                </button>
                <button
                  onClick={() => handleFilterClick('win-draw-win')}
                  className={`font-medium px-3 py-1.5 md:px-4 md:py-2 rounded-full shadow transition focus:outline-none text-xs md:text-[15px] whitespace-nowrap ${activeFilter === 'win-draw-win'
                    ? 'bg-[#09C7A4] text-[#1A1733]'
                    : 'bg-transparent text-white border border-[#2c2752] hover:bg-[#2c2752]/40'
                    }`}
                >
                  Win/Draw/Win
                </button>
                <button
                  onClick={() => handleFilterClick('both-teams-to-score')}
                  className={`font-medium px-3 py-1.5 md:px-4 md:py-2 rounded-full shadow transition focus:outline-none text-xs md:text-[15px] whitespace-nowrap ${activeFilter === 'both-teams-to-score'
                    ? 'bg-[#09C7A4] text-[#1A1733]'
                    : 'bg-transparent text-white border border-[#2c2752] hover:bg-[#2c2752]/40'
                    }`}
                >
                  Both teams to score
                </button>
                <button
                  onClick={() => handleFilterClick('over-under-goals')}
                  className={`font-medium px-3 py-1.5 md:px-4 md:py-2 rounded-full shadow transition focus:outline-none text-xs md:text-[15px] whitespace-nowrap ${activeFilter === 'over-under-goals'
                    ? 'bg-[#09C7A4] text-[#1A1733]'
                    : 'bg-transparent text-white border border-[#2c2752] hover:bg-[#2c2752]/40'
                    }`}
                >
                  Over/Under Goals
                </button>
                <button
                  onClick={() => handleFilterClick('corner-predictions')}
                  className={`font-medium px-3 py-1.5 md:px-4 md:py-2 rounded-full shadow transition focus:outline-none text-xs md:text-[15px] whitespace-nowrap ${activeFilter === 'corner-predictions'
                    ? 'bg-[#09C7A4] text-[#1A1733]'
                    : 'bg-transparent text-white border border-[#2c2752] hover:bg-[#2c2752]/40'
                    }`}
                >
                  Corners
                </button>
              </div>
              {/* Right: Today/Tomorrow buttons */}
              <div className="flex gap-2 flex-shrink-0 mt-3 md:mt-0">
                <button
                  onClick={handleTodayClick}
                  disabled={isFetching}
                  className={`text-[#1A1733] text-xs md:text-[15px] rounded-full px-3 py-1.5 md:px-4 md:py-2 font-medium font-body shadow border transition-all duration-200 whitespace-nowrap ${activeView === 'today'
                    ? 'bg-[#09C7A4] border-[#0B7F6B]'
                    : 'bg-transparent text-white border-[#2c2752] hover:bg-[#2c2752]/40'
                    } ${isFetching
                      ? 'cursor-not-allowed opacity-75'
                      : ''
                    }`}
                >
                  {isFetching && activeView === 'today' ? 'Loading...' : 'Today'}
                </button>
                <button
                  onClick={handleTomorrowClick}
                  disabled={isFetching}
                  className={`text-xs md:text-[15px] rounded-full px-3 py-1.5 md:px-4 md:py-2 font-medium font-body border transition-all duration-200 whitespace-nowrap ${activeView === 'tomorrow'
                    ? 'bg-[#09C7A4] text-[#1A1733] border-[#0B7F6B]'
                    : 'bg-transparent text-white border-[#2c2752] hover:bg-[#2c2752]/40'
                    } ${isFetching && activeView === 'tomorrow'
                      ? 'cursor-not-allowed opacity-75'
                      : ''
                    }`}
                >
                  {isFetching && activeView === 'tomorrow' ? 'Loading...' : 'Tomorrow'}
                </button>
              </div>
            </div>

            {/* Collapsible Leagues */}
            <div className="flex flex-col gap-2 mt-4 ml-2 min-w-0">
              {/* Loading state for fixtures */}
              {(isFetching || isLoading) && (
                <div className="text-white text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
                  Loading {activeView === 'today' ? 'Live' : 'Tomorrow'} matches...
                </div>
              )}

              {/* No active fixtures message */}
              {!isFetching && !isLoading && filteredLeagues.length === 0 && (
                <div className="text-white text-center py-8">
                  <div className="text-lg font-semibold mb-2">
                    {activeFilter === 'all'
                      ? `Currently No ${activeView === 'today' ? 'Live' : 'Tomorrow'} Matches`
                      : `No Matches Found for "${getFilterDisplayName(activeFilter)}"`}
                  </div>
                  <div className="text-sm text-gray-400">
                    {activeFilter === 'all'
                      ? `When ${activeView === 'today' ? 'Live' : 'Tomorrow'} matches are available, they will appear here. Please check back later.`
                      : 'Please try a different filter or check back later.'}
                  </div>
                </div>
              )}

              {/* Show leagues only if there are fixtures */}
              {!isFetching && !isLoading && filteredLeagues.length > 0 && filteredLeagues.map((name, idx) => {
                // // Find the matching section in matches by league name
                // const section = liveMatchesData.find((m) => m.league.name === name.league.name);
                const collapseIdx = `collapsible-${idx}`;
                const isOpen = openIndexes.includes(collapseIdx);

                return (
                  <div key={idx}>
                    <button
                      onClick={() =>
                        setOpenIndexes((prev) =>
                          prev.includes(collapseIdx)
                            ? prev.filter((i) => i !== collapseIdx)
                            : [...prev, collapseIdx]
                        )
                      }
                      className="bg-[#4F3DFF] text-white text-lg font-bold rounded-lg mb-2 px-4 py-3 font-body flex justify-between items-center w-full transition"
                    >
                      {name?.league?.country} / {name?.league?.name}
                      <span
                        className={`ml-2 transition-transform ${isOpen ? "rotate-180" : ""
                          }`}
                      >
                        ▼
                      </span>
                    </button>
                    {isOpen && name.matches && name.matches.length > 0 && (
                      <AccordianData name={name} homepageScoresData={homepageScoresData} />
                    )}
                  </div>
                );
              })}

              {/* Pagination */}
              {!isFetching && !isLoading && filteredLeagues.length > 0 && pagination.totalPages > 1 && (
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  totalItems={pagination.totalItems}
                  pageSize={pagination.pageSize}
                  onPageChange={handlePageChange}
                  className="mt-4"
                />
              )}
            </div>

          </>
          {/* ) : <>
            <TomorrowMatch />
          </>
          } */}

          <div className="relative">
            <img
              src="/footerball-1.png"
              alt="Football"
              className="w-20 h-20 md:w-[80px] md:h-[85px] absolute  md:top-[-5.5%] top-[-1.5%] left-[0.3%] transform  object-contain rounded-tl-2xl rounded-bl-2xl"
              style={{ clipPath: "circle(70% at 50% 50%)" }}
            />
            <div
              className="rounded-[30px] p-0 flex flex-col xl:flex-row items-stretch xl:items-center shadow-lg border-[2.06px] border-[#000] min-h-[120px] w-full"
              style={{
                backgroundImage:
                  "linear-gradient(90deg, #432490 0%, #3b3670 100%), url('/double-or-nothing.png')",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
              }}
            >
              {/* Ball Image - left side, clipped
            <div className="flex items-center h-full relative">
              
            </div> */}
              {/* Title - Double or nothing */}
              <div className="flex flex-col justify-center items-start px-2 py-2 sm:ml-24 ml-20">
                <span
                  className="text-[#FF4EC6] font-normal text-[28px] md:text-[45px] leading-none font-baloo-bhai text-outline-dark"
                // style={{
                //   textShadow:
                //     "0 3px 0 #000, 0 -2px 0 #000, 2px 0 0 #000, -2px 0 0 #000",
                // }}
                >
                  Double or <br /> nothing
                </span>
              </div>
              {/* Rest of your content... */}
              <div className="flex flex-col md:flex-row flex-1 items-start md:items-center justify-between px-4 py-4 w-full gap-2">
                {/* Match Rows */}
                <div className="flex flex-col gap-3 flex-1 md:ml-8 w-full">
                  {doubleOrNothingData?.data?.matches?.map((i, idx) => (
                    <div
                      key={i}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full mt-2 gap-2"
                    >
                      {/* Teams */}
                      <div className="flex items-center justify-around gap-3 flex-1 w-full">
                        <div className="flex md:flex-row flex-col md:text-left text-center items-center gap-2 w-1/3">
                          <img
                            src={i?.homeTeam?.logo || "/bragantino.png"}
                            alt={i?.homeTeam?.name || "RB Bragantino"}
                            className="w-8 h-8 rounded-full border border-[#222] flex-shrink-0"
                          />
                          <span className="text-white text-base ">
                            {i?.homeTeam?.name || "RB Bragantino"}
                          </span>
                        </div>
                        <div className="">
                          <span className="bg-[#C0BFC7] text-white px-2 py-1 rounded-full mx-2 flex items-center justify-center min-w-[40px] flex-shrink-0">
                            VS
                          </span>
                        </div>
                        <div className="flex md:flex-row flex-col md:text-left text-center items-center gap-2 w-1/3">
                          <img
                            src={i?.awayTeam?.logo || "/bahia.png"}
                            alt={i?.awayTeam?.name || "Bahia"}
                            className="w-8 h-8 rounded-full border border-[#222] flex-shrink-0"
                          />
                          <span className="text-white text-base ">
                            {i?.awayTeam?.name || "Bahia"}
                          </span>
                        </div>
                      </div>
                      {/* Show Over 1.5 goals for first record, prediction for others */}
                      {idx === 0 ? (
                        // i?.overGoals && i?.overGoals.length > 0 && (
                        <button className="bg-[#53E058] text-[#221f3a] font-medium text-base rounded-full px-6 py-2 ml-0 sm:ml-4 shadow border border-black transition hover:bg-[#3be03b] w-full sm:w-auto flex-shrink-0">
                          {i?.prediction?.outcomes?.over25Boolean ? 'Over 2.5 Goals' : 'Under 2.5 Goals'}
                        </button>
                        // )
                      ) : (
                        <div className="flex gap-2">
                          {(() => {
                            const outcomes = i?.prediction?.outcomes || {};
                            const homeWin = outcomes.homeWin || 0;
                            const draw = outcomes.draw || 0;
                            const awayWin = outcomes.awayWin || 0;

                            // If all probabilities are zero, show nothing
                            if (homeWin === 0 && draw === 0 && awayWin === 0) {
                              return null;
                            }

                            // Find the most probable outcome
                            const maxProb = Math.max(homeWin, draw, awayWin);

                            if (maxProb === homeWin) {
                              return (
                                <button className="bg-[#53E058] text-[#221f3a] font-medium text-base rounded-full px-6 py-2 ml-0 sm:ml-4 shadow border border-black transition hover:bg-[#3be03b] w-full sm:w-auto flex-shrink-0">
                                  {i?.homeTeam?.name.split('.').pop().split(' ').map(word => word[0]).join('')} Win or Draw
                                </button>
                              );
                            } else if (maxProb === awayWin) {
                              return (
                                <button className="bg-[#53E058] text-[#221f3a] font-medium text-base rounded-full px-6 py-2 ml-0 sm:ml-4 shadow border border-black transition hover:bg-[#3be03b] w-full sm:w-auto flex-shrink-0">
                                  {i?.awayTeam?.name.split('.').pop().split(' ').map(word => word[0]).join('')} Win or Draw
                                </button>
                              );
                            } else {
                              return (
                                <button className="bg-[#53E058] text-[#221f3a] font-medium text-base rounded-full px-6 py-2 ml-0 sm:ml-4 shadow border border-black transition hover:bg-[#3be03b] w-full sm:w-auto flex-shrink-0">
                                  Draw
                                </button>
                              );
                            }
                          })()}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="flex flex-col gap-6 pt-2 w-full lg:w-[283px]">
          {/* Play of the day */}
          <PlayOfDay />
          {/* AI Picked Winners */}
          <AiPickedWinner />
        </div>
      </div>
    </section>
  );
}
