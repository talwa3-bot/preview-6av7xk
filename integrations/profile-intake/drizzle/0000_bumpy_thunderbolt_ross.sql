CREATE TABLE `profiles` (
	`id` text PRIMARY KEY NOT NULL,
	`person` text NOT NULL,
	`payload` text NOT NULL,
	`published` integer DEFAULT 0 NOT NULL,
	`created_at` text NOT NULL
);
