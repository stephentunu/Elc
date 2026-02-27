CREATE TABLE `admins` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`password` text NOT NULL,
	`name` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `admins_id` PRIMARY KEY(`id`),
	CONSTRAINT `admins_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `announcements` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` text NOT NULL,
	`content` text NOT NULL,
	`category` varchar(50) DEFAULT 'General',
	`priority` varchar(50) DEFAULT 'Normal',
	`isPublished` boolean DEFAULT true,
	`imageUrl` text,
	`postedBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `announcements_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `contributions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`memberId` int NOT NULL,
	`amount` decimal(10,2) NOT NULL,
	`paymentType` varchar(50) DEFAULT 'Subscription',
	`month` varchar(50) NOT NULL,
	`year` int NOT NULL,
	`status` varchar(50) DEFAULT 'Paid',
	`mpesaCode` varchar(100),
	`recordedBy` int,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `contributions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`eventDate` date NOT NULL,
	`eventTime` varchar(50),
	`venue` text,
	`category` varchar(50) DEFAULT 'Meeting',
	`imageUrl` text,
	`isPublished` boolean DEFAULT true,
	`createdBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `events_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `fundTransactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`type` enum('Income','Expense') NOT NULL,
	`amount` decimal(10,2) NOT NULL,
	`description` text NOT NULL,
	`category` varchar(100),
	`reference` varchar(100),
	`transactionDate` date,
	`balanceAfter` decimal(10,2),
	`recordedBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `fundTransactions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `gallery` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` text NOT NULL,
	`imageUrl` text NOT NULL,
	`caption` text,
	`eventId` int,
	`uploadedBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `gallery_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `meetingMinutes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` text NOT NULL,
	`meetingDate` date NOT NULL,
	`agenda` text,
	`minutesContent` text NOT NULL,
	`attendees` text,
	`decisions` text,
	`nextMeetingDate` date,
	`recordedBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `meetingMinutes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `members` (
	`id` int AUTO_INCREMENT NOT NULL,
	`membershipId` varchar(50) NOT NULL,
	`fullName` text NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(20),
	`studentId` varchar(50),
	`course` text,
	`yearOfStudy` int,
	`role` varchar(50) DEFAULT 'Member',
	`photoUrl` text,
	`status` varchar(50) DEFAULT 'Active',
	`joinedDate` date,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `members_id` PRIMARY KEY(`id`),
	CONSTRAINT `members_membershipId_unique` UNIQUE(`membershipId`),
	CONSTRAINT `members_email_unique` UNIQUE(`email`),
	CONSTRAINT `members_studentId_unique` UNIQUE(`studentId`)
);
--> statement-breakpoint
CREATE INDEX `idx_published` ON `announcements` (`isPublished`);--> statement-breakpoint
CREATE INDEX `idx_member_month_year` ON `contributions` (`memberId`,`month`,`year`);--> statement-breakpoint
CREATE INDEX `idx_event_date` ON `events` (`eventDate`);--> statement-breakpoint
CREATE INDEX `idx_type_date` ON `fundTransactions` (`type`,`transactionDate`);--> statement-breakpoint
CREATE INDEX `idx_status` ON `members` (`status`);