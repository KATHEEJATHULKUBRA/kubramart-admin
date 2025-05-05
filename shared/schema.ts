import { pgTable, text, serial, integer, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  email: text("email"),
  avatar: text("avatar"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  firstName: true,
  lastName: true,
  email: true,
  avatar: true,
});

// Shop category schema
export const shopCategories = pgTable("shop_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  image: text("image"),
});

export const insertShopCategorySchema = createInsertSchema(shopCategories).pick({
  name: true,
  description: true,
  image: true,
});

// Shop schema
export const shops = pgTable("shops", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  image: text("image"),
  address: text("address"),
  categoryId: integer("category_id").references(() => shopCategories.id),
});

export const insertShopSchema = createInsertSchema(shops).pick({
  name: true,
  description: true,
  image: true,
  address: true,
  categoryId: true,
});

// Order status enum
export const orderStatusEnum = pgEnum("order_status", [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
]);

// Orders schema
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderNumber: text("order_number").notNull(),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email"),
  shopId: integer("shop_id").references(() => shops.id),
  amount: text("amount").notNull(),
  status: orderStatusEnum("status").notNull().default("pending"),
  date: timestamp("date").defaultNow(),
});

export const insertOrderSchema = createInsertSchema(orders).pick({
  orderNumber: true,
  customerName: true,
  customerEmail: true,
  shopId: true,
  amount: true,
  status: true,
  date: true,
});

// Transaction payment method enum
export const paymentMethodEnum = pgEnum("payment_method", [
  "credit_card",
  "paypal",
  "bank_transfer",
  "cash",
]);

// Transactions schema
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  transactionId: text("transaction_id").notNull(),
  orderId: integer("order_id").references(() => orders.id),
  amount: text("amount").notNull(),
  paymentMethod: paymentMethodEnum("payment_method").notNull(),
  date: timestamp("date").defaultNow(),
});

export const insertTransactionSchema = createInsertSchema(transactions).pick({
  transactionId: true,
  orderId: true,
  amount: true,
  paymentMethod: true,
  date: true,
});

// Define types based on the schemas
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertShopCategory = z.infer<typeof insertShopCategorySchema>;
export type ShopCategory = typeof shopCategories.$inferSelect;

export type InsertShop = z.infer<typeof insertShopSchema>;
export type Shop = typeof shops.$inferSelect;

export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;

export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Transaction = typeof transactions.$inferSelect;
