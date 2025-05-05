import { Card } from "@/components/ui/card";
import { ShopCategory } from "@shared/schema";
import { useState } from "react";
import { Edit, Trash2, Eye } from "lucide-react";
import { Link } from "wouter";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface CategoryCardProps {
  category: ShopCategory;
  shopCount: number;
}

const CategoryCard = ({ category, shopCount }: CategoryCardProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { toast } = useToast();

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", `/api/shop-categories/${category.id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/shop-categories"] });
      toast({
        title: "Category deleted",
        description: `${category.name} has been deleted successfully.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to delete category",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate();
    setShowDeleteDialog(false);
  };

  return (
    <>
      <Card className="overflow-hidden">
        <div className="h-40 bg-gray-200 relative overflow-hidden">
          {category.image ? (
            <img 
              src={category.image} 
              alt={category.name} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-gray-200">
              <span className="text-gray-400">No image</span>
            </div>
          )}
          <div className="absolute top-2 right-2 flex space-x-1">
            <button 
              className="p-1 bg-white rounded-full shadow-sm hover:bg-gray-100"
              aria-label="Edit category"
            >
              <Edit className="h-4 w-4 text-gray-600" />
            </button>
            <button 
              className="p-1 bg-white rounded-full shadow-sm hover:bg-gray-100"
              aria-label="Delete category"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </button>
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-medium text-gray-800 text-lg">{category.name}</h3>
          <p className="text-gray-500 text-sm mt-1 line-clamp-2">
            {category.description || "No description available"}
          </p>
          <div className="mt-3 flex justify-between items-center">
            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {shopCount} shops
            </span>
            <Link 
              href={`/shops?categoryId=${category.id}`}
              className="text-primary text-sm hover:text-primary/80 flex items-center"
            >
              <span>View Shops</span>
              <Eye className="ml-1 h-3 w-3" />
            </Link>
          </div>
        </div>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the category "{category.name}" and cannot be undone.
              {shopCount > 0 && (
                <span className="block mt-2 text-amber-500 font-medium">
                  Warning: This category has {shopCount} shop{shopCount !== 1 ? 's' : ''} associated with it.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default CategoryCard;
