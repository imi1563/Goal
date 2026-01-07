import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-[#221f3a] w-full py-10">
      <div className="w-full flex flex-col md:flex-row items-start md:items-start gap-8 md:gap-16 px-4 md:px-4">
        {/* Left: Logo and Disclaimer */}
        <div className="flex-1 min-w-0">
          <div className="mb-4">
            <Link
              to="/"
              className="text-2xl font-bold"
              style={{ fontFamily: "'Baloo Bhai 2', cursive" }}
            >
              <span className="text-[#d6ff2a]">goal</span>
              <span className="text-[#3be0ff]">shots</span>
            </Link>
          </div>
          <p className="text-xs text-white max-w-xl leading-relaxed font-body">
            The predictions and simulations provided on this website are generated using AI models, statistical analysis, and probabilistic calculations. While we strive for accuracy, no outcome is guaranteed. The information presented is for informational and entertainment purposes only and should not be considered betting advice or a recommendation to place wagers. Users are solely responsible for any decisions they make based on this content. We do not encourage or promote gambling, and we disclaim any liability for financial losses or other consequences resulting from the use of our data.
          </p>
        </div>
        {/* Right: Links */}
        <div className="flex flex-col space-y-2 min-w-[140px] md:mt-2">
          <Link to="/contact" className="text-[#baff1a] text-sm font-medium hover:underline font-body">Contact</Link>
          <Link to="/about" className="text-[#baff1a] text-sm font-medium hover:underline font-body">About Us</Link>
          <Link to="/terms-and-conditions" className="text-[#baff1a] text-sm font-medium hover:underline font-body">Terms &amp; Conditions</Link>
          <Link to="/privacy-policy" className="text-[#baff1a] text-sm font-medium hover:underline font-body">Privacy</Link>
        </div>
      </div>
    </footer>
  );
}