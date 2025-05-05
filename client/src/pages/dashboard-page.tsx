import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import StatCard from "@/components/dashboard/stat-card";
import SalesChart from "@/components/dashboard/sales-chart";
import ShopChart from "@/components/dashboard/shop-chart";
import RecentOrders from "@/components/dashboard/recent-orders";
import { useQuery } from "@tanstack/react-query";
import { DollarSign, ShoppingCart, Store, Users } from "lucide-react";

const DashboardPage = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Queries for dashboard data
  const { data: orderStats } = useQuery({
    queryKey: ["/api/orders"],
    select: (data) => {
      const totalOrders = data.length;
      const totalAmount = data.reduce((sum, order) => sum + parseFloat(order.amount), 0);
      
      // Filter orders from current month
      const now = new Date();
      const currentMonthOrders = data.filter(order => {
        const orderDate = new Date(order.date);
        return orderDate.getMonth() === now.getMonth() && 
               orderDate.getFullYear() === now.getFullYear();
      });
      
      const lastMonthOrders = data.filter(order => {
        const orderDate = new Date(order.date);
        const lastMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
        const lastMonthYear = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
        return orderDate.getMonth() === lastMonth && 
               orderDate.getFullYear() === lastMonthYear;
      });
      
      // Calculate percentage change
      const currentMonthAmount = currentMonthOrders.reduce((sum, order) => sum + parseFloat(order.amount), 0);
      const lastMonthAmount = lastMonthOrders.reduce((sum, order) => sum + parseFloat(order.amount), 0);
      
      let percentageChange = 0;
      if (lastMonthAmount > 0) {
        percentageChange = ((currentMonthAmount - lastMonthAmount) / lastMonthAmount) * 100;
      }
      
      return {
        totalOrders,
        totalAmount: totalAmount.toFixed(2),
        percentageChange: percentageChange.toFixed(1)
      };
    }
  });

  const { data: shopStats } = useQuery({
    queryKey: ["/api/shops"],
    select: (data) => {
      return {
        totalShops: data.length
      };
    }
  });

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      <Sidebar className={sidebarOpen ? "w-64" : "w-16"} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header toggleSidebar={toggleSidebar} />
        
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-4">
          <div className="page-transition max-w-7xl mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Dashboard</h1>
              <p className="text-gray-500">Welcome back, {user?.firstName || user?.username || 'Admin'}</p>
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <StatCard
                title="Total Sales"
                value={`$${orderStats?.totalAmount || '0.00'}`}
                icon={<DollarSign className="h-5 w-5 text-primary" />}
                iconBgColor="bg-primary/10"
                change={{
                  value: `${orderStats?.percentageChange || '0'}% vs last month`,
                  type: parseFloat(orderStats?.percentageChange || '0') >= 0 ? "increase" : "decrease"
                }}
              />
              
              <StatCard
                title="Total Orders"
                value={orderStats?.totalOrders || 0}
                icon={<ShoppingCart className="h-5 w-5 text-secondary" />}
                iconBgColor="bg-secondary/10"
                change={{
                  value: "5.3% vs last month",
                  type: "increase"
                }}
              />
              
              <StatCard
                title="Active Shops"
                value={shopStats?.totalShops || 0}
                icon={<Store className="h-5 w-5 text-blue-500" />}
                iconBgColor="bg-blue-500/10"
                change={{
                  value: "2 new this month",
                  type: "increase"
                }}
              />
              
              <StatCard
                title="Customer Satisfaction"
                value="92%"
                icon={<Users className="h-5 w-5 text-green-500" />}
                iconBgColor="bg-green-500/10"
                change={{
                  value: "3.1% vs last month",
                  type: "increase"
                }}
              />
            </div>
            
            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <SalesChart />
              <ShopChart />
            </div>
            
            {/* Recent Orders Table */}
            <RecentOrders />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
