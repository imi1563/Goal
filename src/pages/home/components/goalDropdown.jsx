import React, { useRef, useState } from 'react'

const GoalDropdown = ({ game, gidx }) => {
    const dropdownRef = useRef(null);
    const [openOverDropdown, setOpenOverDropdown] = useState(null);
    const [selectedOverValues, setSelectedOverValues] = useState({});
    const [selectedGoals, setSelectedGoals] = useState(null);
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
        <>
            {/* {game?.overGoals && game?.overGoals.length > 0 && (
                <span className="bg-[#1C1A32] text-white text-sm rounded-full px-3 h-9 border border-[#2E2A57] flex items-center">
                    Over {game?.overGoals[2].label} Goals
                </span>
            )} */}
            {(game?.overGoals && game?.overGoals?.length > 0) && (
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => toggleOverDropdown(gidx)}
                        className="bg-[#1C1A32] text-white text-sm rounded-full h-9 px-4 border border-[#2E2A57] flex items-center hover:bg-[#2A2648] transition-colors"
                    >
                        <span className="w-5 h-5 mr-2 rounded-full border border-[#2E2A57] flex items-center justify-center">
                            ▾
                        </span>
                        {(() => {
                            const defaultOver = game?.overGoals?.find((o) => String(o.label) === '9.5') || game?.overGoals?.[0];
                            const current = selectedGoals || defaultOver;
                            return `Over ${current?.label}`;
                        })()}
                    </button>

                    {openOverDropdown === gidx && (
                        <div className="absolute top-full left-0 mt-2 bg-[#1C1A32] border border-[#2E2A57] rounded-lg shadow-lg z-[999] min-w-[120px] max-h-40 overflow-y-auto">
                            {game?.overGoals.map((item) => (
                                <button
                                    key={item?.value}
                                    onClick={() => selectOverValue(gidx, item)}
                                    className="w-full text-left px-4 py-2 text-white text-sm hover:bg-[#2A2648] transition-colors border-b border-[#2E2A57] last:border-b-0"
                                >
                                    Over {item?.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}

        </>
    )
}

export default GoalDropdown