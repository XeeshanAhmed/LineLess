import React, { useState } from 'react';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    agree: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Signup Data:', formData);
  };

  return (
    <div className="min-h-screen bg-[#151515] text-white flex items-center justify-center p-6">
      <div className="flex w-full max-w-5xl bg-[#1f1f1f] rounded-2xl overflow-hidden shadow-lg">
        {/* Left: Image/Brand */}
        <div className="hidden md:flex flex-col justify-between p-10 w-1/2 bg-[#2a2a2a] text-white">
          <div>
            <h2 className="text-2xl font-bold mb-4">AMU</h2>
            <button className="text-sm border border-white px-4 py-1 rounded-full hover:bg-white hover:text-black transition">
              ← Back to website
            </button>
          </div>
          <div className="mt-auto">
            <img
              src="https://images.unsplash.com/photo-1506744038136-46273834b3fb"
              alt="Desert"
              className="rounded-lg object-cover"
            />
            <p className="mt-4 text-gray-300">Capturing Moments, Creating Memories</p>
          </div>
        </div>

        {/* Right: Signup Form */}
        <div className="w-full md:w-1/2 bg-[#1f1f1f] p-10 space-y-6">
          <h2 className="text-3xl font-semibold">Create an account</h2>
          <p className="text-sm text-gray-400">
            Already have an account?{' '}
            <a href="/login" className="text-[#a78bfa] hover:underline">
              Log in
            </a>
          </p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="flex gap-3">
              <input
                type="text"
                name="firstName"
                placeholder="First name"
                onChange={handleChange}
                className="w-1/2 px-4 py-2 bg-[#2a2a2a] text-white border border-gray-700 rounded-md focus:ring-2 focus:ring-[#a78bfa] outline-none"
                required
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last name"
                onChange={handleChange}
                className="w-1/2 px-4 py-2 bg-[#2a2a2a] text-white border border-gray-700 rounded-md focus:ring-2 focus:ring-[#a78bfa] outline-none"
              />
            </div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              className="w-full px-4 py-2 bg-[#2a2a2a] text-white border border-gray-700 rounded-md focus:ring-2 focus:ring-[#a78bfa] outline-none"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              onChange={handleChange}
              className="w-full px-4 py-2 bg-[#2a2a2a] text-white border border-gray-700 rounded-md focus:ring-2 focus:ring-[#a78bfa] outline-none"
              required
            />
            <div className="flex items-center">
              <input
                type="checkbox"
                name="agree"
                onChange={handleChange}
                className="mr-2"
              />
              <label className="text-sm text-gray-400">
                I agree to the{' '}
                <a href="#" className="text-[#a78bfa] hover:underline">
                  Terms & Conditions
                </a>
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-[#a78bfa] hover:bg-[#8b5cf6] text-white font-semibold py-2 rounded-md transition"
            >
              Create account
            </button>
          </form>

          <div className="text-center text-sm text-gray-500 mt-4">
            Or register with
          </div>

          <div className="flex gap-4">
            <button className="flex-1 bg-white text-black py-2 rounded-md flex items-center justify-center gap-2 shadow">
              <img src="https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/google.svg" alt="Google" className="h-4 w-4" />
              Google
            </button>
            <button className="flex-1 bg-white text-black py-2 rounded-md flex items-center justify-center gap-2 shadow">
              <img src="https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/apple.svg" alt="Apple" className="h-4 w-4" />
              Apple
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
