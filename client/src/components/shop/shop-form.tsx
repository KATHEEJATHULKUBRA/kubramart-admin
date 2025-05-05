import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
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
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { ShopCategory, insertShopSchema } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

// Extend the shop schema with validation
const shopFormSchema = insertShopSchema.extend({
  name: z.string().min(3, "Shop name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
});

type ShopFormValues = z.infer<typeof shopFormSchema>;

interface ShopFormProps {
  shopId?: number;
  onSuccess?: () => void;
}

const ShopForm = ({ shopId, onSuccess }: ShopFormProps) => {
  const { toast } = useToast();
  const isEditing = !!shopId;

  // Fetch shop categories for dropdown
  const { data: categories, isLoading: isCategoriesLoading } = useQuery<ShopCategory[]>({
    queryKey: ["/api/shop-categories"],
  });

  // Fetch shop data if editing
  const { data: shopData, isLoading: isShopLoading } = useQuery({
    queryKey: [`/api/shops/${shopId}`],
    enabled: isEditing,
  });

  // Create form with validation
  const form = useForm<ShopFormValues>({
    resolver: zodResolver(shopFormSchema),
    defaultValues: {
      name: shopData?.name || "",
      description: shopData?.description || "",
      image: shopData?.image || "",
      address: shopData?.address || "",
      categoryId: shopData?.categoryId || undefined,
    },
    values: shopData,
  });

  // Create or update shop mutation
  const mutation = useMutation({
    mutationFn: async (data: ShopFormValues) => {
      if (isEditing) {
        return await apiRequest("PUT", `/api/shops/${shopId}`, data);
      } else {
        return await apiRequest("POST", "/api/shops", data);
      }
    },
    onSuccess: () => {
      toast({
        title: isEditing ? "Shop updated" : "Shop created",
        description: isEditing
          ? "The shop has been updated successfully"
          : "New shop has been created successfully",
      });
      
      // Invalidate shop queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["/api/shops"] });
      
      // Call onSuccess callback
      if (onSuccess) {
        onSuccess();
      }

      // Reset form if creating new shop
      if (!isEditing) {
        form.reset();
      }
    },
    onError: (error) => {
      toast({
        title: isEditing ? "Failed to update shop" : "Failed to create shop",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ShopFormValues) => {
    mutation.mutate(data);
  };

  if (isEditing && isShopLoading) {
    return (
      <div className="flex justify-center my-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Shop Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter shop name" {...field} />
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
                  placeholder="Enter shop description" 
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

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="Enter shop address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select 
                value={field.value?.toString()} 
                onValueChange={(value) => field.onChange(parseInt(value))}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {isCategoriesLoading ? (
                    <div className="flex items-center justify-center p-2">
                      <Loader2 className="h-4 w-4 animate-spin text-primary mr-2" />
                      <span>Loading categories...</span>
                    </div>
                  ) : (
                    categories?.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
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
          {isEditing ? "Update Shop" : "Create Shop"}
        </Button>
      </form>
    </Form>
  );
};

export default ShopForm;
