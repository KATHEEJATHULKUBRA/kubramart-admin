import { useLocation, Link } from "wouter";
import Logo from "@/assets/logo";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import {
  LayoutDashboard,
  FileSliders,
  Store,
  ShoppingCart,
  Receipt,
  BarChart3,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface SidebarProps {
  className?: string;
}

const Sidebar = ({ className }: SidebarProps) => {
  const [location] = useLocation();
  const { logoutMutation } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const navigationItems = [
    { title: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/' },
    { title: 'Shop Category', icon: <FileSliders size={20} />, path: '/shop-categories' },
    { title: 'List Shop', icon: <Store size={20} />, path: '/shops' },
    { title: 'Orders', icon: <ShoppingCart size={20} />, path: '/orders' },
    { title: 'Transactions', icon: <Receipt size={20} />, path: '/transactions' },
    { title: 'Sales Analytics', icon: <BarChart3 size={20} />, path: '/analytics' },
  ];

  const handleToggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <aside
      className={cn(
        "sidebar bg-white dark:bg-sidebar border-r h-full overflow-y-auto",
        collapsed ? "w-16" : "w-64",
        className
      )}
    >
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-3 overflow-hidden">
          <Logo size="sm" />
          {!collapsed && (
            <h1 className="text-lg font-semibold truncate">Kubra Market</h1>
          )}
        </div>
        <button
          onClick={handleToggleCollapse}
          className="p-1 rounded-md hover:bg-gray-100 text-gray-500"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <nav className="p-3">
        <ul className="space-y-1">
          {navigationItems.map((item) => {
            const isActive = item.path === '/'
              ? location === item.path
              : location.startsWith(item.path);

            return (
              <li key={item.path}>
                {collapsed ? (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link
                          href={item.path}
                          className={cn(
                            "flex items-center justify-center p-2 rounded-lg transition-colors",
                            isActive
                              ? "bg-primary/10 text-primary border-l-4 border-primary"
                              : "text-gray-600 hover:bg-gray-100"
                          )}
                        >
                          <div className={isActive ? "text-primary" : "text-gray-500"}>
                            {item.icon}
                          </div>
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent side="right">{item.title}</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ) : (
                  <Link
                    href={item.path}
                    className={cn(
                      "flex items-center px-3 py-2 rounded-lg transition-colors",
                      isActive
                        ? "bg-primary/10 text-primary border-l-4 border-primary"
                        : "text-gray-600 hover:bg-gray-100"
                    )}
                  >
                    <div className={cn(
                      "mr-3",
                      isActive ? "text-primary" : "text-gray-500"
                    )}>
                      {item.icon}
                    </div>
                    <span>{item.title}</span>
                  </Link>
                )}
              </li>
            );
          })}
        </ul>

        <div className="pt-6 mt-6 border-t border-gray-200">
          {collapsed ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center w-full p-2 text-red-500 rounded-lg hover:bg-gray-100"
                  >
                    <LogOut size={20} />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">Logout</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-3 py-2 text-red-500 rounded-lg hover:bg-gray-100"
            >
              <LogOut size={20} className="mr-3" />
              <span>Logout</span>
            </button>
          )}
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
