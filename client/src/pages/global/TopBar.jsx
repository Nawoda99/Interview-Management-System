import { Menu, Settings, User } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfileManager from "../ProfileManager";
import ChangePassword from "../changePassword";

const TopBar = ({ onLogout, onToggleSidebar }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userjson = JSON.parse(localStorage.getItem("user")) || {};
  const user = userjson.user || null;

  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  const onMenuClick = () => {
    if (onToggleSidebar) {
      onToggleSidebar();
    }
  };

  const openProfile = () => {
    setShowProfile(true);
  };
  const openChangePassword = () => {
    setShowChangePassword(true);
  };

  return (
    <header
      className="sticky top-1 z-50 flex items-center justify-between px-4 py-3 mx-4 text-white bg-teal-600 shadow-md rounded-2xl dark:bg-amber-800"
      style={{ zIndex: 1000 }}
    >
      <div className="flex items-center gap-4">
        {user !== null && (
          <button
            onClick={onMenuClick}
            className="p-2 hover:bg-amber-700 rounded-lg transition-colors duration-200 flex items-center justify-center"
          >
            <Menu size={20} className="text-white" />
          </button>
        )}
        <h1 className="text-lg font-medium text-white">
          Interview Management System
        </h1>
      </div>

      {user !== null && (
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-amber-700 rounded-lg transition-colors duration-200 flex items-center justify-center">
            <Settings size={20} className="text-white" />
          </button>

          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="p-2 hover:bg-amber-700 rounded-lg transition-colors duration-200 flex items-center justify-center"
            >
              <User size={20} className="text-white" />
            </button>

            {showUserMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowUserMenu(false)}
                ></div>

                <div className="absolute right-0 mt-3 w-56 bg-white rounded-lg shadow-xl border border-amber-100 py-2 z-20">
                  {user && (
                    <div className="px-4 py-3 border-b border-amber-100">
                      <p className="text-sm font-medium text-amber-900">
                        {user.username}
                      </p>
                      <p className="text-xs text-amber-600">{user.email}</p>
                    </div>
                  )}

                  <div className="py-1 px-2">
                    <button
                      className="w-full text-left px-4 py-2 text-sm text-amber-700 hover:bg-amber-50 transition-colors"
                      onClick={openProfile}
                    >
                      Profile Settings
                    </button>
                    <button
                      className="w-full text-left px-4 py-2 text-sm text-amber-700 hover:bg-amber-50 transition-colors"
                      onClick={openChangePassword}
                    >
                      Change Password
                    </button>
                  </div>

                  <div className="border-t border-amber-100 pt-1">
                    <button
                      onClick={() => {
                        localStorage.removeItem("user");
                        setShowUserMenu(false);
                        onLogout && onLogout();
                        navigate("/");
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
          {showProfile && (
            <ProfileManager user={user} onClose={() => setShowProfile(false)} />
          )}
          {showChangePassword && (
            <ChangePassword
              user={user}
              onClose={() => setShowChangePassword(false)}
            />
          )}
        </div>
      )}
    </header>
  );
};

export default TopBar;
