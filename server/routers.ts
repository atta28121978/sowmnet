import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { TRPCError } from "@trpc/server";
import { storagePut } from "./storage";

// Admin-only procedure
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
  }
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  user: router({
    // Get user profile
    getProfile: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserById(ctx.user.id);
    }),
    
    // Update user profile
    updateProfile: protectedProcedure
      .input(z.object({
        name: z.string().optional(),
        phoneNumber: z.string().optional(),
        addressLine1: z.string().optional(),
        addressLine2: z.string().optional(),
        city: z.string().optional(),
        postalCode: z.string().optional(),
        country: z.string().optional(),
        userType: z.enum(["buyer", "seller", "both"]).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.updateUserProfile(ctx.user.id, input);
        return { success: true };
      }),
    
    // Get all users (admin only)
    getAllUsers: adminProcedure.query(async () => {
      return await db.getAllUsers();
    }),
    
    // Update user status (admin only)
    updateUserStatus: adminProcedure
      .input(z.object({
        userId: z.number(),
        status: z.enum(["active", "suspended", "pending_verification"]),
      }))
      .mutation(async ({ input }) => {
        await db.updateUserProfile(input.userId, { status: input.status });
        return { success: true };
      }),
  }),

  category: router({
    // Get all categories
    getAll: publicProcedure.query(async () => {
      return await db.getAllCategories();
    }),
    
    // Get category by ID
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getCategoryById(input.id);
      }),
    
    // Create category (admin only)
    create: adminProcedure
      .input(z.object({
        nameEn: z.string(),
        nameAr: z.string(),
        slugEn: z.string(),
        slugAr: z.string(),
        parentCategoryId: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        await db.createCategory(input);
        return { success: true };
      }),
  }),

  location: router({
    // Get all locations
    getAll: publicProcedure.query(async () => {
      return await db.getAllLocations();
    }),
    
    // Create location (admin only)
    create: adminProcedure
      .input(z.object({
        city: z.string(),
        country: z.string(),
        latitude: z.string().optional(),
        longitude: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        await db.createLocation(input);
        return { success: true };
      }),
  }),

  auction: router({
    // Get active auctions
    getActive: publicProcedure.query(async () => {
      return await db.getActiveAuctions();
    }),
    
    // Get auction by ID
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const auction = await db.getAuctionById(input.id);
        if (!auction) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Auction not found' });
        }
        
        // Increment view count
        await db.incrementAuctionViews(input.id);
        
        // Get images
        const images = await db.getAuctionImages(input.id);
        
        // Get bids
        const bids = await db.getBidsByAuction(input.id);
        
        return { auction, images, bids };
      }),
    
    // Search auctions
    search: publicProcedure
      .input(z.object({
        categoryId: z.number().optional(),
        locationId: z.number().optional(),
        status: z.string().optional(),
        minPrice: z.number().optional(),
        maxPrice: z.number().optional(),
      }))
      .query(async ({ input }) => {
        return await db.searchAuctions(input);
      }),
    
    // Get auctions by status (admin)
    getByStatus: adminProcedure
      .input(z.object({ status: z.string() }))
      .query(async ({ input }) => {
        return await db.getAuctionsByStatus(input.status);
      }),
    
    // Get my auctions (seller)
    getMy: protectedProcedure.query(async ({ ctx }) => {
      return await db.getAuctionsBySeller(ctx.user.id);
    }),
    
    // Create auction
    create: protectedProcedure
      .input(z.object({
        titleEn: z.string(),
        titleAr: z.string(),
        descriptionEn: z.string(),
        descriptionAr: z.string(),
        itemConditionEn: z.string().optional(),
        itemConditionAr: z.string().optional(),
        categoryId: z.number(),
        locationId: z.number(),
        startTime: z.date(),
        endTime: z.date(),
        startingPrice: z.number(),
        reservePrice: z.number().optional(),
        bidIncrement: z.number().default(100),
      }))
      .mutation(async ({ ctx, input }) => {
        const result = await db.createAuction({
          ...input,
          sellerId: ctx.user.id,
          currentPrice: input.startingPrice,
          status: 'pending_approval',
        });
        return { success: true, auctionId: result[0].insertId };
      }),
    
    // Update auction status (admin)
    updateStatus: adminProcedure
      .input(z.object({
        auctionId: z.number(),
        status: z.enum(['draft', 'pending_approval', 'active', 'ended_no_bids', 'ended_sold', 'ended_not_sold', 'cancelled']),
      }))
      .mutation(async ({ input }) => {
        await db.updateAuction(input.auctionId, { status: input.status });
        return { success: true };
      }),
    
    // Upload auction image
    uploadImage: protectedProcedure
      .input(z.object({
        auctionId: z.number(),
        imageData: z.string(), // base64
        fileName: z.string(),
        altTextEn: z.string().optional(),
        altTextAr: z.string().optional(),
        displayOrder: z.number().default(0),
      }))
      .mutation(async ({ input }) => {
        // Decode base64
        const buffer = Buffer.from(input.imageData.split(',')[1], 'base64');
        
        // Generate unique file key
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(7);
        const fileKey = `auctions/${input.auctionId}/${timestamp}-${random}-${input.fileName}`;
        
        // Upload to S3
        const { url } = await storagePut(fileKey, buffer, 'image/jpeg');
        
        // Save to database
        await db.createAuctionImage({
          auctionId: input.auctionId,
          imageUrl: url,
          fileKey,
          altTextEn: input.altTextEn,
          altTextAr: input.altTextAr,
          displayOrder: input.displayOrder,
        });
        
        return { success: true, url };
      }),
  }),

  bid: router({
    // Place a bid
    place: protectedProcedure
      .input(z.object({
        auctionId: z.number(),
        bidAmount: z.number(),
      }))
      .mutation(async ({ ctx, input }) => {
        // Get auction
        const auction = await db.getAuctionById(input.auctionId);
        if (!auction) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Auction not found' });
        }
        
        // Check if auction is active
        if (auction.status !== 'active') {
          throw new TRPCError({ code: 'BAD_REQUEST', message: 'Auction is not active' });
        }
        
        // Check if auction has ended
        if (new Date() > auction.endTime) {
          throw new TRPCError({ code: 'BAD_REQUEST', message: 'Auction has ended' });
        }
        
        // Check if bid is higher than current price + increment
        if (input.bidAmount < auction.currentPrice + auction.bidIncrement) {
          throw new TRPCError({ 
            code: 'BAD_REQUEST', 
            message: `Bid must be at least ${auction.currentPrice + auction.bidIncrement} cents` 
          });
        }
        
        // Create bid
        await db.createBid({
          auctionId: input.auctionId,
          bidderId: ctx.user.id,
          bidAmount: input.bidAmount,
          isAutoBid: false,
        });
        
        // Update auction current price
        await db.updateAuction(input.auctionId, { currentPrice: input.bidAmount });
        
        return { success: true };
      }),
    
    // Get my bids
    getMy: protectedProcedure.query(async ({ ctx }) => {
      return await db.getBidsByBidder(ctx.user.id);
    }),
    
    // Get bids for an auction
    getByAuction: publicProcedure
      .input(z.object({ auctionId: z.number() }))
      .query(async ({ input }) => {
        return await db.getBidsByAuction(input.auctionId);
      }),
  }),

  watchlist: router({
    // Add to watchlist
    add: protectedProcedure
      .input(z.object({ auctionId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await db.addToWatchlist(ctx.user.id, input.auctionId);
        return { success: true };
      }),
    
    // Remove from watchlist
    remove: protectedProcedure
      .input(z.object({ auctionId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await db.removeFromWatchlist(ctx.user.id, input.auctionId);
        return { success: true };
      }),
    
    // Get my watchlist
    getMy: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserWatchlist(ctx.user.id);
    }),
    
    // Check if in watchlist
    isInWatchlist: protectedProcedure
      .input(z.object({ auctionId: z.number() }))
      .query(async ({ ctx, input }) => {
        return await db.isInWatchlist(ctx.user.id, input.auctionId);
      }),
  }),

  notification: router({
    // Get my notifications
    getMy: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserNotifications(ctx.user.id);
    }),
    
    // Mark as read
    markAsRead: protectedProcedure
      .input(z.object({ notificationId: z.number() }))
      .mutation(async ({ input }) => {
        await db.markNotificationAsRead(input.notificationId);
        return { success: true };
      }),
    
    // Get unread count
    getUnreadCount: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUnreadNotificationCount(ctx.user.id);
    }),
  }),
});

export type AppRouter = typeof appRouter;
