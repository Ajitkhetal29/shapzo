"use client";
import React from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

const supportDashboardPage = () => {
  const users = useSelector((state: RootState) => state.user.users);
  const supportTeamMembers = users.filter(user => user.department === "support");

  const stats = [
    { name: "Open Tickets", value: "0", icon: "🎫", color: "bg-red-500" },
    { name: "In Progress", value: "0", icon: "🔄", color: "bg-yellow-500" },
    { name: "Resolved Today", value: "0", icon: "✅", color: "bg-green-500" },
    { name: "Team Members", value: supportTeamMembers.length.toString(), icon: "👥", color: "bg-blue-500" },
  ];

  const quickActions = [
    { name: "View Tickets", href: "/tickets", icon: "🎫" },
    { name: "Team Management", href: "/Team", icon: "👥" },
    { name: "Ticket History", href: "/History", icon: "📊" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900">Support Dashboard</h1>
          <p className="mt-2 text-sm text-gray-600">Manage customer support tickets and team</p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {stats.map((stat) => (
            <div
              key={stat.name}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <span className="text-2xl">{stat.icon}</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {quickActions.map((action) => (
              <Link
                key={action.name}
                href={action.href}
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-black transition-colors"
              >
                <span className="text-2xl mr-3">{action.icon}</span>
                <span className="text-sm font-medium text-gray-900">{action.name}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Tickets</h2>
          <div className="text-center py-12">
            <p className="text-gray-500">No recent tickets to display</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default supportDashboardPage;