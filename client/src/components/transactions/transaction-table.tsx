import { useState } from "react";
import { Transaction } from "@shared/schema";
import { Table, TableBody, TableCell, TableHeader, TableRow, TableHead } from "@/components/ui/table";
import { format } from "date-fns";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";

interface TransactionTableProps {
  transactions: Transaction[];
}

const TransactionTable = ({ transactions }: TransactionTableProps) => {
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [showTransactionDetails, setShowTransactionDetails] = useState(false);

  // Fetch orders to get related order details
  const { data: orders } = useQuery({
    queryKey: ["/api/orders"],
  });

  const getOrderDetails = (orderId: number) => {
    return orders?.find(order => order.id === orderId);
  };

  const handleViewTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setShowTransactionDetails(true);
  };

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case "credit_card":
        return "Credit Card";
      case "paypal":
        return "PayPal";
      case "bank_transfer":
        return "Bank Transfer";
      case "cash":
        return "Cash";
      default:
        return method;
    }
  };

  const getPaymentMethodStyle = (method: string) => {
    switch (method) {
      case "credit_card":
        return "bg-blue-100 text-blue-800";
      case "paypal":
        return "bg-indigo-100 text-indigo-800";
      case "bank_transfer":
        return "bg-green-100 text-green-800";
      case "cash":
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[130px]">Transaction ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Order</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Payment Method</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id} className="hover:bg-gray-50">
                <TableCell className="font-medium">{transaction.transactionId}</TableCell>
                <TableCell>{format(new Date(transaction.date), "MMM dd, yyyy")}</TableCell>
                <TableCell>
                  {getOrderDetails(transaction.orderId)?.orderNumber || `Order #${transaction.orderId}`}
                </TableCell>
                <TableCell className="font-medium">${transaction.amount}</TableCell>
                <TableCell>
                  <Badge 
                    variant="outline" 
                    className={`${getPaymentMethodStyle(transaction.paymentMethod)} font-medium px-2 py-1 text-xs`}
                  >
                    {getPaymentMethodLabel(transaction.paymentMethod)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleViewTransaction(transaction)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Transaction Details Dialog */}
      <Dialog open={showTransactionDetails} onOpenChange={setShowTransactionDetails}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
          </DialogHeader>
          
          {selectedTransaction && (
            <div>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <div>
                    <div className="text-sm text-gray-500">Transaction ID</div>
                    <div className="font-medium">{selectedTransaction.transactionId}</div>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`${getPaymentMethodStyle(selectedTransaction.paymentMethod)} font-medium px-2 py-1 text-xs`}
                  >
                    {getPaymentMethodLabel(selectedTransaction.paymentMethod)}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500">Date</div>
                    <div className="font-medium">
                      {format(new Date(selectedTransaction.date), "MMMM dd, yyyy")}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Time</div>
                    <div className="font-medium">
                      {format(new Date(selectedTransaction.date), "hh:mm a")}
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="text-sm text-gray-500">Order</div>
                  <div className="font-medium">
                    {getOrderDetails(selectedTransaction.orderId)?.orderNumber || `Order #${selectedTransaction.orderId}`}
                  </div>
                </div>
                
                <div>
                  <div className="text-sm text-gray-500">Customer</div>
                  <div className="font-medium">
                    {getOrderDetails(selectedTransaction.orderId)?.customerName || "Unknown Customer"}
                  </div>
                </div>
                
                <div className="pt-2 border-t border-gray-100">
                  <div className="flex justify-between py-2">
                    <span>Subtotal</span>
                    <span>${(parseFloat(selectedTransaction.amount) * 0.9).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span>Tax</span>
                    <span>${(parseFloat(selectedTransaction.amount) * 0.1).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-t border-gray-100">
                    <span className="font-medium">Total</span>
                    <span className="font-medium">${selectedTransaction.amount}</span>
                  </div>
                </div>
                
                {/* Additional transaction details could be shown here */}
                <div className="mt-4 p-4 bg-gray-50 rounded-md">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Payment Information</h4>
                  
                  {selectedTransaction.paymentMethod === "credit_card" && (
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Card Type</span>
                        <span className="text-sm">Visa</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Card Number</span>
                        <span className="text-sm">•••• •••• •••• 4242</span>
                      </div>
                    </div>
                  )}
                  
                  {selectedTransaction.paymentMethod === "paypal" && (
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">PayPal Account</span>
                        <span className="text-sm">customer@example.com</span>
                      </div>
                    </div>
                  )}
                  
                  {selectedTransaction.paymentMethod === "bank_transfer" && (
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Bank</span>
                        <span className="text-sm">Example Bank</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Reference</span>
                        <span className="text-sm">{selectedTransaction.transactionId}</span>
                      </div>
                    </div>
                  )}
                  
                  {selectedTransaction.paymentMethod === "cash" && (
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Receipt Number</span>
                        <span className="text-sm">RCPT-{selectedTransaction.id}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              onClick={() => setShowTransactionDetails(false)}
              className="bg-primary hover:bg-primary/90"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TransactionTable;
