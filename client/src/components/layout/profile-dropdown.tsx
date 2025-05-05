import { useRef, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import { User, Settings, LogOut } from "lucide-react";

interface ProfileDropdownProps {
  onClickOutside: () => void;
}

const ProfileDropdown = ({ onClickOutside }: ProfileDropdownProps) => {
  const { user, logoutMutation } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClickOutside();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClickOutside]);

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div 
      ref={dropdownRef}
      className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-20 animate-in fade-in"
    >
      <div className="p-3 border-b border-gray-200 dark:border-gray-700">
        <h3 className="font-medium text-gray-700 dark:text-gray-300">
          {user?.firstName || user?.username || 'Admin User'}
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {user?.email || user?.username}
        </p>
      </div>
      
      <div className="p-2">
        <Link href="/profile" onClick={onClickOutside} className="block px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
          <div className="flex items-center">
            <User className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
            <span>My Profile</span>
          </div>
        </Link>
        
        <Link href="/settings" onClick={onClickOutside} className="block px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
          <div className="flex items-center">
            <Settings className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
            <span>Settings</span>
          </div>
        </Link>
        
        <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
        
        <button
          onClick={handleLogout}
          className="w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
        >
          <div className="flex items-center">
            <LogOut className="mr-2 h-4 w-4 text-red-500" />
            <span>Logout</span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default ProfileDropdown;
