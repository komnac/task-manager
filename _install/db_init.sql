
DROP TABLE IF EXISTS `tm_users`;
CREATE TABLE `tm_users` (
  `login` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT '',
  `name` varchar(255) NOT NULL,
  `password` varchar(100) NOT NULL,
  `is_admin` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`login`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
