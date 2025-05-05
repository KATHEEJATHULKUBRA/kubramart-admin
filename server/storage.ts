import { users, type User, type InsertUser } from "@shared/schema";
import { shops, type Shop, type InsertShop } from "@shared/schema";
import { shopCategories, type ShopCategory, type InsertShopCategory } from "@shared/schema";
import { orders, type Order, type InsertOrder } from "@shared/schema";
import { transactions, type Transaction, type InsertTransaction } from "@shared/schema";
import session from "express-session";
import type { Store } from "express-session";
import createMemoryStore from "memorystore";
import connectPg from "connect-pg-simple";
import { db } from "./db";
import { eq, and } from "drizzle-orm";
import { pool } from "./db";

const MemoryStore = createMemoryStore(session);
const PostgresStore = connectPg(session);

// Interface with all CRUD methods
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined>;
  
  // Shop category methods
  getShopCategories(): Promise<ShopCategory[]>;
  getShopCategory(id: number): Promise<ShopCategory | undefined>;
  createShopCategory(category: InsertShopCategory): Promise<ShopCategory>;
  updateShopCategory(id: number, category: Partial<InsertShopCategory>): Promise<ShopCategory | undefined>;
  deleteShopCategory(id: number): Promise<boolean>;
  
  // Shop methods
  getShops(): Promise<Shop[]>;
  getShopsByCategory(categoryId: number): Promise<Shop[]>;
  getShop(id: number): Promise<Shop | undefined>;
  createShop(shop: InsertShop): Promise<Shop>;
  updateShop(id: number, shop: Partial<InsertShop>): Promise<Shop | undefined>;
  deleteShop(id: number): Promise<boolean>;
  
  // Order methods
  getOrders(): Promise<Order[]>;
  getOrdersByShop(shopId: number): Promise<Order[]>;
  getOrder(id: number): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrder(id: number, order: Partial<InsertOrder>): Promise<Order | undefined>;
  
  // Transaction methods
  getTransactions(): Promise<Transaction[]>;
  getTransactionsByOrder(orderId: number): Promise<Transaction[]>;
  getTransaction(id: number): Promise<Transaction | undefined>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  
  // Session store for authentication
  sessionStore: Store;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private shopCategories: Map<number, ShopCategory>;
  private shops: Map<number, Shop>;
  private orders: Map<number, Order>;
  private transactions: Map<number, Transaction>;
  private userCurrentId: number;
  private categoryCurrentId: number;
  private shopCurrentId: number;
  private orderCurrentId: number;
  private transactionCurrentId: number;
  sessionStore: Store;

  constructor() {
    this.users = new Map();
    this.shopCategories = new Map();
    this.shops = new Map();
    this.orders = new Map();
    this.transactions = new Map();
    this.userCurrentId = 1;
    this.categoryCurrentId = 1;
    this.shopCurrentId = 1;
    this.orderCurrentId = 1;
    this.transactionCurrentId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // 24 hours
    });
    
    // Add some initial sample data
    this.seedSampleData();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Shop category methods
  async getShopCategories(): Promise<ShopCategory[]> {
    return Array.from(this.shopCategories.values());
  }

  async getShopCategory(id: number): Promise<ShopCategory | undefined> {
    return this.shopCategories.get(id);
  }

  async createShopCategory(category: InsertShopCategory): Promise<ShopCategory> {
    const id = this.categoryCurrentId++;
    const newCategory: ShopCategory = { ...category, id };
    this.shopCategories.set(id, newCategory);
    return newCategory;
  }

  async updateShopCategory(id: number, categoryData: Partial<InsertShopCategory>): Promise<ShopCategory | undefined> {
    const category = await this.getShopCategory(id);
    if (!category) return undefined;
    
    const updatedCategory = { ...category, ...categoryData };
    this.shopCategories.set(id, updatedCategory);
    return updatedCategory;
  }

  async deleteShopCategory(id: number): Promise<boolean> {
    return this.shopCategories.delete(id);
  }

  // Shop methods
  async getShops(): Promise<Shop[]> {
    return Array.from(this.shops.values());
  }

  async getShopsByCategory(categoryId: number): Promise<Shop[]> {
    return Array.from(this.shops.values()).filter(
      (shop) => shop.categoryId === categoryId,
    );
  }

  async getShop(id: number): Promise<Shop | undefined> {
    return this.shops.get(id);
  }

  async createShop(shop: InsertShop): Promise<Shop> {
    const id = this.shopCurrentId++;
    const newShop: Shop = { ...shop, id };
    this.shops.set(id, newShop);
    return newShop;
  }

  async updateShop(id: number, shopData: Partial<InsertShop>): Promise<Shop | undefined> {
    const shop = await this.getShop(id);
    if (!shop) return undefined;
    
    const updatedShop = { ...shop, ...shopData };
    this.shops.set(id, updatedShop);
    return updatedShop;
  }

  async deleteShop(id: number): Promise<boolean> {
    return this.shops.delete(id);
  }

  // Order methods
  async getOrders(): Promise<Order[]> {
    return Array.from(this.orders.values());
  }

  async getOrdersByShop(shopId: number): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(
      (order) => order.shopId === shopId,
    );
  }

  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const id = this.orderCurrentId++;
    const newOrder: Order = { ...order, id };
    this.orders.set(id, newOrder);
    return newOrder;
  }

  async updateOrder(id: number, orderData: Partial<InsertOrder>): Promise<Order | undefined> {
    const order = await this.getOrder(id);
    if (!order) return undefined;
    
    const updatedOrder = { ...order, ...orderData };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }

  // Transaction methods
  async getTransactions(): Promise<Transaction[]> {
    return Array.from(this.transactions.values());
  }

  async getTransactionsByOrder(orderId: number): Promise<Transaction[]> {
    return Array.from(this.transactions.values()).filter(
      (transaction) => transaction.orderId === orderId,
    );
  }

  async getTransaction(id: number): Promise<Transaction | undefined> {
    return this.transactions.get(id);
  }

  async createTransaction(transaction: InsertTransaction): Promise<Transaction> {
    const id = this.transactionCurrentId++;
    const newTransaction: Transaction = { ...transaction, id };
    this.transactions.set(id, newTransaction);
    return newTransaction;
  }

  // Seed initial data for testing
  private seedSampleData() {
    // Create admin user
    const adminUser: User = {
      id: this.userCurrentId++,
      username: "admin",
      password: "5b78418e937247662894f3c8f0aa584a9d547f49574beb49ca403d0fcd6c9a890c861c2c2455d846d042a21506bc261deebe04a8db84fddd70c024b701f56441.69b717d31c5e2a4c415b5d97add8ee6a", // admin123
      firstName: "Admin",
      lastName: "User",
      email: "admin@example.com",
      avatar: null
    };
    this.users.set(adminUser.id, adminUser);
    
    // Categories
    const groceryCategory: ShopCategory = {
      id: this.categoryCurrentId++,
      name: "Grocery Stores",
      description: "General grocery stores with a wide range of products",
      image: "https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
    };
    
    const organicCategory: ShopCategory = {
      id: this.categoryCurrentId++,
      name: "Organic Markets",
      description: "Specialized stores with organic and natural products",
      image: "https://images.unsplash.com/photo-1578862973954-ad04ebae8729?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
    };
    
    this.shopCategories.set(groceryCategory.id, groceryCategory);
    this.shopCategories.set(organicCategory.id, organicCategory);

    // Shops
    const farmFresh: Shop = {
      id: this.shopCurrentId++,
      name: "Farm Fresh Groceries",
      description: "The freshest produce direct from farms",
      image: "https://images.unsplash.com/photo-1578862973954-ad04ebae8729?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      address: "123 Market St, San Francisco, CA",
      categoryId: groceryCategory.id
    };
    
    const organicDelights: Shop = {
      id: this.shopCurrentId++,
      name: "Organic Delights",
      description: "100% organic produce and products",
      image: "https://images.unsplash.com/photo-1578862973954-ad04ebae8729?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      address: "456 Organic Ave, Portland, OR",
      categoryId: organicCategory.id
    };
    
    this.shops.set(farmFresh.id, farmFresh);
    this.shops.set(organicDelights.id, organicDelights);

    // Orders
    const order1: Order = {
      id: this.orderCurrentId++,
      orderNumber: "ORD-2458",
      customerName: "Sarah Johnson",
      customerEmail: "sarah@example.com",
      shopId: farmFresh.id,
      amount: "125.00",
      status: "processing",
      date: new Date()
    };
    
    const order2: Order = {
      id: this.orderCurrentId++,
      orderNumber: "ORD-2457",
      customerName: "Michael Brown",
      customerEmail: "michael@example.com",
      shopId: organicDelights.id,
      amount: "89.50",
      status: "delivered",
      date: new Date()
    };
    
    this.orders.set(order1.id, order1);
    this.orders.set(order2.id, order2);

    // Transactions
    const transaction1: Transaction = {
      id: this.transactionCurrentId++,
      transactionId: "TRX-12345",
      orderId: order1.id,
      amount: "125.00",
      paymentMethod: "credit_card",
      date: new Date()
    };
    
    const transaction2: Transaction = {
      id: this.transactionCurrentId++,
      transactionId: "TRX-12346",
      orderId: order2.id,
      amount: "89.50",
      paymentMethod: "paypal",
      date: new Date()
    };
    
    this.transactions.set(transaction1.id, transaction1);
    this.transactions.set(transaction2.id, transaction2);
  }
}

