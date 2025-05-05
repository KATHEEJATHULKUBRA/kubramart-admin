import { Card } from "@/components/ui/card";
import { Shop } from "@shared/schema";
import { useState } from "react";
import { Edit, Trash2, MapPin } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ShopForm from "@/components/shop/shop-form";
import { Badge } from "@/components/ui/badge";

interface ShopCardProps {
  shop: Shop;
  categoryName: string;
  onEdit: () => void;
  onDelete: () => void;
}

const ShopCard = ({ shop, categoryName, onEdit, onDelete }: ShopCardProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const handleDelete = () => {
    onDelete();
    setShowDeleteDialog(false);
  };

  const handleEditSuccess = () => {
    setShowEditDialog(false);
  };

  return (
    <>
      <Card className="overflow-hidden hover:shadow-md transition-shadow">
        <div className="h-40 bg-gray-200 relative overflow-hidden">
          {shop.image ? (
            <img 
              src={shop.image} 
              alt={shop.name} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-gray-200">
              <span className="text-gray-400">No image</span>
            </div>
          )}
          <Badge className="absolute top-2 left-2 bg-primary/90 hover:bg-primary text-white">
            {categoryName}
          </Badge>
          <div className="absolute top-2 right-2 flex space-x-1">
            <button 
              className="p-1 bg-white rounded-full shadow-sm hover:bg-gray-100"
              aria-label="Edit shop"
              onClick={() => setShowEditDialog(true)}
            >
              <Edit className="h-4 w-4 text-gray-600" />
            </button>
            <button 
              className="p-1 bg-white rounded-full shadow-sm hover:bg-gray-100"
              aria-label="Delete shop"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </button>
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-medium text-gray-800 text-lg">{shop.name}</h3>
          <p className="text-gray-500 text-sm mt-1 line-clamp-2">
            {shop.description || "No description available"}
          </p>
          {shop.address && (
            <div className="flex items-center mt-3 text-sm text-gray-500">
              <MapPin className="h-4 w-4 mr-1" />
              <span className="line-clamp-1">{shop.address}</span>
            </div>
          )}
        </div>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the shop "{shop.name}" and cannot be undone.
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

      {/* Edit Shop Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Edit Shop</DialogTitle>
          </DialogHeader>
          <ShopForm shopId={shop.id} onSuccess={handleEditSuccess} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ShopCard;
