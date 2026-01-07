import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { GrInProgress } from "react-icons/gr";
import { GiClockwork } from "react-icons/gi";
import { FaTrophy } from "react-icons/fa6";
import { useGetSimulationStatsQuery } from "@/services/Api";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  // Fetch stats
  const { data: statsData, isFetching } = useGetSimulationStatsQuery();
  const simulated = statsData?.data?.homepageMatchesCount || 0;
  const upcoming = statsData?.data?.upcomingMatchesCount || 0;
  const won = statsData?.data?.wonTotal || 0;

  const StatusItem = ({ label, icon, value }) => (
    <div className="flex flex-col items-center">
      <span className="text-white mb-1 text-sm md:text-[15px] font-semibold lowercase">
        {label}
      </span>
      <div className="flex items-center">
        <span className="w-14 h-14 flex items-center justify-center rounded-full bg-[#4F3DFF] border-2 border-black relative z-10">
          {icon}
        </span>
        <span className="h-10 -ml-2 px-5 rounded-r-full rounded-l-none bg-[#BAFF1A] text-black font-semibold text-base flex items-center border-2 border-[#0F0E1F]">
          {value}
        </span>
      </div>
    </div>
  );

  return (
    <nav className="bg-[#1E1B3A] w-full px-4 md:px-10 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Link
            to="/"
            className="text-lg md:text-2xl font-bold"
            style={{ fontFamily: "'Baloo Bhai 2', cursive" }}
          >
            <span className="text-[#d6ff2a]">goal</span>
            <span className="text-[#3be0ff]">shots</span>
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-10">
          {/* Status Buttons */}
          {/* <div className="flex items-end space-x-6">
            <StatusItem
              label="simulated"
              value={simulated}
              icon={<GrInProgress className="text-white w-6 h-6" />}
            />
            <StatusItem
              label="upcoming"
              value={upcoming}
              icon={<GiClockwork className="text-white w-6 h-6" />}
            />
            <StatusItem
              label="won"
              value={won}
              icon={<FaTrophy className="text-white w-6 h-6" />}
            />
          </div> */}
          {/* Contact Link */}
          {/* <a
            href="#"
            className="ml-8 text-[#baff1a] text-sm font-medium hover:underline"
            style={{ fontFamily: "'Baloo 2', sans-serif" }}
          >
            contact
          </a> */}
        </div>

        {/* Hamburger for Mobile */}
        {/* <button
          className="md:hidden text-[#baff1a] focus:outline-none"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            {open ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 8h16M4 16h16"
              />
            )}
          </svg>
        </button> */}
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden mt-4 flex flex-col items-center space-y-4">
          {/* Status Buttons in Column */}
          <div className="flex flex-col items-center space-y-4 w-full">
            <StatusItem
              label="simulated"
              value={simulated}
              icon={<GrInProgress className="text-white w-5 h-5" />}
            />
            <StatusItem
              label="upcoming"
              value={upcoming}
              icon={<GiClockwork className="text-white w-5 h-5" />}
            />
            <StatusItem
              label="won"
              value={won}
              icon={<FaTrophy className="text-white w-5 h-5" />}
            />
          </div>
          {/* Contact Link */}
          <a
            href="#"
            className="text-[#baff1a] text-sm font-medium hover:underline"
            style={{ fontFamily: "'Baloo 2', sans-serif" }}
          >
            contact
          </a>
        </div>
      )}
    </nav>
  );
}
