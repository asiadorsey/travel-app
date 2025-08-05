"use client";

import SideNavigation from '../../components/SideNavigation';

export default function CreatePage() {
  return (
    <div className="flex min-h-screen bg-[#FCF8F7]">
      {/* Side Navigation - Fixed and out of flow */}
      <SideNavigation currentPage="create" />

      {/* Main content area - Pushed to the right of sidebar */}
      <div className="flex-1 md:ml-64 overflow-auto min-w-0">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Create/Add</h1>
          <p className="text-gray-600">Create and add new experiences coming soon...</p>
        </div>
      </div>
    </div>
  );
} 