CREATE TABLE `social_posts` (
  `id` int AUTO_INCREMENT NOT NULL,
  `platform` enum('pinterest','instagram') NOT NULL,
  `product_id` varchar(255) NOT NULL,
  `external_post_id` varchar(255),
  `external_url` text,
  `status` enum('queued','posted','failed') NOT NULL DEFAULT 'queued',
  `error_message` text,
  `posted_at` timestamp,
  `created_at` timestamp NOT NULL DEFAULT (now()),
  CONSTRAINT `social_posts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `idx_social_posts_platform_status` ON `social_posts` (`platform`,`status`);
--> statement-breakpoint
CREATE INDEX `idx_social_posts_product` ON `social_posts` (`product_id`,`platform`);
