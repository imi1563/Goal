import React, { useRef, useState } from "react";
import dateFormat from "dateformat";
import moment from "moment-timezone";

// Helper function to format date with UK timezone
const formatMatchTime = (dateString) => {
  if (!dateString) return "";
  const ukTimezone = 'Europe/London';
  // Backend se UTC time mein date aa rahi hai, isko UK timezone mein convert karke show karo
  // Parse UTC date string and convert to UK timezone, then format as 12-hour time with AM/PM
  const dateUK = moment.utc(dateString).tz(ukTimezone);
  return dateFormat(dateUK.toDate(), "h:MM TT");
};

// Helper function to get display text based on match status
const getMatchStatusDisplay = (matchScore, gameDate) => {
  const status = matchScore?.status?.short;
  console.log("status of league", { matchScore, gameDate, status });
  // Finished statuses - show "Finished"
  if (['FT', 'AET', 'PEN'].includes(status)) {
    return "Finished";
  }
  if (['SUSP', 'INT'].includes(status)) {
    return "Suspended";
  }
  if (['PST'].includes(status)) {
    return "Postponed";
  }
  // Live/ongoing statuses - show elapsed time with minutes
  if (['1H', '2H', 'HT', 'ET', 'BT', 'P', 'SUSP', 'INT', 'LIVE'].includes(status)) {
    const elapsed = matchScore?.status?.elapsed;
    return elapsed ? <>
      <span className="text-center flex flex-col justify-center">
        {elapsed}'
        <br />
        <span className="text-[#ff3434] font-bold">
          Live
        </span>

      </span>
    </> : status;
  }

  // Not started or any other status - show formatted time
  return formatMatchTime(gameDate);
};

// Helper function to determine if goals should be shown in black color
const shouldShowGoalsInBlack = (matchScore) => {
  const status = matchScore?.status?.short;
  return ['FT', 'AET', 'PEN'].includes(status);
};

