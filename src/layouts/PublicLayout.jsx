import Navbar from '@/components/layout/Navbar';
import Footer from '../components/layout/Footer';

const PublicLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#1E1B3A] text-white">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default PublicLayout;