export class DatabaseStorage implements IStorage {
  sessionStore: Store;

  constructor() {
    this.sessionStore = new PostgresStore({
      pool,
      createTableIfMissing: true
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined> {
    if (!Object.keys(userData).length) return this.getUser(id);
    
    const result = await db.update(users)
      .set(userData)
      .where(eq(users.id, id))
      .returning();
    
    return result[0];
  }

  // Shop category methods
  async getShopCategories(): Promise<ShopCategory[]> {
    return await db.select().from(shopCategories);
  }

  async getShopCategory(id: number): Promise<ShopCategory | undefined> {
    const result = await db.select().from(shopCategories).where(eq(shopCategories.id, id));
    return result[0];
  }

  async createShopCategory(category: InsertShopCategory): Promise<ShopCategory> {
    const result = await db.insert(shopCategories).values(category).returning();
    return result[0];
  }

  async updateShopCategory(id: number, categoryData: Partial<InsertShopCategory>): Promise<ShopCategory | undefined> {
    if (!Object.keys(categoryData).length) return this.getShopCategory(id);
    
    const result = await db.update(shopCategories)
      .set(categoryData)
      .where(eq(shopCategories.id, id))
      .returning();
    
    return result[0];
  }

  async deleteShopCategory(id: number): Promise<boolean> {
    const result = await db.delete(shopCategories).where(eq(shopCategories.id, id)).returning();
    return result.length > 0;
  }

  // Shop methods
  async getShops(): Promise<Shop[]> {
    return await db.select().from(shops);
  }

  async getShopsByCategory(categoryId: number): Promise<Shop[]> {
    return await db.select().from(shops).where(eq(shops.categoryId, categoryId));
  }

  async getShop(id: number): Promise<Shop | undefined> {
    const result = await db.select().from(shops).where(eq(shops.id, id));
    return result[0];
  }

  async createShop(shop: InsertShop): Promise<Shop> {
    const result = await db.insert(shops).values(shop).returning();
    return result[0];
  }

  async updateShop(id: number, shopData: Partial<InsertShop>): Promise<Shop | undefined> {
    if (!Object.keys(shopData).length) return this.getShop(id);
    
    const result = await db.update(shops)
      .set(shopData)
      .where(eq(shops.id, id))
      .returning();
    
    return result[0];
  }

  async deleteShop(id: number): Promise<boolean> {
    const result = await db.delete(shops).where(eq(shops.id, id)).returning();
    return result.length > 0;
  }

  // Order methods
  async getOrders(): Promise<Order[]> {
    return await db.select().from(orders);
  }

  async getOrdersByShop(shopId: number): Promise<Order[]> {
    return await db.select().from(orders).where(eq(orders.shopId, shopId));
  }

  async getOrder(id: number): Promise<Order | undefined> {
    const result = await db.select().from(orders).where(eq(orders.id, id));
    return result[0];
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const result = await db.insert(orders).values(order).returning();
    return result[0];
  }

  async updateOrder(id: number, orderData: Partial<InsertOrder>): Promise<Order | undefined> {
    if (!Object.keys(orderData).length) return this.getOrder(id);
    
    const result = await db.update(orders)
      .set(orderData)
      .where(eq(orders.id, id))
      .returning();
    
    return result[0];
  }

  // Transaction methods
  async getTransactions(): Promise<Transaction[]> {
    return await db.select().from(transactions);
  }

  async getTransactionsByOrder(orderId: number): Promise<Transaction[]> {
    return await db.select().from(transactions).where(eq(transactions.orderId, orderId));
  }

  async getTransaction(id: number): Promise<Transaction | undefined> {
    const result = await db.select().from(transactions).where(eq(transactions.id, id));
    return result[0];
  }

  async createTransaction(transaction: InsertTransaction): Promise<Transaction> {
    const result = await db.insert(transactions).values(transaction).returning();
    return result[0];
  }
}

// Use MemStorage instead of DatabaseStorage for development without a database
export const storage = new MemStorage();
