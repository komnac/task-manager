## Менеджер задач

Тестовое задание для easywk.ru

### Установка 

Склонируйте репозиторий

```
git clone https://github.com/komnac/task-manager
cd js/extjs
git checkout
```

Установите composer (см. https://getcomposer.org/download/)

```
cd php
composer install
cd ...
```

Установите nodejs (см. https://nodejs.org/)

```
cd js
npm install
npm install -g grunt-cli
grunt
```

Создаем БД
```
CREATE DATABASE tm;
GRANT ALL PRIVILEGES ON tm.* TO tm@localhost IDENTIFIED BY 'tm_pw';
FLUSH PRIVILEGES;
```

Подправим файл `php/conf/database.php` указав созданного пользователя, имя БД и узел СУБД.

Выполняем `sql/users.sql` и `sql/tasks.sql` для созданной БД

Запускаем веб-сервер `php -S localhost:4000`.

Заходим под пользователем `admin` и паролем `123`.
