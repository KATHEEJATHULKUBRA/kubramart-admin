import { useState } from "react";
import { Order } from "@shared/schema";
import { Table, TableBody, TableCell, TableHeader, TableRow, TableHead } from "@/components/ui/table";
import OrderStatusBadge from "./order-status-badge";
import { formatDistanceToNow, format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, MoreHorizontal, Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface OrderTableProps {
  orders: Order[];
  getShopName: (shopId: number) => string;
}

const OrderTable = ({ orders, getShopName }: OrderTableProps) => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const { toast } = useToast();

  // Update order status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: number, status: string }) => {
      return await apiRequest("PUT", `/api/orders/${orderId}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      toast({
        title: "Order status updated",
        description: "The order status has been updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to update order status",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const handleUpdateStatus = (orderId: number, status: string) => {
    updateStatusMutation.mutate({ orderId, status });
  };

  return (
    <>
      <div className="bg-white rounded-lg overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Shop</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id} className="hover:bg-gray-50">
                <TableCell className="font-medium">{order.orderNumber}</TableCell>
                <TableCell>{order.customerName}</TableCell>
                <TableCell>{getShopName(order.shopId)}</TableCell>
                <TableCell className="text-gray-500">
                  {format(new Date(order.date), "MMM dd, yyyy")}
                  <div className="text-xs text-gray-400">
                    {formatDistanceToNow(new Date(order.date), { addSuffix: true })}
                  </div>
                </TableCell>
                <TableCell className="font-medium">${order.amount}</TableCell>
                <TableCell>
                  <OrderStatusBadge status={order.status} />
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleViewOrder(order)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem className="p-0">
                        <DropdownMenu>
                          <DropdownMenuTrigger className="flex items-center w-full px-2 py-1.5 text-sm">
                            <div className="flex items-center justify-between w-full">
                              <div className="flex items-center">
                                <ChevronDown className="mr-2 h-4 w-4" />
                                Update Status
                              </div>
                              <OrderStatusBadge status={order.status} size="sm" />
                            </div>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => handleUpdateStatus(order.id, "pending")}>
                              <OrderStatusBadge status="pending" size="sm" className="mr-2" />
                              Pending
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleUpdateStatus(order.id, "processing")}>
                              <OrderStatusBadge status="processing" size="sm" className="mr-2" />
                              Processing
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleUpdateStatus(order.id, "shipped")}>
                              <OrderStatusBadge status="shipped" size="sm" className="mr-2" />
                              Shipped
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleUpdateStatus(order.id, "delivered")}>
                              <OrderStatusBadge status="delivered" size="sm" className="mr-2" />
                              Delivered
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleUpdateStatus(order.id, "cancelled")}>
                              <OrderStatusBadge status="cancelled" size="sm" className="mr-2" />
                              Cancelled
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Order Details Dialog */}
      <Dialog open={showOrderDetails} onOpenChange={setShowOrderDetails}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium">{selectedOrder.orderNumber}</h3>
                  <p className="text-gray-500">
                    {format(new Date(selectedOrder.date), "MMMM dd, yyyy 'at' h:mm a")}
                  </p>
                </div>
                <OrderStatusBadge status={selectedOrder.status} />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-gray-500">Customer Info</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-medium">{selectedOrder.customerName}</p>
                    {selectedOrder.customerEmail && (
                      <p className="text-sm text-gray-500">{selectedOrder.customerEmail}</p>
                    )}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-gray-500">Shop Info</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-medium">{getShopName(selectedOrder.shopId)}</p>
                    <p className="text-sm text-gray-500">Shop ID: {selectedOrder.shopId}</p>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-gray-500">Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between py-2">
                    <span>Subtotal</span>
                    <span>${(parseFloat(selectedOrder.amount) * 0.9).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span>Tax</span>
                    <span>${(parseFloat(selectedOrder.amount) * 0.1).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-t">
                    <span className="font-medium">Total</span>
                    <span className="font-medium">${selectedOrder.amount}</span>
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowOrderDetails(false)}>
                  Close
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="bg-primary hover:bg-primary/90">
                      Update Status
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => {
                      handleUpdateStatus(selectedOrder.id, "pending");
                      setShowOrderDetails(false);
                    }}>
                      <OrderStatusBadge status="pending" size="sm" className="mr-2" />
                      Pending
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => {
                      handleUpdateStatus(selectedOrder.id, "processing");
                      setShowOrderDetails(false);
                    }}>
                      <OrderStatusBadge status="processing" size="sm" className="mr-2" />
                      Processing
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => {
                      handleUpdateStatus(selectedOrder.id, "shipped");
                      setShowOrderDetails(false);
                    }}>
                      <OrderStatusBadge status="shipped" size="sm" className="mr-2" />
                      Shipped
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => {
                      handleUpdateStatus(selectedOrder.id, "delivered");
                      setShowOrderDetails(false);
                    }}>
                      <OrderStatusBadge status="delivered" size="sm" className="mr-2" />
                      Delivered
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => {
                      handleUpdateStatus(selectedOrder.id, "cancelled");
                      setShowOrderDetails(false);
                    }}>
                      <OrderStatusBadge status="cancelled" size="sm" className="mr-2" />
                      Cancelled
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default OrderTable;
