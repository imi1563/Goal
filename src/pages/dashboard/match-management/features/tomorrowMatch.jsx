import React, { useState, useRef, useEffect, useMemo } from 'react'
import { useGetTomorrowMatchesQuery } from '../../../../services/Api';
import AccordianData from '../../../home/components/AccordianData';

const TomorrowMatch = () => {
    const [activeFilter, setActiveFilter] = useState('all');
    const [openIndexes, setOpenIndexes] = useState(["collapsible-0"]);
    const queryParams = {
        filter: activeFilter == 'all' ? undefined : activeFilter,
    }
    const { data, isFetching, isLoading } = useGetTomorrowMatchesQuery(queryParams);
    console.log("data", data);
    const liveMatchesData = data?.data?.leagues || [];

    const filteredLeagues = useMemo(() => {
        if (activeFilter === 'all') {
            return liveMatchesData;
        }

        return liveMatchesData.map(league => {
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
    }, [liveMatchesData, activeFilter]);

    // Handle filter button click
    const handleFilterClick = (filter) => {
        setActiveFilter(filter);
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
    return (
        <div>
            <div className="flex flex-wrap items-center gap-2 bg-transparent px-1 py-3 mb-4">
                <span className="text-[#D7D4EC] text-sm md:text-base font-body mr-2">
                    Sort results by
                </span>
                <button
                    onClick={() => handleFilterClick('all')}
                    className={`font-medium px-4 py-2 rounded-full shadow transition focus:outline-none text-[15px] ${activeFilter === 'all'
                        ? 'bg-[#09C7A4] text-[#1A1733]'
                        : 'bg-transparent text-white border border-[#2c2752] hover:bg-[#2c2752]/40'
                        }`}
                >
                    All
                </button>
                <button
                    onClick={() => handleFilterClick('win-draw-win')}
                    className={`font-medium px-4 py-2 rounded-full shadow transition focus:outline-none text-[15px] ${activeFilter === 'win-draw-win'
                        ? 'bg-[#09C7A4] text-[#1A1733]'
                        : 'bg-transparent text-white border border-[#2c2752] hover:bg-[#2c2752]/40'
                        }`}
                >
                    Win/Draw/Win
                </button>
                <button
                    onClick={() => handleFilterClick('both-teams-to-score')}
                    className={`font-medium px-4 py-2 rounded-full shadow transition focus:outline-none text-[15px] ${activeFilter === 'both-teams-to-score'
                        ? 'bg-[#09C7A4] text-[#1A1733]'
                        : 'bg-transparent text-white border border-[#2c2752] hover:bg-[#2c2752]/40'
                        }`}
                >
                    Both teams to score
                </button>
                <button
                    onClick={() => handleFilterClick('over-under-goals')}
                    className={`font-medium px-4 py-2 rounded-full shadow transition focus:outline-none text-[15px] ${activeFilter === 'over-under-goals'
                        ? 'bg-[#09C7A4] text-[#1A1733]'
                        : 'bg-transparent text-white border border-[#2c2752] hover:bg-[#2c2752]/40'
                        }`}
                >
                    Over/Under Goals
                </button>
                <button
                    onClick={() => handleFilterClick('corner-predictions')}
                    className={`font-medium px-4 py-2 rounded-full shadow transition focus:outline-none text-[15px] ${activeFilter === 'corner-predictions'
                        ? 'bg-[#09C7A4] text-[#1A1733]'
                        : 'bg-transparent text-white border border-[#2c2752] hover:bg-[#2c2752]/40'
                        }`}
                >
                    Corners
                </button>
            </div>

            {/* Collapsible Leagues */}
            <div className="flex flex-col gap-2 mt-4 ml-2 min-w-0">
                {/* Loading state for fixtures */}
                {(isFetching || isLoading) && (
                    <div className="text-white text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
                        Loading Tomorrow matches...
                    </div>
                )}

                {/* No active fixtures message */}
                {!isFetching && !isLoading && filteredLeagues.length === 0 && (
                    <div className="text-white text-center py-8">
                        <div className="text-lg font-semibold mb-2">Currently No Tomorrow Matches</div>
                        <div className="text-sm text-gray-400">
                            When Tomorrow matches are available, they will appear here. Please check back later.
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
                                className="bg-[#4F3DFF] text-white text-xs font-bold rounded-lg mb-2 px-4 py-2 font-body flex justify-between items-center w-full transition"
                            >
                                {name?.league?.name}
                                <span
                                    className={`ml-2 transition-transform ${isOpen ? "rotate-180" : ""
                                        }`}
                                >
                                    ▼
                                </span>
                            </button>
                            {isOpen && name.matches && name.matches.length > 0 && (

                                <AccordianData name={name} />
                            )}
                        </div>
                    );
                })}

            </div>
        </div>
    )
}

export default TomorrowMatch