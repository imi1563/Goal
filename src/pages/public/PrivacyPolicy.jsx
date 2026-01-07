import { useEffect, useRef, useState } from 'react';

const PrivacyPolicy = () => {
  const sectionsRef = useRef([]);
  const [lastUpdated] = useState(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }));

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

  const privacyData = [
    {
      number: 1,
      title: "Who We Are",
      content: "goalshots.com is a football statistics and analytics platform focused on providing data-driven insights based on mathematical models, probabilities, and statistical analysis.",
      subContent: "If you have any questions regarding this Privacy Policy, you may contact us through the contact details provided on the website."
    },
    {
      number: 2,
      title: "What Data We Collect",
      content: "We aim to collect as little personal data as possible. Depending on how you use the website, we may collect:",
      subsections: [
        {
          title: "a) Personal Data (only if provided by you)",
          list: [
            "Email address (for contact forms or newsletters, if available)",
            "Any information you voluntarily submit via forms"
          ]
        },
        {
          title: "b) Non-Personal / Technical Data",
          list: [
            "IP address (anonymized where possible)",
            "Browser type and version",
            "Device type",
            "Operating system",
            "Pages visited and interaction data"
          ],
          note: "This data is collected for analytics, security, and website improvement purposes."
        }
      ]
    },
    {
      number: 3,
      title: "How We Use Your Data",
      content: "We use collected data only for legitimate purposes, including:",
      list: [
        "Operating and maintaining the website",
        "Improving content, performance, and user experience",
        "Responding to user inquiries",
        "Ensuring website security",
        "Analyzing aggregated usage statistics"
      ],
      subContent: "We do not use personal data for automated decision-making or profiling."
    },
    {
      number: 4,
      title: "Legal Basis for Processing (GDPR)",
      content: "Under GDPR, we process personal data based on one or more of the following legal grounds:",
      list: [
        "Your consent",
        "Legitimate interests (website functionality, analytics, security)",
        "Legal obligations, where applicable"
      ]
    },
    {
      number: 5,
      title: "Cookies & Tracking Technologies",
      content: "We use cookies and similar technologies to ensure the proper functioning of the website and to understand how users interact with our content.",
      list: [
        "Essential cookies (required for basic functionality)",
        "Analytics cookies (to understand website usage)"
      ],
      subContent: "You can manage or disable cookies through your browser settings.",
      highlight: "👉 Note: A dedicated Cookie Policy may be provided separately or combined with this Privacy Policy for clarity."
    },
    {
      number: 6,
      title: "Data Sharing",
      content: "We do not sell or rent your personal data.",
      subContent: "We may share limited data with trusted third-party service providers (e.g. analytics or hosting services) strictly for website operation and only under data protection agreements."
    },
    {
      number: 7,
      title: "Data Retention",
      content: "We retain personal data only for as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required by law."
    },
    {
      number: 8,
      title: "Data Security",
      content: "We implement appropriate technical and organizational measures to protect your data against unauthorized access, loss, or misuse.",
      subContent: "However, no online system can be guaranteed to be 100% secure."
    },
    {
      number: 9,
      title: "Third-Party Links",
      content: "Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of those sites."
    },
    {
      number: 10,
      title: "Changes to This Policy",
      content: "We may update this Privacy Policy from time to time. Any changes will be posted on this page and will take effect immediately."
    },
    {
      number: 11,
      title: "Contact",
      content: "If you have questions about this Privacy Policy or how your data is handled, please contact us via the contact information available on goalshots.com."
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
        <div className="text-center mb-8" style={{ animation: 'fadeIn 0.6s ease-out forwards' }}>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-body">
            Privacy <span className="text-[#09C7A4]">Policy</span>
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-[#09C7A4] to-[#4F3DFF] mx-auto rounded-full mb-4"></div>
         
        </div>

        {/* Introduction */}
        <div className="mb-8" style={{ animation: 'fadeIn 0.6s ease-out forwards' }}>
          <div className="bg-[#2A2548] rounded-lg p-6 md:p-8 border border-[#3A3458]">
            <p className="text-[#D7D4EC] text-base md:text-lg leading-relaxed font-body">
              This Privacy Policy explains how <span className="text-[#09C7A4] font-semibold">goalshots.com</span> ("we", "our", or "us") collects, uses, and protects your personal data when you use our website. This policy is designed to comply with GDPR and other generally applicable data protection laws.
            </p>
          </div>
        </div>

        {/* Privacy Content */}
        <div className="space-y-6">
          {privacyData.map((section, index) => (
            <div
              key={section.number}
              ref={(el) => (sectionsRef.current[index] = el)}
              className="section-item bg-[#2A2548] rounded-lg p-6 md:p-8 border border-[#3A3458] hover:border-[#09C7A4]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[#09C7A4]/10"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-[#09C7A4] to-[#4F3DFF] rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  {section.number}
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white font-body flex-1 pt-1">
                  {section.title}
                </h2>
              </div>
              
              <div className="ml-14 space-y-4">
                <p className="text-[#D7D4EC] text-base md:text-lg leading-relaxed font-body">
                  {section.content}
                </p>
                
                {section.subsections && (
                  <div className="space-y-4 mt-4">
                    {section.subsections.map((subsection, subIdx) => (
                      <div key={subIdx} className="ml-0">
                        <h3 className="text-[#09C7A4] font-semibold text-base md:text-lg mb-3 font-body">
                          {subsection.title}
                        </h3>
                        {subsection.list && (
                          <ul className="list-none space-y-2 ml-0 mt-2">
                            {subsection.list.map((item, idx) => (
                              <li 
                                key={idx}
                                className="text-[#B8B9D3] text-base md:text-lg flex items-start gap-3 font-body"
                              >
                                <span className="text-[#09C7A4] mt-1.5 flex-shrink-0">▸</span>
                                <span className="flex-1">{item}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                        {subsection.note && (
                          <p className="text-[#D7D4EC] text-sm md:text-base italic mt-3 ml-0 font-body">
                            {subsection.note}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                
                {section.list && !section.subsections && (
                  <ul className="list-none space-y-2 ml-0 mt-2">
                    {section.list.map((item, idx) => (
                      <li 
                        key={idx}
                        className="text-[#B8B9D3] text-base md:text-lg flex items-start gap-3 font-body"
                      >
                        <span className="text-[#09C7A4] mt-1.5 flex-shrink-0">▸</span>
                        <span className="flex-1">{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
                
                {section.subContent && (
                  <p className="text-[#D7D4EC] text-base md:text-lg leading-relaxed font-body mt-4">
                    {section.subContent}
                  </p>
                )}
                
                {section.highlight && (
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

        {/* Footer Agreement Section */}
        <div className="mt-12 mb-8 text-center" style={{ animation: 'fadeIn 0.6s ease-out forwards' }}>
          <div className="bg-gradient-to-r from-[#2A2548] to-[#3A3458] rounded-lg p-8 border border-[#09C7A4]/30 shadow-lg">
            <div className="flex items-start justify-center gap-3 text-left max-w-3xl mx-auto">
              <input
                type="checkbox"
                id="privacy-agreement"
                className="mt-1 w-5 h-5 rounded border-[#3A3458] bg-[#1E1B3A] text-[#09C7A4] focus:ring-2 focus:ring-[#09C7A4] focus:ring-offset-2 focus:ring-offset-[#2A2548] cursor-pointer accent-[#09C7A4] flex-shrink-0"
                style={{ accentColor: '#09C7A4' }}
              />
              <label htmlFor="privacy-agreement" className="text-[#D7D4EC] text-lg md:text-xl font-medium font-body leading-relaxed cursor-pointer">
                By using goalshots.com, you acknowledge that you have read and understood this Privacy Policy.
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;

