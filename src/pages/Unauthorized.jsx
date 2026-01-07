import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';
import Button from '@/components/ui/Button';

const Unauthorized = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6">
          <Shield className="h-12 w-12 text-red-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Access Denied</h1>
        <p className="text-xl text-gray-600 mb-8">
          You don't have permission to access this page.
        </p>
        <div className="space-x-4">
          <Link to="/dashboard">
            <Button variant="primary">Go to Dashboard</Button>
          </Link>
          <Link to="/">
            <Button variant="outline">Go Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
