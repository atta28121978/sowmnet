import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, index, uniqueIndex } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extended with auction-specific fields for buyer/seller functionality.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  
  // Auction-specific fields
  userType: mysqlEnum("userType", ["buyer", "seller", "both"]).default("buyer").notNull(),
  phoneNumber: varchar("phoneNumber", { length: 20 }),
  addressLine1: text("addressLine1"),
  addressLine2: text("addressLine2"),
  city: varchar("city", { length: 100 }),
  postalCode: varchar("postalCode", { length: 20 }),
  country: varchar("country", { length: 100 }),
  isEmailVerified: boolean("isEmailVerified").default(false).notNull(),
  isPhoneVerified: boolean("isPhoneVerified").default(false).notNull(),
  status: mysqlEnum("status", ["active", "suspended", "pending_verification"]).default("active").notNull(),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
}, (table) => ({
  emailIdx: index("email_idx").on(table.email),
  phoneIdx: index("phone_idx").on(table.phoneNumber),
}));

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Categories for auction items - supports hierarchical structure
 */
export const categories = mysqlTable("categories", {
  id: int("id").autoincrement().primaryKey(),
  nameEn: varchar("nameEn", { length: 255 }).notNull(),
  nameAr: varchar("nameAr", { length: 255 }).notNull(),
  slugEn: varchar("slugEn", { length: 255 }).notNull().unique(),
  slugAr: varchar("slugAr", { length: 255 }).notNull().unique(),
  parentCategoryId: int("parentCategoryId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Category = typeof categories.$inferSelect;
export type InsertCategory = typeof categories.$inferInsert;

/**
 * Locations where auction items are physically located
 */
export const locations = mysqlTable("locations", {
  id: int("id").autoincrement().primaryKey(),
  city: varchar("city", { length: 100 }).notNull(),
  country: varchar("country", { length: 100 }).notNull(),
  latitude: varchar("latitude", { length: 20 }),
  longitude: varchar("longitude", { length: 20 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  cityCountryIdx: uniqueIndex("city_country_idx").on(table.city, table.country),
}));

export type Location = typeof locations.$inferSelect;
export type InsertLocation = typeof locations.$inferInsert;

/**
 * Auctions - the core table for all auction listings
 */
export const auctions = mysqlTable("auctions", {
  id: int("id").autoincrement().primaryKey(),
  sellerId: int("sellerId").notNull(),
  
  // Bilingual content
  titleEn: varchar("titleEn", { length: 500 }).notNull(),
  titleAr: varchar("titleAr", { length: 500 }).notNull(),
  descriptionEn: text("descriptionEn").notNull(),
  descriptionAr: text("descriptionAr").notNull(),
  itemConditionEn: text("itemConditionEn"),
  itemConditionAr: text("itemConditionAr"),
  
  // Categorization and location
  categoryId: int("categoryId").notNull(),
  locationId: int("locationId").notNull(),
  
  // Auction status and timing
  status: mysqlEnum("status", [
    "draft",
    "pending_approval",
    "active",
    "ended_no_bids",
    "ended_sold",
    "ended_not_sold",
    "cancelled"
  ]).default("draft").notNull(),
  startTime: timestamp("startTime").notNull(),
  endTime: timestamp("endTime").notNull(),
  
  // Pricing
  startingPrice: int("startingPrice").notNull(), // in cents to avoid decimal issues
  currentPrice: int("currentPrice").notNull(),
  reservePrice: int("reservePrice"), // minimum acceptable price
  bidIncrement: int("bidIncrement").notNull().default(100), // minimum bid increase in cents
  
  // Winning bid reference
  winningBidId: int("winningBidId"),
  
  // Metadata
  viewCount: int("viewCount").default(0).notNull(),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  sellerIdx: index("seller_idx").on(table.sellerId),
  categoryIdx: index("category_idx").on(table.categoryId),
  locationIdx: index("location_idx").on(table.locationId),
  statusIdx: index("status_idx").on(table.status),
  endTimeIdx: index("end_time_idx").on(table.endTime),
}));

export type Auction = typeof auctions.$inferSelect;
export type InsertAuction = typeof auctions.$inferInsert;

/**
 * Bids placed on auctions
 */
export const bids = mysqlTable("bids", {
  id: int("id").autoincrement().primaryKey(),
  auctionId: int("auctionId").notNull(),
  bidderId: int("bidderId").notNull(),
  bidAmount: int("bidAmount").notNull(), // in cents
  isAutoBid: boolean("isAutoBid").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  auctionIdx: index("auction_idx").on(table.auctionId),
  bidderIdx: index("bidder_idx").on(table.bidderId),
  auctionTimeIdx: index("auction_time_idx").on(table.auctionId, table.createdAt),
}));

export type Bid = typeof bids.$inferSelect;
export type InsertBid = typeof bids.$inferInsert;

/**
 * Images for auction listings
 */
export const auctionImages = mysqlTable("auctionImages", {
  id: int("id").autoincrement().primaryKey(),
  auctionId: int("auctionId").notNull(),
  imageUrl: varchar("imageUrl", { length: 1000 }).notNull(),
  fileKey: varchar("fileKey", { length: 500 }).notNull(),
  altTextEn: varchar("altTextEn", { length: 255 }),
  altTextAr: varchar("altTextAr", { length: 255 }),
  displayOrder: int("displayOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  auctionIdx: index("auction_idx").on(table.auctionId),
}));

export type AuctionImage = typeof auctionImages.$inferSelect;
export type InsertAuctionImage = typeof auctionImages.$inferInsert;

/**
 * User watchlist - items users are following
 */
export const watchlist = mysqlTable("watchlist", {
  userId: int("userId").notNull(),
  auctionId: int("auctionId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  pk: index("watchlist_pk").on(table.userId, table.auctionId),
  userIdx: index("user_idx").on(table.userId),
  auctionIdx: index("auction_idx").on(table.auctionId),
}));

export type Watchlist = typeof watchlist.$inferSelect;
export type InsertWatchlist = typeof watchlist.$inferInsert;

/**
 * Notifications for users
 */
export const notifications = mysqlTable("notifications", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  contentEn: text("contentEn").notNull(),
  contentAr: text("contentAr").notNull(),
  linkUrl: varchar("linkUrl", { length: 500 }),
  isRead: boolean("isRead").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  userIdx: index("user_idx").on(table.userId),
  userReadIdx: index("user_read_idx").on(table.userId, table.isRead),
}));

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;
