import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import PageTitle from "@/components/layout/page-title";
import SalesChart from "@/components/dashboard/sales-chart";
import ShopChart from "@/components/dashboard/shop-chart";
import ProductTrendsChart from "@/components/analytics/product-trends-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";

const AnalyticsPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [timeRange, setTimeRange] = useState("month");

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Fetch analytics data
  const { data: salesData, isLoading: isSalesLoading } = useQuery({
    queryKey: ["/api/analytics/sales"],
  });

  const { data: shopData, isLoading: isShopLoading } = useQuery({
    queryKey: ["/api/analytics/shops"],
  });

  // Calculate total sales for the selected period
  const totalSales = salesData
    ? salesData.reduce((total, item) => total + item.amount, 0)
    : 0;

  // Calculate total shops for the selected period
  const totalShops = shopData ? shopData.length : 0;

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      <Sidebar className={sidebarOpen ? "w-64" : "w-16"} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header toggleSidebar={toggleSidebar} />
        
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-4">
          <div className="page-transition max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <PageTitle 
                title="Sales Analytics" 
                subtitle="Track sales performance and trends"
              />
              
              <Select
                value={timeRange}
                onValueChange={setTimeRange}
                className="mt-4 md:mt-0"
              >
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Time Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="quarter">Last 3 Months</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Sales Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Total Sales</span>
                    <span className="text-2xl font-semibold mt-1">
                      ${totalSales.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <span className="text-xs text-green-500 mt-2">
                      ↑ 8.2% vs previous period
                    </span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Average Order Value</span>
                    <span className="text-2xl font-semibold mt-1">$125.48</span>
                    <span className="text-xs text-green-500 mt-2">
                      ↑ 3.7% vs previous period
                    </span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Total Shops</span>
                    <span className="text-2xl font-semibold mt-1">{totalShops}</span>
                    <span className="text-xs text-green-500 mt-2">
                      ↑ 2 new this period
                    </span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Conversion Rate</span>
                    <span className="text-2xl font-semibold mt-1">4.2%</span>
                    <span className="text-xs text-green-500 mt-2">
                      ↑ 0.5% vs previous period
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Charts */}
            <Tabs defaultValue="sales" className="mb-6">
              <TabsList className="mb-4">
                <TabsTrigger value="sales">Sales Overview</TabsTrigger>
                <TabsTrigger value="shops">Shop Performance</TabsTrigger>
                <TabsTrigger value="products">Product Trends</TabsTrigger>
              </TabsList>
              
              <TabsContent value="sales" className="space-y-4">
                <SalesChart />
              </TabsContent>
              
              <TabsContent value="shops" className="space-y-4">
                <ShopChart />
              </TabsContent>
              
              <TabsContent value="products" className="space-y-4">
                <ProductTrendsChart />
              </TabsContent>
            </Tabs>
            
            {/* Market Insights */}
            <Card>
              <CardHeader>
                <CardTitle>Market Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-1">Top Performing Category: Organic Foods</h4>
                    <p className="text-sm text-blue-600">
                      The Organic Foods category shows a 15% growth rate compared to the previous period, 
                      making it the fastest-growing category in your marketplace.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-amber-50 rounded-lg">
                    <h4 className="font-medium text-amber-800 mb-1">Customer Behavior</h4>
                    <p className="text-sm text-amber-600">
                      Peak ordering hours are between 5PM and 8PM, with weekends showing 35% higher 
                      order volume than weekdays.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-800 mb-1">Growth Opportunity</h4>
                    <p className="text-sm text-green-600">
                      Consider expanding the Fresh Produce category, as it shows high demand but currently 
                      has only a few shops providing these products.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AnalyticsPage;
