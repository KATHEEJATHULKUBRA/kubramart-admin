import { useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Order } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";
import { ShoppingCart, Package, Store } from "lucide-react";

interface NotificationsDropdownProps {
  onClickOutside: () => void;
}

const NotificationsDropdown = ({ onClickOutside }: NotificationsDropdownProps) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch recent orders as notifications
  const { data: orders } = useQuery<Order[]>({
    queryKey: ["/api/orders"],
    select: (data) => data.slice(0, 5).sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB.getTime() - dateA.getTime();
    }),
  });

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

  const getIcon = (status: string) => {
    switch (status) {
      case 'pending':
      case 'processing':
        return <ShoppingCart className="h-4 w-4 text-blue-500" />;
      case 'shipped':
        return <Package className="h-4 w-4 text-green-500" />;
      case 'delivered':
        return <Package className="h-4 w-4 text-green-500" />;
      default:
        return <Store className="h-4 w-4 text-amber-500" />;
    }
  };

  const getStatusText = (status: string, orderNumber: string) => {
    switch (status) {
      case 'pending':
        return `New order: ${orderNumber}`;
      case 'processing':
        return `Order ${orderNumber} is being processed`;
      case 'shipped':
        return `Order ${orderNumber} shipped`;
      case 'delivered':
        return `Order ${orderNumber} delivered`;
      default:
        return `Order ${orderNumber} ${status}`;
    }
  };

  return (
    <div 
      ref={dropdownRef}
      className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-20 animate-in fade-in"
    >
      <div className="p-3 border-b border-gray-200 dark:border-gray-700">
        <h3 className="font-medium text-gray-700 dark:text-gray-300">Notifications</h3>
      </div>
      
      <div className="max-h-72 overflow-y-auto">
        {orders && orders.length > 0 ? (
          orders.map((order) => (
            <div 
              key={order.id} 
              className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-3">
                  {getIcon(order.status)}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {getStatusText(order.status, order.orderNumber)}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {formatDistanceToNow(new Date(order.date), { addSuffix: true })}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            No notifications
          </div>
        )}
      </div>
      
      <div className="p-2 text-center border-t border-gray-200 dark:border-gray-700">
        <a href="/orders" className="text-sm text-primary hover:text-primary-dark">View all notifications</a>
      </div>
    </div>
  );
};

export default NotificationsDropdown;
