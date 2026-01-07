import { useEffect, useRef } from 'react';

const About = () => {
  const sectionsRef = useRef([]);

  useEffect(() => {
    // Intersection Observer for fade-in animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    sectionsRef.current.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => {
      sectionsRef.current.forEach((section) => {
        if (section) observer.unobserve(section);
      });
    };
  }, []);

  const aboutData = [
    {
      title: "What We Do",
      content: "We analyze football matches using advanced computational methods, including:",
      list: [
        "Statistical modeling",
        "Probability calculations",
        "Machine learning techniques",
        "Poisson-based analysis",
        "Monte Carlo simulations",
        "AI-assisted data processing"
      ],
      subContent: "By combining these approaches, we transform raw football data into structured insights that help users explore the game from a data-driven perspective."
    },
    {
      title: "Our Philosophy",
      content: "Football is unpredictable and that is part of what makes it special. Numbers and models cannot guarantee outcomes, but they can offer context, patterns, and probabilities based on historical data.",
      subContent: "We believe in:",
      list: [
        "Transparency over hype",
        "Data over opinions",
        "Curiosity over certainty"
      ]
    },
    {
      title: "What We Are Not",
      highlight: true,
      list: [
        "We are not a betting platform",
        "We do not offer betting tips or gambling advice",
        "We do not promote or encourage gambling"
      ],
      subContent: "All content on goalshots.com is provided for informational and educational purposes only."
    },
    {
      title: "Our Mission",
      content: "Our mission is simple: to bring together football passion and data science, making advanced statistical analysis easy to explore for anyone interested in the game.",
      highlight: "If you enjoy football and numbers, you are in the right place."
    }
  ];

  return (
    <div className="min-h-screen bg-[#1E1B3A] py-12 px-4 sm:px-6 lg:px-8">
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.6s ease-out forwards;
        }
        .section-item {
          opacity: 0;
        }
      `}</style>

      <div className="max-w-4xl mx-auto">
        {/* Header Section with Animation */}
        <div className="text-center mb-12" style={{ animation: 'fadeIn 0.6s ease-out forwards' }}>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-body">
            About <span className="text-[#09C7A4]">Us</span>
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-[#09C7A4] to-[#4F3DFF] mx-auto rounded-full mb-6"></div>
        </div>

        {/* Introduction Section */}
        <div className="mb-8" style={{ animation: 'fadeIn 0.6s ease-out forwards' }}>
          <div className="bg-[#2A2548] rounded-lg p-6 md:p-8 border border-[#3A3458] hover:border-[#09C7A4]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[#09C7A4]/10">
            <p className="text-[#D7D4EC] text-base md:text-lg leading-relaxed font-body mb-4">
              <span className="text-[#09C7A4] font-semibold">goalshots.com</span> is a football analytics platform built by people who are passionate about the game and curious about what data can reveal behind the action on the pitch.
            </p>
            <p className="text-[#D7D4EC] text-base md:text-lg leading-relaxed font-body">
              We focus on football statistics, mathematical analysis, and probability-based insights to better understand matches, teams, and trends. Our goal is not to predict outcomes or give advice, but to present objective data in a clear and accessible way.
            </p>
          </div>
        </div>

        {/* About Content Sections */}
        <div className="space-y-6">
          {aboutData.map((section, index) => (
            <div
              key={index}
              ref={(el) => (sectionsRef.current[index] = el)}
              className={`section-item bg-[#2A2548] rounded-lg p-6 md:p-8 border border-[#3A3458] hover:border-[#09C7A4]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[#09C7A4]/10 ${section.highlight ? 'border-[#D20123]/50 hover:border-[#D20123]/70' : ''}`}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-white font-body mb-4">
                {section.title}
              </h2>
              
              <div className="space-y-4">
                {section.content && (
                  <p className="text-[#D7D4EC] text-base md:text-lg leading-relaxed font-body">
                    {section.content}
                  </p>
                )}
                
                {section.subContent && !section.list && (
                  <p className="text-[#D7D4EC] text-base md:text-lg leading-relaxed font-body">
                    {section.subContent}
                  </p>
                )}

                {section.subContent && section.list && (
                  <p className="text-[#D7D4EC] text-base md:text-lg leading-relaxed font-body font-semibold">
                    {section.subContent}
                  </p>
                )}
                
                {section.list && (
                  <ul className="list-none space-y-2 ml-0 mt-2">
                    {section.list.map((item, idx) => (
                      <li 
                        key={idx}
                        className={`text-base md:text-lg flex items-start gap-3 font-body ${section.highlight ? 'text-[#D20123]' : 'text-[#B8B9D3]'}`}
                      >
                        <span className={`mt-1.5 flex-shrink-0 ${section.highlight ? 'text-[#D20123]' : 'text-[#09C7A4]'}`}>▸</span>
                        <span className="flex-1">{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
                
                {section.highlight && typeof section.highlight === 'string' && (
                  <div className="mt-4 p-4 bg-[#1E1B3A] border-l-4 border-[#09C7A4] rounded-r-lg">
                    <p className="text-[#09C7A4] font-semibold text-base md:text-lg font-body">
                      {section.highlight}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Closing Statement */}
        <div className="mt-12 mb-8 text-center" style={{ animation: 'fadeIn 0.6s ease-out forwards' }}>
          <div className="bg-gradient-to-r from-[#2A2548] to-[#3A3458] rounded-lg p-8 border border-[#09C7A4]/30 shadow-lg">
            <p className="text-[#D7D4EC] text-lg md:text-xl font-medium font-body leading-relaxed">
              If you enjoy football and numbers, you are in the right place.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
