import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Sample data for product trends chart
const productData = [
  {
    category: "Fruits & Vegetables",
    sales: 12500,
    orders: 425,
    growth: 15,
  },
  {
    category: "Dairy & Eggs",
    sales: 9800,
    orders: 350,
    growth: 8,
  },
  {
    category: "Meat & Seafood",
    sales: 8200,
    orders: 290,
    growth: 5,
  },
  {
    category: "Bakery",
    sales: 7500,
    orders: 310,
    growth: 12,
  },
  {
    category: "Beverages",
    sales: 6800,
    orders: 260,
    growth: -3,
  },
  {
    category: "Snacks",
    sales: 5900,
    orders: 280,
    growth: 7,
  },
];

// Top selling products data
const topProducts = [
  {
    name: "Organic Bananas",
    shop: "Farm Fresh Groceries",
    sales: 2340,
    orders: 780,
  },
  {
    name: "Fresh Eggs (Dozen)",
    shop: "Organic Delights",
    sales: 1980,
    orders: 660,
  },
  {
    name: "Whole Wheat Bread",
    shop: "Artisan Bakery",
    sales: 1750,
    orders: 580,
  },
  {
    name: "Organic Avocados",
    shop: "Fresh Produce Market",
    sales: 1640,
    orders: 410,
  },
  {
    name: "Greek Yogurt",
    shop: "Dairy Farm Direct",
    sales: 1520,
    orders: 380,
  },
];

// Sort product data by the selected metric
const sortProductData = (data: typeof productData, metric: "sales" | "orders" | "growth") => {
  return [...data].sort((a, b) => b[metric] - a[metric]);
};

const ProductTrendsChart = () => {
  const [timeRange, setTimeRange] = useState("month");
  const [metric, setMetric] = useState<"sales" | "orders" | "growth">("sales");
  const [tab, setTab] = useState("categories");
  
  const sortedProductData = sortProductData(productData, metric);
  
  // Format currency for tooltip and axis
  const formatCurrency = (value: number) => {
    return `$${value.toLocaleString("en-US")}`;
  };
  
  // Determine color based on growth (positive or negative)
  const getGrowthColor = (growth: number) => {
    return growth >= 0 ? "text-green-500" : "text-red-500";
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Product Trends</CardTitle>
        <Select
          value={timeRange}
          onValueChange={setTimeRange}
        >
          <SelectTrigger className="w-[180px] h-8 text-xs border border-gray-200">
            <SelectValue placeholder="Select Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="quarter">Last 3 Months</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-0">
        <Tabs value={tab} onValueChange={setTab} className="px-6">
          <div className="flex justify-between mb-4">
            <TabsList>
              <TabsTrigger value="categories">Product Categories</TabsTrigger>
              <TabsTrigger value="products">Top Products</TabsTrigger>
            </TabsList>
            
            <Select
              value={metric}
              onValueChange={(value) => setMetric(value as "sales" | "orders" | "growth")}
            >
              <SelectTrigger className="w-[120px] h-8 text-xs border border-gray-200">
                <SelectValue placeholder="Metric" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sales">Sales</SelectItem>
                <SelectItem value="orders">Orders</SelectItem>
                <SelectItem value="growth">Growth</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <TabsContent value="categories">
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={sortedProductData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                  barSize={40}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis 
                    dataKey="category" 
                    tick={{ fill: 'gray', fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    tickFormatter={value => metric === "growth" ? `${value}%` : formatCurrency(value)}
                    tick={{ fill: 'gray', fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip 
                    formatter={(value: number) => {
                      return metric === "growth" 
                        ? `${value}%` 
                        : formatCurrency(value);
                    }}
                    contentStyle={{
                      backgroundColor: 'white',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                      border: 'none'
                    }}
                  />
                  <Legend />
                  <Bar 
                    dataKey={metric} 
                    fill={metric === "growth" ? "#10B981" : "hsl(var(--primary))"}
                    radius={[4, 4, 0, 0]}
                    name={metric === "sales" ? "Sales ($)" : metric === "orders" ? "Orders" : "Growth (%)"}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="products">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shop</th>
                    <th className="py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Sales</th>
                    <th className="py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                  </tr>
                </thead>
                <tbody>
                  {topProducts.map((product, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 text-sm font-medium text-gray-900">{product.name}</td>
                      <td className="py-4 text-sm text-gray-500">{product.shop}</td>
                      <td className="py-4 text-sm text-right font-medium">${product.sales.toLocaleString()}</td>
                      <td className="py-4 text-sm text-right">{product.orders}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
        
        {tab === "categories" && (
          <div className="px-6 pt-4 mt-2 border-t border-gray-100">
            <h4 className="text-sm font-medium mb-3">Category Performance</h4>
            <div className="space-y-2">
              {sortedProductData.slice(0, 3).map((item, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-1 h-6 bg-primary mr-3 rounded-full" />
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{item.category}</span>
                      <span className={`text-sm font-medium ${getGrowthColor(item.growth)}`}>
                        {item.growth > 0 ? "+" : ""}{item.growth}%
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      ${item.sales.toLocaleString()} in sales from {item.orders} orders
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductTrendsChart;
