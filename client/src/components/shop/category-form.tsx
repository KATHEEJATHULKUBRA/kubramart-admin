import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { insertShopCategorySchema, ShopCategory } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

// Extend the shop category schema with validation
const categoryFormSchema = insertShopCategorySchema.extend({
  name: z.string().min(3, "Category name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
});

type CategoryFormValues = z.infer<typeof categoryFormSchema>;

interface CategoryFormProps {
  categoryId?: number;
  category?: ShopCategory;
  onSuccess?: () => void;
}

const CategoryForm = ({ categoryId, category, onSuccess }: CategoryFormProps) => {
  const { toast } = useToast();
  const isEditing = !!categoryId;

  // Create form with validation
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: category?.name || "",
      description: category?.description || "",
      image: category?.image || "",
    },
    values: category
  });

  // Create or update category mutation
  const mutation = useMutation({
    mutationFn: async (data: CategoryFormValues) => {
      if (isEditing) {
        return await apiRequest("PUT", `/api/shop-categories/${categoryId}`, data);
      } else {
        return await apiRequest("POST", "/api/shop-categories", data);
      }
    },
    onSuccess: () => {
      toast({
        title: isEditing ? "Category updated" : "Category created",
        description: isEditing
          ? "The category has been updated successfully"
          : "New category has been created successfully",
      });
      
      // Invalidate category queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["/api/shop-categories"] });
      
      // Call onSuccess callback
      if (onSuccess) {
        onSuccess();
      }

      // Reset form if creating new category
      if (!isEditing) {
        form.reset();
      }
    },
    onError: (error) => {
      toast({
        title: isEditing ? "Failed to update category" : "Failed to create category",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CategoryFormValues) => {
    mutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter category name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter category description" 
                  rows={4} 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL</FormLabel>
              <FormControl>
                <Input placeholder="Enter image URL" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          className="w-full bg-primary hover:bg-primary/90" 
          disabled={mutation.isPending}
        >
          {mutation.isPending && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          {isEditing ? "Update Category" : "Create Category"}
        </Button>
      </form>
    </Form>
  );
};

export default CategoryForm;
