CREATE TABLE `admins` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL,
	`name` text NOT NULL,
	`createdAt` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `admins_email_unique` ON `admins` (`email`);--> statement-breakpoint
CREATE TABLE `announcements` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`content` text NOT NULL,
	`category` text DEFAULT 'General',
	`priority` text DEFAULT 'Normal',
	`isPublished` integer DEFAULT true,
	`imageUrl` text,
	`postedBy` integer,
	`createdAt` text DEFAULT (datetime('now')) NOT NULL,
	`updatedAt` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_published` ON `announcements` (`isPublished`);--> statement-breakpoint
CREATE TABLE `contributions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`memberId` integer NOT NULL,
	`amount` real NOT NULL,
	`paymentType` text DEFAULT 'Subscription',
	`month` text NOT NULL,
	`year` integer NOT NULL,
	`status` text DEFAULT 'Paid',
	`mpesaCode` text,
	`recordedBy` integer,
	`notes` text,
	`createdAt` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_member_month_year` ON `contributions` (`memberId`,`month`,`year`);--> statement-breakpoint
CREATE TABLE `events` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`eventDate` text NOT NULL,
	`eventTime` text,
	`venue` text,
	`category` text DEFAULT 'Meeting',
	`imageUrl` text,
	`isPublished` integer DEFAULT true,
	`createdBy` integer,
	`createdAt` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_event_date` ON `events` (`eventDate`);--> statement-breakpoint
CREATE TABLE `fundTransactions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`type` text NOT NULL,
	`amount` real NOT NULL,
	`description` text NOT NULL,
	`category` text,
	`reference` text,
	`transactionDate` text,
	`balanceAfter` real,
	`recordedBy` integer,
	`createdAt` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_type_date` ON `fundTransactions` (`type`,`transactionDate`);--> statement-breakpoint
CREATE TABLE `gallery` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`imageUrl` text NOT NULL,
	`caption` text,
	`eventId` integer,
	`uploadedBy` integer,
	`createdAt` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `meetingMinutes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`meetingDate` text NOT NULL,
	`agenda` text,
	`minutesContent` text NOT NULL,
	`attendees` text,
	`decisions` text,
	`nextMeetingDate` text,
	`recordedBy` integer,
	`createdAt` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `members` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`membershipId` text NOT NULL,
	`fullName` text NOT NULL,
	`email` text NOT NULL,
	`phone` text,
	`studentId` text,
	`course` text,
	`yearOfStudy` integer,
	`role` text DEFAULT 'Member',
	`photoUrl` text,
	`status` text DEFAULT 'Active',
	`joinedDate` text,
	`createdAt` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `members_membershipId_unique` ON `members` (`membershipId`);--> statement-breakpoint
CREATE UNIQUE INDEX `members_email_unique` ON `members` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `members_studentId_unique` ON `members` (`studentId`);--> statement-breakpoint
CREATE INDEX `idx_status` ON `members` (`status`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`openId` text NOT NULL,
	`name` text,
	`email` text,
	`loginMethod` text,
	`role` text DEFAULT 'user' NOT NULL,
	`createdAt` text DEFAULT (datetime('now')) NOT NULL,
	`updatedAt` text DEFAULT (datetime('now')) NOT NULL,
	`lastSignedIn` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_openId_unique` ON `users` (`openId`);