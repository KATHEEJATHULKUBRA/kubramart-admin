import express, { Request, Response, NextFunction } from 'express';
import serverless from 'serverless-http';
import session from 'express-session';
import { setupAuth } from '../../server/auth';
import { storage } from '../../server/storage';
import cors from 'cors';
import { json, urlencoded } from 'express';

// Initialize express app
const app = express();

// Basic middleware
app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));

// Set up authentication
setupAuth(app);

// A simple health check
app.get('/.netlify/functions/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API endpoints
app.get('/.netlify/functions/api/shop-categories', async (req, res) => {
  const categories = await storage.getShopCategories();
  res.json(categories);
});

app.get('/.netlify/functions/api/shops', async (req, res) => {
  const shops = await storage.getShops();
  res.json(shops);
});

app.get('/.netlify/functions/api/orders', async (req, res) => {
  if (!req.isAuthenticated()) return res.sendStatus(401);
  const orders = await storage.getOrders();
  res.json(orders);
});

app.get('/.netlify/functions/api/transactions', async (req, res) => {
  if (!req.isAuthenticated()) return res.sendStatus(401);
  const transactions = await storage.getTransactions();
  res.json(transactions);
});

// Error handling
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({
    message: err.message || 'An unexpected error occurred',
  });
});

// Export the serverless function
export const handler = serverless(app);