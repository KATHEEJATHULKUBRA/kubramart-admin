import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ShopCategory } from "@shared/schema";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import PageTitle from "@/components/layout/page-title";
import CategoryCard from "@/components/shop/category-card";
import CategoryForm from "@/components/shop/category-form";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

const ShopCategoryPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Fetch shop categories
  const { data: categories, isLoading } = useQuery<ShopCategory[]>({
    queryKey: ["/api/shop-categories"],
  });

  // Fetch shops to get shop count per category
  const { data: shops } = useQuery({
    queryKey: ["/api/shops"],
  });

  // Count shops per category
  const getCategoryShopCount = (categoryId: number) => {
    if (!shops) return 0;
    return shops.filter(shop => shop.categoryId === categoryId).length;
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      <Sidebar className={sidebarOpen ? "w-64" : "w-16"} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header toggleSidebar={toggleSidebar} />
        
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-4">
          <div className="page-transition max-w-7xl mx-auto">
            <PageTitle 
              title="Shop Categories" 
              subtitle="Manage shop categories and types"
              action={{
                label: "Add Category",
                icon: <Plus size={18} />,
                onClick: () => setShowAddDialog(true)
              }}
            />
            
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories?.map(category => (
                  <CategoryCard 
                    key={category.id} 
                    category={category} 
                    shopCount={getCategoryShopCount(category.id)}
                  />
                ))}
                
                {/* Add New Category Card */}
                <div 
                  className="border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center h-full min-h-[250px] cursor-pointer hover:border-primary transition-all bg-white"
                  onClick={() => setShowAddDialog(true)}
                >
                  <div className="text-center p-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                      <Plus className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-medium text-gray-800">Add New Category</h3>
                    <p className="text-gray-500 text-sm mt-1">Click to create a new shop category</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Add Category Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
          </DialogHeader>
          <CategoryForm onSuccess={() => setShowAddDialog(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ShopCategoryPage;
