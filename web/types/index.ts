export enum InventorySection {
  SectionA = 0,
  SectionB = 1,
  SectionC = 2,
  SectionD = 3,
}

export enum PurchaseStatus {
  Pending = 0,
  Active = 1,
  Completed = 2,
  Cancelled = 3,
}

export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  unitPrice: number;
  section: InventorySection;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateInventoryItemDto {
  name: string;
  description: string;
  quantity: number;
  unitPrice: number;
  section: InventorySection;
  imageUrl: string;
}

export interface UpdateInventoryItemDto {
  name: string;
  description: string;
  quantity: number;
  unitPrice: number;
  section: InventorySection;
  imageUrl: string;
}

export interface PurchaseItem {
  id: string;
  inventoryItemId?: string | null;
  itemName: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  section: InventorySection;
  addedToInventory: boolean;
}

export interface Purchase {
  id: string;
  purchasedBy: string;
  totalCost: number;
  status: PurchaseStatus;
  purchaseDate: string;
  createdAt: string;
  purchaseItems: PurchaseItem[];
}

export interface CreatePurchaseItemDto {
  itemName: string;
  description: string;
  quantity: number;
  unitPrice: number;
  section: InventorySection;
}

export interface CreatePurchaseDto {
  purchasedBy: string;
  purchaseDate: string;
  purchaseItems: CreatePurchaseItemDto[];
}

export interface SectionCapacity {
  section: InventorySection;
  totalCapacity: number;
  usedCapacity: number;
  remainingCapacity: number;
  usagePercentage: number;
}

export interface InventoryLog {
  id: string;
  inventoryItemId: string;
  itemName: string;
  action: string;
  quantityChanged: number;
  performedBy: string;
  createdAt: string;
}

export interface DashboardStats {
  totalInventoryCapacity: number;
  usedInventoryCapacity: number;
  totalItemsStored: number;
  totalSales: number;
  totalCostCurrentYear: number;
  sectionCapacities: SectionCapacity[];
  recentInventoryLogs: InventoryLog[];
  recentPurchases: Purchase[];
}

// User Role enum
export enum UserRole {
  User = 'user',
  Admin = 'admin',
}

// Profile with role
export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

// Admin Dashboard Stats
export interface AdminDashboardStats {
  dailyRegisteredUsers: number;
  dailyActiveUsers: number;
  totalUsers: number;
  activeUsersCount: number;
  inactiveUsersCount: number;
  topActiveUsers: UserActivity[];
  recentInventoryChanges: RecentInventoryChange[];
  orderFulfillmentRate: number;
  backorderCount: number;
  averageProcessingTimeMinutes: number;
}

export interface UserActivity {
  userId: string;
  userName: string;
  inventoryUpdatesCount: number;
  lastActivityAt: string;
}

export interface RecentInventoryChange {
  userId: string;
  userName: string;
  itemName: string;
  action: string;
  quantityChanged: number;
  createdAt: string;
}

// Admin User Management
export interface AdminUser {
  id: string;
  name: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  totalInventoryItems: number;
  totalPurchases: number;
  lastActivityAt: string | null;
}

export interface UpdateUserDto {
  name?: string;
  role?: string;
}
