import { useAuth } from "@/hooks/use-auth";
import { Menu, Bell } from "lucide-react";
import NotificationsDropdown from "./notifications-dropdown";
import ProfileDropdown from "./profile-dropdown";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header = ({ toggleSidebar }: HeaderProps) => {
  const { user } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Handle notification click
  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
    setShowProfileMenu(false);
  };

  // Handle profile click
  const handleProfileClick = () => {
    setShowProfileMenu(!showProfileMenu);
    setShowNotifications(false);
  };

  // Close dropdowns when clicking outside
  const handleClickOutside = () => {
    setShowNotifications(false);
    setShowProfileMenu(false);
  };

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm z-10">
      <div className="px-4 py-3 flex items-center justify-between">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar}
          className="text-gray-500 focus:outline-none"
        >
          <Menu size={20} />
        </Button>
        
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNotificationClick}
              className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
            >
              <Bell size={18} className="text-gray-600 dark:text-gray-300" />
              <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">3</span>
            </Button>
            
            {showNotifications && (
              <NotificationsDropdown onClickOutside={handleClickOutside} />
            )}
          </div>
          
          {/* Admin Profile */}
          <div className="relative">
            <button
              onClick={handleProfileClick}
              className="flex items-center space-x-2 focus:outline-none"
            >
              <div className="h-8 w-8 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center text-gray-700">
                {user?.avatar ? (
                  <img src={user.avatar} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  <span className="font-medium text-sm">
                    {user?.firstName?.charAt(0) || user?.username?.charAt(0) || 'A'}
                  </span>
                )}
              </div>
              <span className="hidden md:block text-sm text-gray-600 dark:text-gray-300">
                {user?.firstName || user?.username || 'Admin User'}
              </span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {showProfileMenu && (
              <ProfileDropdown onClickOutside={handleClickOutside} />
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
