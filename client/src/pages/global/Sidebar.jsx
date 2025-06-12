"use client";
import { useState, useEffect } from "react";
import {
  Home,
  Calendar,
  Users,
  UserCheck,
  Settings,
  BarChart3,
  Clock,
  Mail,
  ChevronDown,
  ChevronRight,
  Building2,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ isOpen, onClose }) => {
  const [expandedMenus, setExpandedMenus] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const toggleSubmenu = (menuKey) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menuKey]: !prev[menuKey],
    }));
  };

  const menuItems = [
    {
      key: "dashboard",
      label: "Dashboard",
      icon: Home,
      path: "/dashboard",
    },
    {
      Key: "users",
      label: "Users",
      icon: Users,
      path: "/users",
    },
    {
      key: "interviews",
      label: "Interviews",
      icon: Calendar,
      hasSubmenu: true,
      submenu: [
        { label: "Schedule Interview", path: "/interviews/schedule" },
        { label: "Active Sessions", path: "/interviews/active" },
        { label: "Completed", path: "/interviews/completed" },
        { label: "Cancelled", path: "/interviews/cancelled" },
      ],
    },
    {
      key: "candidates",
      label: "Candidates",
      icon: Users,
      hasSubmenu: true,
      submenu: [
        { label: "All Candidates", path: "/candidates/all" },
        { label: "Shortlisted", path: "/candidates/shortlisted" },
        { label: "Rejected", path: "/candidates/rejected" },
        { label: "Hired", path: "/candidates/hired" },
      ],
    },
    {
      key: "interviewers",
      label: "Interviewers",
      icon: UserCheck,
      path: "/interviewers",
    },
    {
      key: "reports",
      label: "Reports",
      icon: BarChart3,
      hasSubmenu: true,
      submenu: [
        { label: "Interview Analytics", path: "/reports/analytics" },
        { label: "Candidate Reports", path: "/reports/candidates" },
        { label: "Performance Metrics", path: "/reports/performance" },
      ],
    },
    {
      key: "schedule",
      label: "Schedule",
      icon: Clock,
      path: "/schedule",
    },
    {
      key: "communications",
      label: "Communications",
      icon: Mail,
      path: "/communications",
    },
  ];

  const bottomMenuItems = [
    {
      key: "settings",
      label: "Settings",
      icon: Settings,
      path: "/settings",
    },
  ];

  const MenuItem = ({ item, isSubmenuItem = false }) => {
    const Icon = item.icon;
    const isExpanded = expandedMenus[item.key];
    const hasSubmenu = item.hasSubmenu;

    return (
      <div className="w-full top-20">
        <button
          onClick={() => {
            if (hasSubmenu) {
              toggleSubmenu(item.key);
            } else {
              navigate(item.path);
              onClose();
            }
          }}
          className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors duration-200 ${
            isSubmenuItem
              ? "pl-12 text-sm text-amber-200 hover:text-white hover:bg-amber-700/50"
              : item.active
              ? "bg-amber-700 text-white"
              : "text-amber-100 hover:text-white hover:bg-amber-700/50"
          }`}
        >
          <div className="flex items-center gap-3">
            {!isSubmenuItem && Icon && <Icon size={20} />}
            <span className="font-medium">{item.label}</span>
          </div>
          {hasSubmenu && (
            <div className="transition-transform duration-200">
              {isExpanded ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
            </div>
          )}
        </button>

        {hasSubmenu && isExpanded && (
          <div className="bg-amber-900/30">
            {item.submenu.map((subItem, index) => (
              <MenuItem key={index} item={subItem} isSubmenuItem={true} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 z-40 ${
          isOpen ? "opacity-50" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className={`fixed left-0 top-20 h-full rounded-tr-xl bg-amber-800 text-white z-50 transition-transform duration-300 ease-in-out transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } w-80 shadow-2xl`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
      >
        <div className="flex items-center justify-between p-6 border-b border-amber-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center">
              <Building2 size={24} className="text-white" />
            </div>
            <div>
              <h2
                id="drawer-title"
                className="text-lg font-semibold text-white"
              >
                IMS
              </h2>
              <p className="text-xs text-amber-200">Interview Management</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 hover:bg-amber-700 rounded-lg transition-colors duration-200"
            aria-label="Close drawer"
          >
            <X size={20} className="text-white" />
          </button>
        </div>

        <div className="flex flex-col h-full">
          <nav className="flex-1 py-4 overflow-y-auto">
            <div className="space-y-1">
              {menuItems.map((item) => (
                <MenuItem key={item.key} item={item} />
              ))}
            </div>
          </nav>

          <div className="border-t border-amber-700 p-4">
            {bottomMenuItems.map((item) => (
              <MenuItem key={item.key} item={item} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
