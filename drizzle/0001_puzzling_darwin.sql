CREATE TABLE `auctionImages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`auctionId` int NOT NULL,
	`imageUrl` varchar(1000) NOT NULL,
	`fileKey` varchar(500) NOT NULL,
	`altTextEn` varchar(255),
	`altTextAr` varchar(255),
	`displayOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `auctionImages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `auctions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sellerId` int NOT NULL,
	`titleEn` varchar(500) NOT NULL,
	`titleAr` varchar(500) NOT NULL,
	`descriptionEn` text NOT NULL,
	`descriptionAr` text NOT NULL,
	`itemConditionEn` text,
	`itemConditionAr` text,
	`categoryId` int NOT NULL,
	`locationId` int NOT NULL,
	`status` enum('draft','pending_approval','active','ended_no_bids','ended_sold','ended_not_sold','cancelled') NOT NULL DEFAULT 'draft',
	`startTime` timestamp NOT NULL,
	`endTime` timestamp NOT NULL,
	`startingPrice` int NOT NULL,
	`currentPrice` int NOT NULL,
	`reservePrice` int,
	`bidIncrement` int NOT NULL DEFAULT 100,
	`winningBidId` int,
	`viewCount` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `auctions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `bids` (
	`id` int AUTO_INCREMENT NOT NULL,
	`auctionId` int NOT NULL,
	`bidderId` int NOT NULL,
	`bidAmount` int NOT NULL,
	`isAutoBid` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `bids_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `categories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nameEn` varchar(255) NOT NULL,
	`nameAr` varchar(255) NOT NULL,
	`slugEn` varchar(255) NOT NULL,
	`slugAr` varchar(255) NOT NULL,
	`parentCategoryId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `categories_id` PRIMARY KEY(`id`),
	CONSTRAINT `categories_slugEn_unique` UNIQUE(`slugEn`),
	CONSTRAINT `categories_slugAr_unique` UNIQUE(`slugAr`)
);
--> statement-breakpoint
CREATE TABLE `locations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`city` varchar(100) NOT NULL,
	`country` varchar(100) NOT NULL,
	`latitude` varchar(20),
	`longitude` varchar(20),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `locations_id` PRIMARY KEY(`id`),
	CONSTRAINT `city_country_idx` UNIQUE(`city`,`country`)
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`contentEn` text NOT NULL,
	`contentAr` text NOT NULL,
	`linkUrl` varchar(500),
	`isRead` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `watchlist` (
	`userId` int NOT NULL,
	`auctionId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now())
);
--> statement-breakpoint
ALTER TABLE `users` ADD `userType` enum('buyer','seller','both') DEFAULT 'buyer' NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `phoneNumber` varchar(20);--> statement-breakpoint
ALTER TABLE `users` ADD `addressLine1` text;--> statement-breakpoint
ALTER TABLE `users` ADD `addressLine2` text;--> statement-breakpoint
ALTER TABLE `users` ADD `city` varchar(100);--> statement-breakpoint
ALTER TABLE `users` ADD `postalCode` varchar(20);--> statement-breakpoint
ALTER TABLE `users` ADD `country` varchar(100);--> statement-breakpoint
ALTER TABLE `users` ADD `isEmailVerified` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `isPhoneVerified` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `status` enum('active','suspended','pending_verification') DEFAULT 'active' NOT NULL;--> statement-breakpoint
CREATE INDEX `auction_idx` ON `auctionImages` (`auctionId`);--> statement-breakpoint
CREATE INDEX `seller_idx` ON `auctions` (`sellerId`);--> statement-breakpoint
CREATE INDEX `category_idx` ON `auctions` (`categoryId`);--> statement-breakpoint
CREATE INDEX `location_idx` ON `auctions` (`locationId`);--> statement-breakpoint
CREATE INDEX `status_idx` ON `auctions` (`status`);--> statement-breakpoint
CREATE INDEX `end_time_idx` ON `auctions` (`endTime`);--> statement-breakpoint
CREATE INDEX `auction_idx` ON `bids` (`auctionId`);--> statement-breakpoint
CREATE INDEX `bidder_idx` ON `bids` (`bidderId`);--> statement-breakpoint
CREATE INDEX `auction_time_idx` ON `bids` (`auctionId`,`createdAt`);--> statement-breakpoint
CREATE INDEX `user_idx` ON `notifications` (`userId`);--> statement-breakpoint
CREATE INDEX `user_read_idx` ON `notifications` (`userId`,`isRead`);--> statement-breakpoint
CREATE INDEX `watchlist_pk` ON `watchlist` (`userId`,`auctionId`);--> statement-breakpoint
CREATE INDEX `user_idx` ON `watchlist` (`userId`);--> statement-breakpoint
CREATE INDEX `auction_idx` ON `watchlist` (`auctionId`);--> statement-breakpoint
CREATE INDEX `email_idx` ON `users` (`email`);--> statement-breakpoint
CREATE INDEX `phone_idx` ON `users` (`phoneNumber`);