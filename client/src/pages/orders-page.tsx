import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Order, Shop } from "@shared/schema";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import PageTitle from "@/components/layout/page-title";
import OrderTable from "@/components/orders/order-table";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const OrdersPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [shopFilter, setShopFilter] = useState("all");

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Fetch orders
  const { data: orders, isLoading: isOrdersLoading } = useQuery<Order[]>({
    queryKey: ["/api/orders"],
  });

  // Fetch shops for filters
  const { data: shops, isLoading: isShopsLoading } = useQuery<Shop[]>({
    queryKey: ["/api/shops"],
  });

  // Filter orders based on search query, status, and shop
  const filteredOrders = orders?.filter(order => {
    const matchesSearch = searchQuery === "" || 
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.customerEmail && order.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    const matchesShop = shopFilter === "all" || order.shopId.toString() === shopFilter;
    
    return matchesSearch && matchesStatus && matchesShop;
  });

  // Get shop name by ID
  const getShopName = (shopId?: number) => {
    if (!shopId || !shops) return "Unknown Shop";
    const shop = shops.find(s => s.id === shopId);
    return shop ? shop.name : "Unknown Shop";
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      <Sidebar className={sidebarOpen ? "w-64" : "w-16"} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header toggleSidebar={toggleSidebar} />
        
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-4">
          <div className="page-transition max-w-7xl mx-auto">
            <PageTitle 
              title="Orders" 
              subtitle="Manage customer orders"
            />
            
            {/* Filters */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  placeholder="Search orders by ID, customer..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Select
                value={statusFilter}
                onValueChange={setStatusFilter}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full sm:w-auto">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter by Shop
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>Select Shop</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup className="max-h-[200px] overflow-y-auto">
                    <DropdownMenuItem 
                      onClick={() => setShopFilter('all')}
                      className={shopFilter === 'all' ? "bg-gray-100" : ""}
                    >
                      All Shops
                    </DropdownMenuItem>
                    {shops?.map(shop => (
                      <DropdownMenuItem 
                        key={shop.id} 
                        onClick={() => setShopFilter(shop.id.toString())}
                        className={shopFilter === shop.id.toString() ? "bg-gray-100" : ""}
                      >
                        {shop.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            {/* Orders Table */}
            {isOrdersLoading || isShopsLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
              </div>
            ) : filteredOrders && filteredOrders.length > 0 ? (
              <OrderTable 
                orders={filteredOrders} 
                getShopName={getShopName}
              />
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
                <p className="text-gray-500">
                  {searchQuery || statusFilter !== "all" || shopFilter !== "all" 
                    ? "Try adjusting your search or filter criteria" 
                    : "Orders will appear here once customers start placing them"}
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default OrdersPage;
