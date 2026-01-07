import React from "react";
import SplitText from "../../components/ui/SplitText";

export default function HeroSection() {
  const handleAnimationComplete = () => {
    console.log("All letters have animated!");
  };

  return (
    <section className="w-full bg-[#1E1B3A] py-6 px-4 flex flex-col items-center overflow-x-hidden">
      <div className="max-w-[1300px] my-10 w-full mx-auto flex flex-col items-center text-center px-2">
        <SplitText
          text="Where Sports Meet Statistics"
          className="font-body font-bold text-4xl lg:text-[69px] text-[#FFDE00] leading-[1.05] mb-2"
          tag="h1"
          delay={170}
          duration={1.3}
          ease="elastic.out(1, 0.3)"
          splitType="lines"
          from={{ opacity: 0, y: 40 }}
          to={{ opacity: 1, y: 0 }}
          threshold={0.1}
          rootMargin="-100px"
          textAlign="center"
          onLetterAnimationComplete={handleAnimationComplete}
          customStyle={{
            textShadow:
              "0 4.8px 0 #000, 0 -2.5px 0 #000, 2.5px 0 0 #000, -2.5px 0 0 #000",
          }}
        />
        <p
          className="font-body text-white text-base md:text-lg font-bold mb-4"
          style={{
            textShadow:
              "0 1.5px 0 #000, 0 -1.5px 0 #000, 1.5px 0 0 #000, -1.5px 0 0 #000",
          }}
        >
          Not your average guesswork. Just pure AI, stats, and simulation
          muscle.
        </p>
        <div className="flex justify-center">
          <div className="flex items-center gap-4 rounded-full px-1 py-1 bg-[#1E1B3A] border border-[#2F2B58] shadow-[0_6px_16px_rgba(17,16,35,0.45)] ring-1 ring-white/5">
            <span className="flex items-center bg-[#4136AA] text-white text-xs md:text-sm font-semibold rounded-full px-4 py-2 shadow-inner">
              Hot <span className="ml-1">🔥</span>
            </span>
            <span className="text-white text-xs md:text-md font-medium font-body mr-4">
              Every match teaches us. Every game simulated 100,000 times.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
