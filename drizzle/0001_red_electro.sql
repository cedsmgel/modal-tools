ALTER TABLE `users` ADD `plan` text DEFAULT 'FREE' NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `stripe_customer_id` text;