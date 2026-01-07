import React from 'react'
import { useGetAiPickedWinnerQuery } from '@/services/Api';
import Loader from '../../../components/ui/Loader';

export const getMatchPrediction = (prediction, homeTeam, awayTeam) => {
    if (!prediction) return 'No prediction available';

    const { homeWin = 0, draw = 0, awayWin = 0 } = prediction;

    // Find the highest probability
    const maxProb = Math.max(homeWin, draw, awayWin);

    if (maxProb === homeWin) return `${homeTeam} to win`;
    if (maxProb === awayWin) return `${awayTeam} to win`;
    return 'Match likely to be a draw';
};

// Derive double-chance tag similar to AccordianData.jsx (1X / X2 / 12)
const getDoubleChanceTag = (prediction, homeTeam, awayTeam) => {
    const outcomes = prediction?.outcomes;
    if (!outcomes) return '';
    return outcomes?.homeWinBoolean ? `${homeTeam} to win` : outcomes?.drawBoolean ? `${awayTeam} to win` : outcomes?.awayWinBoolean ? `Both teams will score` : 'Draw';
};

const AiPickedWinner = () => {
    const { data, isLoading, isFetching } = useGetAiPickedWinnerQuery();
    const AiPickedWinnerData = data?.data?.items?.matches || [];

    return (
        <div className="bg-[#4C2D99] rounded-2xl p-0 overflow-hidden shadow-[0_4px_0_#221f3a] w-full lg:w-[283px]">
            <div className="relative bg-[#4C2D99] pl-16 pr-4 pt-5 pb-3 flex items-center">
                <img
                    src="/footbal.png"
                    alt="Play of the day"
                    className="w-16 h-16 absolute object-contain -top-2 -left-2"
                />
                <span className="text-[#FF4EC6] font-normal text-[28px] md:text-[45px] leading-none font-baloo-bhai text-outline-dark">
                    AI Picked <br /> Winners
                </span>
            </div>
            {(isFetching || isLoading) ? <>
                <Loader />
            </> : <>
                <div className="flex flex-col gap-6 px-4 pb-4 pt-2 ">
                    {AiPickedWinnerData?.map((g, idx) => (
                        <div
                            key={idx}
                            className="bg-[#432390] rounded-xl px-4 py-6 flex flex-col items-center "
                        >
                            <div className="flex items-center justify-around w-full gap-4 mb-2">
                                <div className="flex flex-col items-center w-1/3">
                                    <img
                                        src={g?.homeTeam?.logo || "/santos-1.png"}
                                        alt={g?.homeTeam?.name}
                                        className="w-8 h-8"
                                    />
                                    <span className="text-white text-sm text-center font-body mt-1">
                                        {g?.homeTeam?.name}
                                    </span>
                                </div>
                                <div className="w-1/3 flex items-center justify-center">
                                    <span className="bg-[#ECE9F7] text-[#432490] w-8 font-bold rounded-full h-8 flex items-center justify-center text-xs border border-[#221f3a]">
                                        VS
                                    </span>
                                </div>
                                <div className="flex flex-col items-center w-1/3">
                                    <img
                                        src={g?.awayTeam?.logo || "/santos-2.png"}
                                        alt={g?.awayTeam?.name}
                                        className="w-8 h-8"
                                    />
                                    <span className="text-white text-center text-sm font-body mt-1">
                                        {g?.awayTeam?.name}
                                    </span>
                                </div>
                            </div>
                            {/* {!!g?.prediction?.showFlags?.homeWinShow && ( */}
                            {/* <span className="bg-[#1C1A32] text-white text-sm rounded-full px-3 h-9 border border-[#2E2A57] flex items-center mt-2">
                                {getDoubleChanceTag(g?.prediction)}
                            </span> */}
                            {/* )} */}
                            <span className="text-white text-[1rem] font-normal mt-4 font-body text-center">
                                {getDoubleChanceTag(g?.prediction, g?.homeTeam?.name, g?.awayTeam?.name)}
                            </span>
                        </div>
                    ))}
                </div>
            </>}
            {AiPickedWinnerData?.length === 0 &&
                <div className="flex justify-center text-white text-[1rem] font-normal mt-4 font-body text-center items-center h-[200px]">
                    No data available
                </div>
            }
        </div>
    )
}

export default AiPickedWinner