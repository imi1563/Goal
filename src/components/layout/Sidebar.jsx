import { Link, useLocation, useNavigate } from "react-router-dom";
import { IoGridOutline } from "react-icons/io5";
import { LuBox } from "react-icons/lu";
import { useAuth } from "@/context/AuthContext";
import cupIcon from "@/assests/icons/cupIcon.svg";
import { GiTrophyCup } from "react-icons/gi";

const Sidebar = ({ onClose, isCollapsed, onToggleCollapse }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const handelLogout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
    // window.location.reload();
  };

  const navigation = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: IoGridOutline,
      requiredRole: null,
    },
    {
      name: "Match Management",
      href: "/dashboard/match-management",
      icon: LuBox,
      requiredRole: null,
    },
    {
      name: "League Management",
      href: "/dashboard/league-management",
      icon: GiTrophyCup,
      requiredRole: null,
    },
  ];

  const canAccess = (item) => {
    if (!item.requiredRole) return true;
    return user?.role === item.requiredRole || user?.role === "admin";
  };

  const handleNavigation = () => {
    // If we're on mobile drawer, clicking should close drawer
    if (onClose && typeof window !== "undefined" && window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <div
      className={`flex flex-col bg-[#282353] border-r border-[#2c2752] relative h-screen ${isCollapsed ? "w-20" : "w-64"
        }`}
    >
      {/* Header with logo and close button (works on mobile and desktop) */}
      <div
        className={`flex items-center gap-2 ${isCollapsed ? "px-3 justify-center" : "px-6"
          } py-6 border-b border-[#2c2752] relative`}
      >
        {isCollapsed ? (
          <img src="/football.svg" alt="logo" className="h-10 w-10" />
        ) : (
          <img src="/dashboard-logo.png" alt="logo" className="h-7" />
        )}
        <button
          onClick={() => {
            if (typeof window !== "undefined" && window.innerWidth >= 1024) {
              onToggleCollapse?.();
            } else {
              onClose?.();
            }
          }}
          className={`absolute top-1/2 -right-4 -translate-y-1/2 bg-[#282353] border-2 border-[#1E1B3A] rounded-full text-white transform transition-transform ${isCollapsed ? "p-0.7 scale-60" : "p-1 scale-100"
            }`}
          aria-label="Toggle sidebar"
        >
          <svg width="24" height="24" fill="none">
            <circle
              cx="12"
              cy="12"
              r="11"
              fill="#282353"
              stroke="transparent"
              strokeWidth="2"
            />
            {isCollapsed ? (
              <path
                d="M9 8l6 4-6 4"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ) : (
              <path
                d="M15 8l-6 4 6 4"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 h-full flex flex-col gap-2 mt-4 overflow-y-auto pb-24">
        {navigation.filter(canAccess).map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              onClick={handleNavigation}
              className={`group relative flex items-center ${isCollapsed ? "justify-center" : "gap-3 px-6"
                } py-3 text-base font-medium rounded-lg transition ${isActive
                  ? "bg-[#262C36] text-white "
                  : "text-[#b2b2d6] hover:bg-[#262C36] hover:text-white"
                }`}
            >
              {!isCollapsed && isActive && (
                <span className="absolute -left-2 top-1/2 -translate-y-1/2">
                  <svg
                    width="24"
                    height="56"
                    viewBox="0 0 12 56"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M-0.000976562 14.7015C-0.000976562 15.0399 0.26907 15.3166 0.607422 15.3247C6.85515 15.621 11.8232 20.4522 11.8232 26.3687C11.8232 36.2083 -0.000976562 45.4037 -0.000976562 55.2434V69.1182C-0.000976562 71.2952 -1.76582 73.0601 -3.94287 73.0601C-6.11992 73.0601 -7.88477 71.2952 -7.88477 69.1182V44.0415C-7.88477 38.0623 -11.8262 32.3478 -11.8262 26.3687C-11.8261 20.3889 -7.88477 14.6737 -7.88477 8.69393V-12.6943C-7.88477 -14.8714 -6.11992 -16.6362 -3.94287 -16.6362C-1.76582 -16.6362 -0.000976562 -14.8714 -0.000976562 -12.6943V14.7015Z"
                      fill="#6C5CF8"
                    />
                  </svg>
                </span>
              )}
              {typeof item.icon === "string" ? (
                <span
                  className={`h-5 w-5 inline-block ${isActive
                    ? "bg-[#4F3DED]"
                    : "bg-[#b2b2d6] group-hover:bg-white"
                    }`}
                  style={{
                    WebkitMaskImage: `url(${item.icon})`,
                    maskImage: `url(${item.icon})`,
                    WebkitMaskRepeat: "no-repeat",
                    maskRepeat: "no-repeat",
                    WebkitMaskPosition: "center",
                    maskPosition: "center",
                    WebkitMaskSize: "contain",
                    maskSize: "contain",
                  }}
                />
              ) : (
                <item.icon
                  className={`h-5 w-5 ${isActive
                    ? "text-[#4F3DED]"
                    : "text-[#b2b2d6] group-hover:text-white"
                    }`}
                />
              )}
              {!isCollapsed && (
                <span className="whitespace-nowrap">{item.name}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div
        className={`${isCollapsed ? "px-0" : "px-6"
          } py-6 absolute bottom-0 left-0 right-0 bg-[#282353] border-t border-[#2c2752]`}
      >
        <button
          onClick={handelLogout}
          className={`w-full flex items-center ${isCollapsed ? "justify-center" : "gap-2"
            } text-[#b2b2d6] hover:text-white text-base font-medium`}
        >
          <svg
            width="18"
            height="21"
            viewBox="0 0 18 21"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.19563 0.880005C12.4976 0.880005 16.7956 5.17807 16.7956 10.48C16.7956 15.7819 12.4976 20.08 7.19563 20.08M4.79557 14.32L0.955566 10.48M0.955566 10.48L4.79557 6.64001M0.955566 10.48H12.9556"
              stroke="#B8C0CC"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {!isCollapsed && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
