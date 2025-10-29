"use client";

import Link from "next/link";
import { useState } from "react";

interface SidebarItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  active?: boolean;
}

interface SidebarProps {
  title?: string;
  items: SidebarItem[];
  onClose?: () => void;
}

export function Sidebar({ title, items, onClose }: SidebarProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  const toggleSection = (label: string) => {
    setExpandedSections((prev) =>
      prev.includes(label) ? prev.filter((s) => s !== label) : [...prev, label]
    );
  };

  return (
    <aside className="w-full md:w-64 bg-white border-r border-gray-200 h-full">
      {/* Close button for mobile */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-gray-200">
        {title && <h2 className="font-semibold text-gray-900">{title}</h2>}
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg"
          aria-label="Close sidebar"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Title for desktop */}
      {title && (
        <div className="hidden md:block p-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">{title}</h2>
        </div>
      )}

      {/* Navigation Items */}
      <nav className="p-4 space-y-1">
        {items.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition ${
              item.active
                ? "bg-green-100 text-green-700 font-medium"
                : "text-gray-700 hover:bg-gray-100"
            }`}
            onClick={onClose}
          >
            {item.icon && <span className="text-lg">{item.icon}</span>}
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}

interface SidebarLayoutProps {
  children: React.ReactNode;
  sidebarTitle?: string;
  sidebarItems: SidebarItem[];
}

export function SidebarLayout({
  children,
  sidebarTitle,
  sidebarItems,
}: SidebarLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-full">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 md:static md:w-64 z-50 transform transition-transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <Sidebar
          title={sidebarTitle}
          items={sidebarItems}
          onClose={() => setSidebarOpen(false)}
        />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile menu button */}
        <div className="md:hidden flex items-center gap-4 p-4 border-b border-gray-200 bg-white">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg"
            aria-label="Toggle sidebar"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <span className="text-gray-900 font-medium">{sidebarTitle}</span>
        </div>

        {/* Content */}
        {children}
      </div>
    </div>
  );
}