const AccordianData = ({ name, homepageScoresData }) => {
  const dropdownRef = useRef(null);
  const [openOverDropdown, setOpenOverDropdown] = useState(null);
  const [selectedOverValues, setSelectedOverValues] = useState({});
  const [selectedGoals, setSelectedGoals] = useState({});
  // When true, chips evaluate as if the match is finished (for quick visual verification)
  const [forceEvaluateColors, setForceEvaluateColors] = useState(false);

  const matchesScores = homepageScoresData?.items?.matches || [];

  // Decide chip color based on whether prediction is correct after match finishes
  const getPredictionColor = (game, matchScore, type, extra) => {
    const status = matchScore?.status?.short;
    const isActuallyFinished = ['FT', 'AET', 'PEN'].includes(status);
    const isFinished = forceEvaluateColors || isActuallyFinished;
    // Classes: we return background + text
    const neutral = 'bg-[#1C1A32] text-white';
    const successColor = 'bg-[#72B31E] text-white'; // green bg
    const failColor = 'bg-[#D20123] text-white'; // red bg
    if (!isFinished) return neutral;

    // Get goals from matchScore first (live/finished data), then fall back to game.goals
    const homeGoals = typeof (matchScore?.goals?.home ?? matchScore?.score?.home ?? game?.goals?.home) === 'number' 
      ? (matchScore?.goals?.home ?? matchScore?.score?.home ?? game?.goals?.home) 
      : null;
    const awayGoals = typeof (matchScore?.goals?.away ?? matchScore?.score?.away ?? game?.goals?.away) === 'number' 
      ? (matchScore?.goals?.away ?? matchScore?.score?.away ?? game?.goals?.away) 
      : null;

    // If goals not available, stay neutral for goal-based predictions
    const goalsKnown = homeGoals !== null && awayGoals !== null;
    const successColorFinished = successColor; // alias for clarity
    const failColorFinished = failColor;

    if (type === 'doubleChance') {
      if (!goalsKnown) return neutral;
      const label = extra; // '1X' | 'X2' | '12'
      const homeWin = homeGoals > awayGoals;
      const draw = homeGoals === awayGoals;
      const awayWin = awayGoals > homeGoals;
      let correct = false;
      if (label === '1X') correct = homeWin || draw;
      if (label === 'X2') correct = draw || awayWin;
      if (label === '12') correct = homeWin || awayWin;
      return correct ? successColorFinished : failColorFinished;
    }

    if (type === 'btts') {
      if (!goalsKnown) return neutral;
      const bttsHappened = (homeGoals > 0) && (awayGoals > 0);
      // Our prediction chip means BTTS = Yes
      return bttsHappened ? successColorFinished : failColorFinished;
    }

    if (type === 'over25') {
      if (!goalsKnown) return neutral;
      const total = homeGoals + awayGoals;
      return total >= 3 ? successColorFinished : failColorFinished;
    }

    if (type === 'under25') {
      if (!goalsKnown) return neutral;
      const total = homeGoals + awayGoals;
      return total < 3 ? successColorFinished : failColorFinished;
    }

    if (type === 'corners') {
      // Try several possible shapes for corners from scores payload
      const threshold = Number(extra);
      const totalCorners =
        (typeof matchScore?.corners?.total === 'number' ? matchScore.corners.total : null) ??
        (typeof matchScore?.statistics?.cornersTotal === 'number' ? matchScore.statistics.cornersTotal : null) ??
        null;
      if (!Number.isFinite(threshold) || totalCorners === null) return neutral;
      return totalCorners > threshold ? successColorFinished : failColorFinished;
    }

    return neutral;
  };



  return (
    <div>
      <div className="flex flex-col gap-4 bg-transparent">
        {/* <div className="flex items-center gap-2 mb-2">
          <button
            type="button"
            onClick={() => setForceEvaluateColors((v) => !v)}
            className="text-xs bg-[#1C1A32] text-white rounded px-3 py-1 border border-[#2E2A57] hover:opacity-80"
            title="Toggle to view colors as if all matches were finished"
          >
            {forceEvaluateColors ? 'Viewing: Evaluated Colors' : 'Viewing: Neutral (Live)'}
          </button>
        </div> */}
        {name?.matches?.map((game, gidx) => (
          <div key={gidx} className="flex flex-col">
            <div className="flex flex-col md:flex-row bg-white rounded-md items-start md:items-center gap-4 px-4 py-3">
              {(() => {
                // Find matching score data by comparing game._id with matchId
                const matchScore = matchesScores.find(
                  (score) => score.matchId === game._id
                );

                const showBlackGoals = shouldShowGoalsInBlack(matchScore);
                
                // Check if match has started (is live or finished) - show scores when status is not 'NS' (Not Started)
                const matchStatus = matchScore?.status?.short;
                const showScore = matchStatus && matchStatus !== 'NS';
                
                // Get scores from matchScore first (live/finished data), then fall back to game.goals
                const homeScore = matchScore?.goals?.home ?? matchScore?.score?.home ?? game?.goals?.home ?? null;
                const awayScore = matchScore?.goals?.away ?? matchScore?.score?.away ?? game?.goals?.away ?? null;
                
                // Show score if we have score data and match has started
                const shouldDisplayScore = showScore && (homeScore !== null || awayScore !== null);
                
                return (
                  <>
                    <span className="text-[#414D56] text-xs font-body">
                      {getMatchStatusDisplay(matchScore, game.date)}
                    </span>

                    <div className="flex flex-col gap-1 flex-1 md:max-w-[220px]">
                      <div className="flex flex-col gap-y-2">
                        <div className="flex items-center gap-1">
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <img
                              src={game.homeTeam.logo || "/bragantino.png"}
                              alt={game.homeTeam.name}
                              className="w-6 h-6 rounded-full border border-[#222] flex-shrink-0"
                            />
                            <span className="text-[#221f3a] text-base font-bold truncate">
                              {game.homeTeam.name}
                            </span>
                          </div>
                          {shouldDisplayScore && (
                            <span
                              className={`font-bold ${showBlackGoals ? 'text-black' : 'text-[#ff4e4e]'} text-base flex-shrink-0 w-6 text-right`}
                            >
                              {homeScore ?? 0}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <img
                              src={game.awayTeam.logo || "/bragantino.png"}
                              alt={game.awayTeam.name}
                              className="w-6 h-6 rounded-full border border-[#222] flex-shrink-0"
                            />
                            <span className="text-[#221f3a] text-base font-bold truncate">
                              {game.awayTeam.name}
                            </span>
                          </div>
                          {shouldDisplayScore && (
                            <span
                              className={`font-bold ${showBlackGoals ? 'text-black' : 'text-[#ff4e4e]'} text-base flex-shrink-0 w-6 text-right`}
                            >
                              {awayScore ?? 0}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                );
              })()}

              <div className="flex flex-wrap gap-2 mt-2 md:mt-0 md:ml-auto">
                {(() => {
                  // Re-find the score object for this game for chip coloring
                  const matchScore = matchesScores.find((score) => score.matchId === game._id);

                  // Double chance chip
                  if (!!game?.prediction?.showFlags?.homeWinShow) {
                    const home = Number(game?.prediction?.outcomes?.homeWin || 0);
                    const draw = Number(game?.prediction?.outcomes?.draw || 0);
                    const away = Number(game?.prediction?.outcomes?.awayWin || 0);
                    
                    const dcLabel = game?.prediction?.outcomes?.homeWinBoolean
                      ? '1X'
                      : game?.prediction?.outcomes?.drawBoolean
                        ? 'X2'
                        : game?.prediction?.outcomes?.awayWinBoolean
                          ? '12'
                          : '';
                    
                    // Calculate percentage based on label
                    let percentage = '';
                    if (dcLabel === '1X') {
                      percentage = (home + draw).toFixed(2);
                    } else if (dcLabel === 'X2') {
                      percentage = (draw + away).toFixed(2);
                    } else if (dcLabel === '12') {
                      percentage = (home + away).toFixed(2);
                    }
                    
                    if (dcLabel) {
                      return (
                        <span
                          className={`${getPredictionColor(game, matchScore, 'doubleChance', dcLabel)} text-sm rounded-full px-3 font-bold h-9 border border-[#2E2A57] flex items-center gap-1`}
                        >
                          <span>{dcLabel}</span>
                          {percentage && <span className="text-xs opacity-90">- {percentage}%</span>}
                        </span>
                      );
                    }
                  }
                  return null;
                })()}

                {(() => {
                  const matchScore = matchesScores.find((score) => score.matchId === game._id);
                  if (!!game?.prediction?.showFlags?.bttsShow) {
                    const bttsValue = game?.prediction?.outcomes?.btts;
                    const bttsPercentage = bttsValue !== undefined && bttsValue !== null 
                      ? Number(bttsValue).toFixed(2) 
                      : null;
                    return (
                      <span
                        className={`${getPredictionColor(game, matchScore, 'btts')} text-sm rounded-full px-3 font-bold h-9 border border-[#2E2A57] flex items-center gap-1`}
                      >
                        <span>BTTS</span>
                        {bttsPercentage && <span className="text-xs opacity-90">- {bttsPercentage}%</span>}
                      </span>
                    );
                  }
                  return null;
                })()}

                {(() => {
                  const matchScore = matchesScores.find((score) => score.matchId === game._id);
                  if (!!game?.prediction?.showFlags?.over25Show) {
                    const isOver = !!game?.prediction?.outcomes?.over25Boolean;
                    const over25Value = game?.prediction?.outcomes?.over25;
                    const over25Percentage = over25Value !== undefined && over25Value !== null 
                      ? Number(over25Value).toFixed(2) 
                      : null;
                    const under25Percentage = over25Value !== undefined && over25Value !== null 
                      ? (100 - Number(over25Value)).toFixed(2) 
                      : null;
                    return (
                      <span
                        className={`${getPredictionColor(game, matchScore, isOver ? 'over25' : 'under25')} text-sm rounded-full px-3 font-bold h-9 border border-[#2E2A57] flex items-center gap-1`}
                      >
                        <span>{isOver ? 'Over 2.5 goals' : 'Under 2.5 goals'}</span>
                        {isOver && over25Percentage && (
                          <span className="text-xs opacity-90">- {over25Percentage}%</span>
                        )}
                        {!isOver && under25Percentage && (
                          <span className="text-xs opacity-90">- {under25Percentage}%</span>
                        )}
                      </span>
                    );
                  }
                  return null;
                })()}

                {(() => {
                  const matchScore = matchesScores.find((score) => score.matchId === game._id);
                  if (!!game?.prediction?.showFlags?.overCornersShow) {
                    const threshold = game?.prediction?.manualCorners?.overCorners || 0;
                    return (
                      <span
                        className={`${getPredictionColor(game, matchScore, 'corners', threshold)} text-sm rounded-full px-3 font-bold h-9 border border-[#2E2A57] flex items-center`}
                      >
                        Over {threshold} Corners
                      </span>
                    );
                  }
                  return null;
                })()}
                {/* 
                {!!game?.prediction?.showFlags?.overCornersShow && (
                  <GoalDropdown game={game} gidx={gidx} />
                )} */}
              </div>
            </div>
            <div className="w-[98%] mx-auto border-2 border-black rounded-b-[1rem] flex md:flex-row flex-col items-center justify-between p-3">
              <h4 className="text-[#B8B9D3] text-[0.875rem] font-medium">
                We simulated 100,000 virtual matches - here are the probabilities:
              </h4>
              {(() => {
                const outcomes = game?.prediction?.outcomes || {};
                const homeWin = outcomes?.homeWin?.toFixed(2) || 0;
                const draw = outcomes?.draw?.toFixed(2) || 0;
                const awayWin = outcomes?.awayWin?.toFixed(2) || 0;

                if (homeWin === 0 && draw === 0 && awayWin === 0) {
                  return (
                    <p className="text-[#B8B9D3] text-sm opacity-75">
                      No probability data available
                    </p>
                  );
                }

                return (
                  <div className="flex flex-nowrap md:flex-wrap gap-1 min-[375px]:gap-1.25 min-[425px]:gap-1.5 sm:gap-1.5 md:gap-2">
                    <div className=" flex items-center text-center">
                      <div className="text-white bg-[#DB314F] z-20 font-medium text-[0.65rem] min-[375px]:text-[0.67rem] min-[425px]:text-[0.7rem] sm:text-[0.7rem] md:text-[0.875rem] border border-[#222] rounded-full px-1.5 min-[375px]:px-1.75 min-[425px]:px-2 sm:px-2 md:px-3 py-0.5 md:py-1">
                        Home
                      </div>
                      <div className="text-[#fff] ml-[-10px] min-[375px]:ml-[-12px] min-[425px]:ml-[-14px] sm:ml-[-14px] md:ml-[-20px] pl-[14px] min-[375px]:pl-[16px] min-[425px]:pl-[18px] sm:pl-[18px] md:pl-[24px] bg-[#4D2D99] z-10 font-medium text-[0.65rem] min-[375px]:text-[0.67rem] min-[425px]:text-[0.7rem] sm:text-[0.7rem] md:text-[0.875rem] border border-[#222] rounded-full px-1.5 min-[375px]:px-1.75 min-[425px]:px-2 sm:px-2 md:px-3 py-0.5 md:py-1">
                        {homeWin}%
                      </div>
                    </div>
                    <div className=" flex items-center text-center">
                      <div className="text-white bg-[#DB314F] z-20 font-medium text-[0.65rem] min-[375px]:text-[0.67rem] min-[425px]:text-[0.7rem] sm:text-[0.7rem] md:text-[0.875rem] border border-[#222] rounded-full px-1.5 min-[375px]:px-1.75 min-[425px]:px-2 sm:px-2 md:px-3 py-0.5 md:py-1">
                        Draw
                      </div>
                      <div className="text-[#fff] ml-[-10px] min-[375px]:ml-[-12px] min-[425px]:ml-[-14px] sm:ml-[-14px] md:ml-[-20px] pl-[14px] min-[375px]:pl-[16px] min-[425px]:pl-[18px] sm:pl-[18px] md:pl-[24px] bg-[#4D2D99] z-10 font-medium text-[0.65rem] min-[375px]:text-[0.67rem] min-[425px]:text-[0.7rem] sm:text-[0.7rem] md:text-[0.875rem] border border-[#222] rounded-full px-1.5 min-[375px]:px-1.75 min-[425px]:px-2 sm:px-2 md:px-3 py-0.5 md:py-1">
                        {draw}%
                      </div>
                    </div>
                    <div className=" flex items-center text-center">
                      <div className="text-white bg-[#DB314F] z-20 font-medium text-[0.65rem] min-[375px]:text-[0.67rem] min-[425px]:text-[0.7rem] sm:text-[0.7rem] md:text-[0.875rem] border border-[#222] rounded-full px-1.5 min-[375px]:px-1.75 min-[425px]:px-2 sm:px-2 md:px-3 py-0.5 md:py-1">
                        Away
                      </div>
                      <div className="text-[#fff] ml-[-10px] min-[375px]:ml-[-12px] min-[425px]:ml-[-14px] sm:ml-[-14px] md:ml-[-20px] pl-[14px] min-[375px]:pl-[16px] min-[425px]:pl-[18px] sm:pl-[18px] md:pl-[24px] bg-[#4D2D99] z-10 font-medium text-[0.65rem] min-[375px]:text-[0.67rem] min-[425px]:text-[0.7rem] sm:text-[0.7rem] md:text-[0.875rem] border border-[#222] rounded-full px-1.5 min-[375px]:px-1.75 min-[425px]:px-2 sm:px-2 md:px-3 py-0.5 md:py-1">
                        {awayWin}%
                      </div>
                    </div>

                  </div>
                );
              })()}
            </div>
          </div>
        ))}
     
      </div>
    </div>
  );
};

export default AccordianData;
