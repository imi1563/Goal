import { useEffect, useRef } from 'react';

const TermsAndConditions = () => {
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

  const termsData = [
    {
      number: 1,
      title: "Introduction",
      content: "Welcome to goalshots.com. We are a football-focused platform created by people who are passionate about the sport and interested in data, statistics, and mathematical analysis. By accessing or using this website, you agree to these Terms & Conditions. If you do not agree, please discontinue use of the website."
    },
    {
      number: 2,
      title: "Purpose of the Website",
      content: "The website provides football-related statistical data, probability estimates, and analytical insights derived from mathematical models and advanced computational methods.",
      subContent: "Our content is created for informational and educational purposes only. We do not offer betting tips, gambling advice, financial advice, or any form of recommendation on how to act on the information provided."
    },
    {
      number: 3,
      title: "Methodology and Data",
      content: "The data and insights displayed on this website are generated using a combination of:",
      list: [
        "Statistical analysis",
        "Mathematical probability models",
        "Machine learning techniques",
        "Poisson-based calculations",
        "Monte Carlo simulations",
        "Artificial intelligence–assisted data processing"
      ],
      subContent: "These methods are used to analyze football matches and historical data in order to present objective statistical perspectives, not predictions or guarantees of outcomes."
    },
    {
      number: 4,
      title: "No Gambling Promotion",
      content: "This website does not promote, encourage, or support gambling or sports betting in any form. Any interpretation of the data for betting or gambling purposes is done entirely at the user's own discretion and responsibility.",
      highlight: "We are a data and analytics platform only."
    },
    {
      number: 5,
      title: "Disclaimer of Liability",
      content: "All information on this website is provided on an \"as is\" basis. While we strive to ensure accuracy and quality, we make no guarantees regarding:",
      list: [
        "Accuracy",
        "Completeness",
        "Reliability",
        "Suitability for any specific purpose"
      ],
      subContent: "We are not responsible for any decisions, actions, or outcomes resulting from the use of the information available on this website, including but not limited to financial losses or damages."
    },
    {
      number: 6,
      title: "No Guarantees",
      content: "Football is unpredictable by nature. Statistical models and probability estimates reflect historical data and assumptions, not certainties. Past data and calculated probabilities do not guarantee future outcomes."
    },
    {
      number: 7,
      title: "User Responsibility",
      content: "By using this website, you acknowledge that:",
      list: [
        "You understand the informational nature of the content",
        "You are solely responsible for how you interpret and use the data",
        "You will comply with all applicable local laws and regulations"
      ]
    },
    {
      number: 8,
      title: "Age Requirement",
      content: "This website is intended for users who are 18 years of age or older. By accessing the site, you confirm that you meet this requirement."
    },
    {
      number: 9,
      title: "GDPR & Data Protection",
      content: "We respect user privacy and are committed to complying with GDPR and applicable data protection laws.",
      list: [
        "We do not sell personal data",
        "Any personal data collected (if applicable) is used solely to improve the website experience",
        "Users have the right to request access, correction, or deletion of their personal data"
      ],
      subContent: "For more details, please refer to our Privacy Policy."
    },
    {
      number: 10,
      title: "Intellectual Property",
      content: "All content on this website, including text, data, models, designs, and branding, is the intellectual property of the website unless otherwise stated. Unauthorized use, reproduction, or redistribution is prohibited."
    },
    {
      number: 11,
      title: "Changes to These Terms",
      content: "We may update these Terms & Conditions from time to time. Any changes will be effective immediately upon posting. Continued use of the website constitutes acceptance of the updated terms."
    },
    {
      number: 12,
      title: "Contact",
      content: "If you have any questions regarding these Terms & Conditions, please contact us through the official contact methods provided on the website."
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
            Terms & <span className="text-[#09C7A4]">Conditions</span>
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-[#09C7A4] to-[#4F3DFF] mx-auto rounded-full"></div>
        </div>

        {/* Terms Content */}
        <div className="space-y-6">
          {termsData.map((term, index) => (
            <div
              key={term.number}
              ref={(el) => (sectionsRef.current[index] = el)}
              className="section-item bg-[#2A2548] rounded-lg p-6 md:p-8 border border-[#3A3458] hover:border-[#09C7A4]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[#09C7A4]/10"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-[#09C7A4] to-[#4F3DFF] rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  {term.number}
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white font-body flex-1 pt-1">
                  {term.title}
                </h2>
              </div>
              
              <div className="ml-14 space-y-4">
                <p className="text-[#D7D4EC] text-base md:text-lg leading-relaxed font-body">
                  {term.content}
                </p>
                
                {term.list && (
                  <ul className="list-none space-y-2 ml-4">
                    {term.list.map((item, idx) => (
                      <li 
                        key={idx}
                        className="text-[#B8B9D3] text-base md:text-lg flex items-start gap-3 font-body"
                      >
                        <span className="text-[#09C7A4] mt-2 flex-shrink-0">▸</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
                
                {term.subContent && (
                  <p className="text-[#D7D4EC] text-base md:text-lg leading-relaxed font-body mt-4">
                    {term.subContent}
                  </p>
                )}
                
                {term.highlight && (
                  <div className="mt-4 p-4 bg-[#1E1B3A] border-l-4 border-[#09C7A4] rounded-r-lg">
                    <p className="text-[#09C7A4] font-semibold text-base md:text-lg font-body">
                      {term.highlight}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Agreement Section */}
        <div className="mt-12 mb-8 text-center" style={{ animation: 'fadeIn 0.6s ease-out forwards' }}>
          <div className="bg-gradient-to-r from-[#2A2548] to-[#3A3458] rounded-lg p-8 border border-[#09C7A4]/30 shadow-lg">
            <div className="flex items-start justify-center gap-3 text-left max-w-3xl mx-auto">
              <input
                type="checkbox"
                id="terms-agreement"
                className="mt-1 w-5 h-5 rounded border-[#3A3458] bg-[#1E1B3A] text-[#09C7A4] focus:ring-2 focus:ring-[#09C7A4] focus:ring-offset-2 focus:ring-offset-[#2A2548] cursor-pointer accent-[#09C7A4] flex-shrink-0"
                style={{ accentColor: '#09C7A4' }}
              />
              <label htmlFor="terms-agreement" className="text-[#D7D4EC] text-lg md:text-xl font-medium font-body leading-relaxed cursor-pointer">
                By using this website, you confirm that you have read, understood, and agreed to these Terms & Conditions.
              </label>
            </div>
          </div>
        </div>

     
      </div>
    </div>
  );
};

export default TermsAndConditions;

