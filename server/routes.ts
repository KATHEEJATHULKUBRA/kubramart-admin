import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { insertShopCategorySchema, insertShopSchema, insertOrderSchema, insertTransactionSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);

  // Shop Categories API
  app.get("/api/shop-categories", async (req, res) => {
    try {
      const categories = await storage.getShopCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch shop categories" });
    }
  });

  app.get("/api/shop-categories/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const category = await storage.getShopCategory(id);
      
      if (!category) {
        return res.status(404).json({ message: "Shop category not found" });
      }
      
      res.json(category);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch shop category" });
    }
  });

  app.post("/api/shop-categories", async (req, res) => {
    try {
      const validatedData = insertShopCategorySchema.parse(req.body);
      const newCategory = await storage.createShopCategory(validatedData);
      res.status(201).json(newCategory);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid shop category data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create shop category" });
    }
  });

  app.put("/api/shop-categories/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertShopCategorySchema.partial().parse(req.body);
      
      const updatedCategory = await storage.updateShopCategory(id, validatedData);
      
      if (!updatedCategory) {
        return res.status(404).json({ message: "Shop category not found" });
      }
      
      res.json(updatedCategory);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid shop category data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update shop category" });
    }
  });

  app.delete("/api/shop-categories/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const result = await storage.deleteShopCategory(id);
      
      if (!result) {
        return res.status(404).json({ message: "Shop category not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete shop category" });
    }
  });

  // Shops API
  app.get("/api/shops", async (req, res) => {
    try {
      const categoryId = req.query.categoryId ? parseInt(req.query.categoryId as string) : undefined;
      
      let shops;
      if (categoryId) {
        shops = await storage.getShopsByCategory(categoryId);
      } else {
        shops = await storage.getShops();
      }
      
      res.json(shops);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch shops" });
    }
  });

  app.get("/api/shops/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const shop = await storage.getShop(id);
      
      if (!shop) {
        return res.status(404).json({ message: "Shop not found" });
      }
      
      res.json(shop);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch shop" });
    }
  });

  app.post("/api/shops", async (req, res) => {
    try {
      const validatedData = insertShopSchema.parse(req.body);
      const newShop = await storage.createShop(validatedData);
      res.status(201).json(newShop);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid shop data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create shop" });
    }
  });

  app.put("/api/shops/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertShopSchema.partial().parse(req.body);
      
      const updatedShop = await storage.updateShop(id, validatedData);
      
      if (!updatedShop) {
        return res.status(404).json({ message: "Shop not found" });
      }
      
      res.json(updatedShop);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid shop data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update shop" });
    }
  });

  app.delete("/api/shops/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const result = await storage.deleteShop(id);
      
      if (!result) {
        return res.status(404).json({ message: "Shop not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete shop" });
    }
  });

  // Orders API
  app.get("/api/orders", async (req, res) => {
    try {
      const shopId = req.query.shopId ? parseInt(req.query.shopId as string) : undefined;
      
      let orders;
      if (shopId) {
        orders = await storage.getOrdersByShop(shopId);
      } else {
        orders = await storage.getOrders();
      }
      
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.get("/api/orders/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const order = await storage.getOrder(id);
      
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch order" });
    }
  });

  app.post("/api/orders", async (req, res) => {
    try {
      const validatedData = insertOrderSchema.parse(req.body);
      const newOrder = await storage.createOrder(validatedData);
      res.status(201).json(newOrder);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid order data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  app.put("/api/orders/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertOrderSchema.partial().parse(req.body);
      
      const updatedOrder = await storage.updateOrder(id, validatedData);
      
      if (!updatedOrder) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      res.json(updatedOrder);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid order data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update order" });
    }
  });

  // Transactions API
  app.get("/api/transactions", async (req, res) => {
    try {
      const orderId = req.query.orderId ? parseInt(req.query.orderId as string) : undefined;
      
      let transactions;
      if (orderId) {
        transactions = await storage.getTransactionsByOrder(orderId);
      } else {
        transactions = await storage.getTransactions();
      }
      
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  app.get("/api/transactions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const transaction = await storage.getTransaction(id);
      
      if (!transaction) {
        return res.status(404).json({ message: "Transaction not found" });
      }
      
      res.json(transaction);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch transaction" });
    }
  });

  app.post("/api/transactions", async (req, res) => {
    try {
      const validatedData = insertTransactionSchema.parse(req.body);
      const newTransaction = await storage.createTransaction(validatedData);
      res.status(201).json(newTransaction);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid transaction data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create transaction" });
    }
  });

  // Analytics API
  app.get("/api/analytics/sales", async (req, res) => {
    try {
      // Get all orders, then calculate monthly sales
      const orders = await storage.getOrders();
      
      // Group by month
      const monthlySales = orders.reduce((acc, order) => {
        const date = order.date instanceof Date ? order.date : new Date(order.date);
        const month = date.toLocaleString('default', { month: 'long' });
        
        if (!acc[month]) {
          acc[month] = 0;
        }
        
        acc[month] += parseFloat(order.amount);
        return acc;
      }, {} as Record<string, number>);
      
      const result = Object.entries(monthlySales).map(([month, amount]) => ({
        month,
        amount
      }));
      
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch sales analytics" });
    }
  });

  app.get("/api/analytics/shops", async (req, res) => {
    try {
      // Get all orders and shops to calculate top shops
      const orders = await storage.getOrders();
      const shops = await storage.getShops();
      
      // Calculate total sales per shop
      const shopSales: Record<number, number> = {};
      
      orders.forEach(order => {
        if (!shopSales[order.shopId]) {
          shopSales[order.shopId] = 0;
        }
        
        shopSales[order.shopId] += parseFloat(order.amount);
      });
      
      // Create result array with shop details
      const result = Object.entries(shopSales).map(([shopId, amount]) => {
        const shop = shops.find(s => s.id === parseInt(shopId));
        return {
          shopId: parseInt(shopId),
          shopName: shop ? shop.name : 'Unknown Shop',
          amount
        };
      });
      
      // Sort by amount in descending order
      result.sort((a, b) => b.amount - a.amount);
      
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch shop analytics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
