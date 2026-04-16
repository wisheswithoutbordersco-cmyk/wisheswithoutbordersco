CREATE TABLE `orders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`stripeSessionId` varchar(255) NOT NULL,
	`customerEmail` varchar(320),
	`productId` varchar(100) NOT NULL,
	`productName` varchar(255) NOT NULL,
	`amountCents` int NOT NULL,
	`status` enum('pending','paid','failed') NOT NULL DEFAULT 'pending',
	`canvaLink` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `orders_id` PRIMARY KEY(`id`),
	CONSTRAINT `orders_stripeSessionId_unique` UNIQUE(`stripeSessionId`)
);
