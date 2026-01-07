// import { Hero } from "./home/index.js";
// import GetInTouch from "@/components/ui/GetInTouch";
// import CircularAvatar from "./home/CircularAvatar";
// import SecretSauce from "@/components/ui/SecretSauce";
// import TeamCarousel from "./home/TeamCarousel";
// import OurProgress from "./home/OurProgress";
// import Packages from "@/components/ui/Packages";
// import { homeFeatures } from "@/data/homeFeatures";
// import BannerSection from "@/components/ui/BannerSection";

import HeroSection from "../home/HeroSection";
import NowTrending from "../home/NowTrending";
import MainContent from "../home/MainContent";

const Home = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <NowTrending />
      <MainContent />
    </div>
  );
};

export default Home;
