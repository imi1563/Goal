import React from "react";
import { useSelector } from "react-redux";
import NotificationIcon from "@/assests/icons/NotificationIcon.svg";

const DashboardHeader = ({ onOpenSidebar }) => {
  const user = useSelector((state) => state.auth?.user);
  const getUser = JSON.parse(localStorage.getItem("user") || '{}');
  return (
    <header className="flex items-center justify-between mx-auto w-full">
      <div className="flex p-4 rounded-lg bg-[#282353] items-center justify-between w-full">
        <div className="flex items-center gap-3 sm:gap-4">
          {onOpenSidebar && (
            <button
              className="text-white focus:outline-none lg:hidden"
              onClick={onOpenSidebar}
              aria-label="Open sidebar"
            >
              <svg width="28" height="28" fill="none">
                <rect width="28" height="28" rx="6" fill="#4C2D99" />
                <path
                  d="M8 14h12M8 10h12M8 18h12"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          )}
          <span className="text-white font-semibold text-lg sm:text-xl lg:text-2xl font-heading">
            Admin Panel
          </span>
        </div>
        <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
          <button
            className="relative p-2 order-2 sm:order-none"
            aria-label="Notifications"
          >
            {/* <img
              src={NotificationIcon}
              alt="Notifications"
              className="w-6 h-6 opacity-70 hover:opacity-100"
            /> */}
          </button>
          <div className="flex items-center gap-2">
            {getUser?.user?.avatar ? (
              <img
                src={getUser.user.avatar}
                alt="User"
                className="w-10 h-10 rounded-full object-cover border-2 border-[#4C2D99]"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-[#4C2D99] flex items-center justify-center text-white font-medium text-lg border-2 border-[#4C2D99]">
                {getUser?.user?.name ? getUser.user.name.charAt(0).toUpperCase() : 'U'}
              </div>
            )}
            <div className="hidden md:block">
              <div className="text-white font-medium text-sm whitespace-nowrap">
                {getUser?.user?.name || user?.fullName || "Admin User"}
              </div>
              <div className="text-[#b2b2d6] text-[10px] font-medium truncate max-w-[160px]">
                {getUser?.user?.email || "Imran@Senewtech.com"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
