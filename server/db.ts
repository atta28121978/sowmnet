import { eq, desc, and, gte, lte, inArray, sql, or } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, 
  users, 
  categories,
  locations,
  auctions,
  bids,
  auctionImages,
  watchlist,
  notifications,
  InsertCategory,
  InsertLocation,
  InsertAuction,
  InsertBid,
  InsertAuctionImage,
  InsertWatchlist,
  InsertNotification,
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ============ USER OPERATIONS ============

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateUserProfile(userId: number, data: Partial<InsertUser>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(users).set(data).where(eq(users.id, userId));
}

export async function getAllUsers() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(users).orderBy(desc(users.createdAt));
}

// ============ CATEGORY OPERATIONS ============

export async function createCategory(category: InsertCategory) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(categories).values(category);
  return result;
}

export async function getAllCategories() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(categories).orderBy(categories.nameEn);
}

export async function getCategoryById(categoryId: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(categories).where(eq(categories.id, categoryId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ============ LOCATION OPERATIONS ============

export async function createLocation(location: InsertLocation) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(locations).values(location);
  return result;
}

export async function getAllLocations() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(locations).orderBy(locations.city);
}

export async function getLocationById(locationId: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(locations).where(eq(locations.id, locationId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ============ AUCTION OPERATIONS ============

export async function createAuction(auction: InsertAuction) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(auctions).values(auction);
  return result;
}

export async function getAuctionById(auctionId: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(auctions).where(eq(auctions.id, auctionId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getActiveAuctions() {
  const db = await getDb();
  if (!db) return [];
  
  const now = new Date();
  return await db.select()
    .from(auctions)
    .where(
      and(
        eq(auctions.status, 'active'),
        lte(auctions.startTime, now),
        gte(auctions.endTime, now)
      )
    )
    .orderBy(auctions.endTime);
}

export async function getAuctionsByStatus(status: string) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select()
    .from(auctions)
    .where(eq(auctions.status, status as any))
    .orderBy(desc(auctions.createdAt));
}

export async function getAuctionsBySeller(sellerId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select()
    .from(auctions)
    .where(eq(auctions.sellerId, sellerId))
    .orderBy(desc(auctions.createdAt));
}

export async function updateAuction(auctionId: number, data: Partial<InsertAuction>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(auctions).set(data).where(eq(auctions.id, auctionId));
}

export async function incrementAuctionViews(auctionId: number) {
  const db = await getDb();
  if (!db) return;
  
  await db.update(auctions)
    .set({ viewCount: sql`${auctions.viewCount} + 1` })
    .where(eq(auctions.id, auctionId));
}

export async function searchAuctions(filters: {
  categoryId?: number;
  locationId?: number;
  status?: string;
  minPrice?: number;
  maxPrice?: number;
}) {
  const db = await getDb();
  if (!db) return [];
  
  const conditions = [];
  
  if (filters.categoryId) {
    conditions.push(eq(auctions.categoryId, filters.categoryId));
  }
  if (filters.locationId) {
    conditions.push(eq(auctions.locationId, filters.locationId));
  }
  if (filters.status) {
    conditions.push(eq(auctions.status, filters.status as any));
  }
  if (filters.minPrice !== undefined) {
    conditions.push(gte(auctions.currentPrice, filters.minPrice));
  }
  if (filters.maxPrice !== undefined) {
    conditions.push(lte(auctions.currentPrice, filters.maxPrice));
  }
  
  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
  
  return await db.select()
    .from(auctions)
    .where(whereClause)
    .orderBy(desc(auctions.createdAt));
}

// ============ BID OPERATIONS ============

export async function createBid(bid: InsertBid) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(bids).values(bid);
  return result;
}

export async function getBidsByAuction(auctionId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select()
    .from(bids)
    .where(eq(bids.auctionId, auctionId))
    .orderBy(desc(bids.createdAt));
}

export async function getBidsByBidder(bidderId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select()
    .from(bids)
    .where(eq(bids.bidderId, bidderId))
    .orderBy(desc(bids.createdAt));
}

export async function getHighestBid(auctionId: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select()
    .from(bids)
    .where(eq(bids.auctionId, auctionId))
    .orderBy(desc(bids.bidAmount), desc(bids.createdAt))
    .limit(1);
  
  return result.length > 0 ? result[0] : undefined;
}

// ============ AUCTION IMAGE OPERATIONS ============

export async function createAuctionImage(image: InsertAuctionImage) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(auctionImages).values(image);
  return result;
}

export async function getAuctionImages(auctionId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select()
    .from(auctionImages)
    .where(eq(auctionImages.auctionId, auctionId))
    .orderBy(auctionImages.displayOrder);
}

export async function deleteAuctionImage(imageId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(auctionImages).where(eq(auctionImages.id, imageId));
}

// ============ WATCHLIST OPERATIONS ============

export async function addToWatchlist(userId: number, auctionId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(watchlist).values({ userId, auctionId });
}

export async function removeFromWatchlist(userId: number, auctionId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(watchlist)
    .where(and(
      eq(watchlist.userId, userId),
      eq(watchlist.auctionId, auctionId)
    ));
}

export async function getUserWatchlist(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select()
    .from(watchlist)
    .where(eq(watchlist.userId, userId))
    .orderBy(desc(watchlist.createdAt));
}

export async function isInWatchlist(userId: number, auctionId: number) {
  const db = await getDb();
  if (!db) return false;
  
  const result = await db.select()
    .from(watchlist)
    .where(and(
      eq(watchlist.userId, userId),
      eq(watchlist.auctionId, auctionId)
    ))
    .limit(1);
  
  return result.length > 0;
}

// ============ NOTIFICATION OPERATIONS ============

export async function createNotification(notification: InsertNotification) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(notifications).values(notification);
  return result;
}

export async function getUserNotifications(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select()
    .from(notifications)
    .where(eq(notifications.userId, userId))
    .orderBy(desc(notifications.createdAt));
}

export async function markNotificationAsRead(notificationId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(notifications)
    .set({ isRead: true })
    .where(eq(notifications.id, notificationId));
}

export async function getUnreadNotificationCount(userId: number) {
  const db = await getDb();
  if (!db) return 0;
  
  const result = await db.select({ count: sql<number>`count(*)` })
    .from(notifications)
    .where(and(
      eq(notifications.userId, userId),
      eq(notifications.isRead, false)
    ));
  
  return result[0]?.count || 0;
}
