
DROP TABLE IF EXISTS `tm_tasks`;
CREATE TABLE `tm_tasks` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `owner_id` INT(11) NOT NULL,
  `executor_id` INT(11),
  `create_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `subject` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `report` TEXT,
  `status` ENUM('Создана', 'В работе', 'Отчет', 'Завершена') NOT NULL DEFAULT 'Создана',
  PRIMARY KEY (`id`),
  KEY `owner_id` (`owner_id`),
  KEY `executor_id` (`executor_id`),
  CONSTRAINT `tm_tasks_fk_owner` FOREIGN KEY (`owner_id`) REFERENCES `tm_users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `tm_tasks_fk_executor` FOREIGN KEY (`executor_id`) REFERENCES `tm_users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

INSERT INTO `tm_tasks` (`owner_id`, `executor_id`, `subject`, `description`)
VALUES (1, 2, 'Первая задача', 'Выполнить тестовое задание. Постараться написать управление задачами');
