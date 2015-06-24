
DROP TABLE IF EXISTS `tm_users`;
CREATE TABLE `tm_users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `login` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT '',
  `name` varchar(255) DEFAULT '',
  `password` varchar(100) DEFAULT '',
  PRIMARY KEY (`id`),
  UNIQUE KEY (`login`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;

INSERT INTO tm_users VALUES (NULL, 'admin', '', 'Admin', MD5(MD5('123')));
