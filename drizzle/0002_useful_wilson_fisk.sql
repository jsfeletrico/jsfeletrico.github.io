CREATE TABLE `simAccessRequests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nome` varchar(160) NOT NULL,
	`email` varchar(320) NOT NULL,
	`mensagem` text,
	`status` enum('pendente','aprovada','dispensada') NOT NULL DEFAULT 'pendente',
	`ip` varchar(64),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `simAccessRequests_id` PRIMARY KEY(`id`)
);
