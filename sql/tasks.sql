
DROP TABLE IF EXISTS `tm_tasks`;
CREATE TABLE `tm_tasks` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `owner_id` int(11) NOT NULL,
  `executor_id` int(11),
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `finish_time` timestamp,
  `subject` varchar(255) NOT NULL,
  `description` text,
  `report` text,
  `status` enum('pending','work','done') NOT NULL DEFAULT 'pending',
  PRIMARY KEY (`id`),
  KEY `owner_id` (`owner_id`),
  KEY `executor_id` (`executor_id`),
  CONSTRAINT `tm_tasks_fk_owner` FOREIGN KEY (`owner_id`) REFERENCES `tm_users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `tm_tasks_fk_executor` FOREIGN KEY (`executor_id`) REFERENCES `tm_users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

INSERT INTO `tm_tasks` (`owner_id`, `executor_id`, `subject`, `description`)
VALUES(1, 2, 'Первая задача', 'Выполнить тестовое задание');
