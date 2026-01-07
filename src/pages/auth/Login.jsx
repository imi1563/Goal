import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/store/slices/authSlice";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";
import { useLoginMutation } from "@/services/admin/adminApi";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [login, { isLoading: loginLoading }] = useLoginMutation();
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const { login, isAuthenticated } = useAuth();

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Redirect if already logged in
  // useEffect(() => {
  //   if (isAuthenticated) {
  //     navigate('/dashboard', { replace: true });
  //   }
  // }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);


    try {
      const result = await login(formData).unwrap();

      if (result?.data?.token) {
        // Store token in localStorage
        localStorage.setItem('token', result.data.token);

        // Store user data in localStorage without the token
        const { token, ...userData } = result.data;
        localStorage.setItem('user', JSON.stringify(userData));

        // Update Redux store
        dispatch(setCredentials(userData));

        // Show success message
        toast.success('Login successful!');

        // Redirect to dashboard
        navigate("/dashboard", { replace: true });
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed. Please try again.';
      toast.error(errorMessage);
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1E1B3A]">
      <div className="w-full max-w-md bg-[#282353] rounded-2xl border border-[#4F3DED] p-8 sm:p-10 flex flex-col items-center shadow-lg">
        <h2 className="text-[#EAEAEACC] text-center text-xl mb-2 font-body">
          Welcome Back!
        </h2>
        <h1 className="text-white text-center text-2xl md:text-[32px] font-medium mb-6 font-heading">
          Log in to your Account
        </h1>
        <form className="w-full flex flex-col gap-5" onSubmit={handleSubmit}>
          <div className="">
            <div className="relative">
              <input
                id="email"
                type="email"
                placeholder=" "
                autoComplete="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`peer w-full px-4 pt-5 pb-2 rounded-lg bg-[#323159] text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-[#6b5dfc] font-body ${errors.email ? 'border border-red-500' : ''}`}
              />
              <label
                htmlFor="email"
                className="absolute left-4  text-md transition-all pointer-events-none
                top-2 -translate-y-0 text-xs text-white
                peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:-translate-y-0 peer-[:not(:placeholder-shown)]:text-xs"
              >
                Email
              </label>
            </div>

          </div>
          {errors.email && <div className="text-red-400 text-xs -mt-4 mb-2">{errors.email}</div>}
          <div className="relative">
            <input
              id="password"
              type="password"
              placeholder=" "
              autoComplete="current-password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`peer w-full px-4 pt-5 pb-2 rounded-lg bg-[#323159] text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-[#6b5dfc] font-body ${errors.password ? 'border border-red-500' : ''}`}
            />
            <label
              htmlFor="password"
              className="absolute left-4  text-md transition-all pointer-events-none
                top-2 -translate-y-0 text-xs text-white
                peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:-translate-y-0 peer-[:not(:placeholder-shown)]:text-xs"
            >
              Password
            </label>
            {errors.password && <div className="text-red-400 text-xs mt-1">{errors.password}</div>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3 rounded-lg text-white font-medium text-[22px] shadow transition disabled:opacity-50"
            style={{
              background: "linear-gradient(0deg, #4F3DED 0%, #7768FC 100%)",
            }}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
