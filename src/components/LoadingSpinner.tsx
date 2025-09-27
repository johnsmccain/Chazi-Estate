import React from 'react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-gray-900 to-indigo-900">
      <div className="text-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-indigo-600 rounded-full animate-pulse"></div>
          </div>
        </div>
        <h2 className="mt-6 text-xl font-semibold text-white">chazi-chain</h2>
        <p className="mt-2 text-gray-400">Loading your real estate platform...</p>
      </div>
    </div>
  );
};