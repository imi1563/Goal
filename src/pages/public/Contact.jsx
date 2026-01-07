import { useState, useEffect, useRef } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    alert('Message sent! (This is a demo)');
    setFormData({ name: '', email: '', message: '' });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      value: 'contact@goalshots.com',
      description: 'Send us an email anytime'
    },
    {
      icon: Phone,
      title: 'Phone',
      value: 'Available on request',
      description: 'Contact us for phone support'
    },
    {
      icon: MapPin,
      title: 'Location',
      value: 'Online Platform',
      description: 'We operate digitally worldwide'
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

      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12" style={{ animation: 'fadeIn 0.6s ease-out forwards' }}>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-body">
            Contact <span className="text-[#09C7A4]">Us</span>
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-[#09C7A4] to-[#4F3DFF] mx-auto rounded-full mb-4"></div>
          <p className="text-[#D7D4EC] text-lg md:text-xl font-body">
            Get in touch with our team
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div ref={(el) => (sectionsRef.current[0] = el)} className="section-item">
            <div className="bg-[#2A2548] rounded-lg p-6 md:p-8 border border-[#3A3458] hover:border-[#09C7A4]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[#09C7A4]/10 h-full">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 font-body">
                Get in Touch
              </h2>
              <div className="space-y-6">
                {contactInfo.map((info, index) => {
                  const IconComponent = info.icon;
                  return (
                    <div
                      key={index}
                      className="flex items-start gap-4 p-4 rounded-lg bg-[#1E1B3A] border border-[#3A3458] hover:border-[#09C7A4]/50 transition-all duration-300"
                    >
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#09C7A4] to-[#4F3DFF] rounded-full flex items-center justify-center shadow-lg">
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-white text-lg mb-1 font-body">
                          {info.title}
                        </h3>
                        <p className="text-[#09C7A4] font-medium text-base mb-1 font-body">
                          {info.value}
                        </p>
                        <p className="text-[#B8B9D3] text-sm font-body">
                          {info.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div ref={(el) => (sectionsRef.current[1] = el)} className="section-item">
            <div className="bg-[#2A2548] rounded-lg p-6 md:p-8 border border-[#3A3458] hover:border-[#09C7A4]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[#09C7A4]/10 h-full">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 font-body">
                Send us a Message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-[#D7D4EC] mb-2 font-body">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-[#1E1B3A] border border-[#3A3458] rounded-lg text-white placeholder-[#B8B9D3] focus:outline-none focus:ring-2 focus:ring-[#09C7A4] focus:border-transparent transition-all duration-300 font-body"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-[#D7D4EC] mb-2 font-body">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-[#1E1B3A] border border-[#3A3458] rounded-lg text-white placeholder-[#B8B9D3] focus:outline-none focus:ring-2 focus:ring-[#09C7A4] focus:border-transparent transition-all duration-300 font-body"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-[#D7D4EC] mb-2 font-body">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-[#1E1B3A] border border-[#3A3458] rounded-lg text-white placeholder-[#B8B9D3] focus:outline-none focus:ring-2 focus:ring-[#09C7A4] focus:border-transparent transition-all duration-300 resize-none font-body"
                    placeholder="Your message here..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#09C7A4] to-[#4F3DFF] text-white font-semibold py-3 px-6 rounded-lg hover:from-[#0B9D85] hover:to-[#3D2ECC] transition-all duration-300 shadow-lg hover:shadow-[#09C7A4]/50 flex items-center justify-center gap-2 font-body"
                >
                  <Send className="h-5 w-5" />
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Additional Info Section */}
        <div className="mt-12 text-center" style={{ animation: 'fadeIn 0.6s ease-out forwards' }}>
          <div className="bg-gradient-to-r from-[#2A2548] to-[#3A3458] rounded-lg p-6 md:p-8 border border-[#09C7A4]/30 shadow-lg">
            <p className="text-[#D7D4EC] text-base md:text-lg font-body leading-relaxed">
              We typically respond within 24-48 hours. For urgent matters, please mention it in your message.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
