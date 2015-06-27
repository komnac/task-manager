
DROP TABLE IF EXISTS `tm_users`;
CREATE TABLE `tm_users` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `login` VARCHAR (255) NOT NULL,
  `email` VARCHAR (255) DEFAULT '',
  `name` VARCHAR (255) DEFAULT '',
  `password` VARCHAR (100) DEFAULT '',
  PRIMARY KEY (`id`),
  UNIQUE KEY (`login`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;

INSERT INTO tm_users VALUES (NULL, 'admin', '', 'Admin', MD5(MD5('123')));
INSERT INTO tm_users VALUES (NULL, 'kirill', '', 'Kirill Komlev', MD5(MD5('111')));
