import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { ShopCategory, Shop } from "@shared/schema";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import PageTitle from "@/components/layout/page-title";
import ShopCard from "@/components/shop/shop-card";
import ShopForm from "@/components/shop/shop-form";
import { Plus, Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useLocation } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const ShopListPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [location] = useLocation();
  const { toast } = useToast();

  // Get categoryId from URL if present
  const urlParams = new URLSearchParams(location.split("?")[1] || "");
  const categoryIdFromUrl = urlParams.get("categoryId");

  // Set selected category from URL if present
  useState(() => {
    if (categoryIdFromUrl) {
      setSelectedCategory(categoryIdFromUrl);
    }
  });

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Fetch shops
  const { data: shops, isLoading: isShopsLoading } = useQuery<Shop[]>({
    queryKey: ["/api/shops"],
  });

  // Fetch shop categories
  const { data: categories, isLoading: isCategoriesLoading } = useQuery<ShopCategory[]>({
    queryKey: ["/api/shop-categories"],
  });

  // Delete shop mutation
  const deleteShopMutation = useMutation({
    mutationFn: async (shopId: number) => {
      await apiRequest("DELETE", `/api/shops/${shopId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/shops"] });
      toast({
        title: "Shop deleted",
        description: "The shop has been deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to delete shop",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Filter shops based on search query and selected category
  const filteredShops = shops?.filter(shop => {
    const matchesSearch = searchQuery === "" || 
      shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (shop.description && shop.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === "all" || 
      shop.categoryId === parseInt(selectedCategory);
    
    return matchesSearch && matchesCategory;
  });

  // Get category name by ID
  const getCategoryName = (categoryId?: number) => {
    if (!categoryId || !categories) return "Uncategorized";
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : "Uncategorized";
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      <Sidebar className={sidebarOpen ? "w-64" : "w-16"} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header toggleSidebar={toggleSidebar} />
        
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-4">
          <div className="page-transition max-w-7xl mx-auto">
            <PageTitle 
              title="Shop List" 
              subtitle="Manage all shops in the marketplace"
              action={{
                label: "Add Shop",
                icon: <Plus size={18} />,
                onClick: () => setShowAddDialog(true)
              }}
            />
            
            {/* Filters */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  placeholder="Search shops..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories?.map(category => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Shops Grid */}
            {isShopsLoading || isCategoriesLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
              </div>
            ) : filteredShops && filteredShops.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredShops.map(shop => (
                  <ShopCard 
                    key={shop.id} 
                    shop={shop}
                    categoryName={getCategoryName(shop.categoryId)}
                    onEdit={() => {
                      // Set shop to edit and open dialog
                    }}
                    onDelete={() => deleteShopMutation.mutate(shop.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                <div className="h-20 w-20 mx-auto mb-4 flex items-center justify-center rounded-full bg-gray-100">
                  <Store className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No shops found</h3>
                <p className="text-gray-500 mb-6">
                  {searchQuery || selectedCategory !== "all" 
                    ? "Try adjusting your search or filter criteria" 
                    : "Get started by adding your first shop"}
                </p>
                <button
                  onClick={() => setShowAddDialog(true)}
                  className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Shop
                </button>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Add Shop Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Add New Shop</DialogTitle>
          </DialogHeader>
          <ShopForm onSuccess={() => setShowAddDialog(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ShopListPage;

// For proper functioning the Store icon should be imported
import { Store } from "lucide-react";
