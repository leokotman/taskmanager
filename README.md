# README

This README would normally document whatever steps are necessary to get the
application up and running.

Things you may want to cover:

- Ruby version

- System dependencies

- Configuration

- Database creation

- Database initialization

- How to run the test suite

- Services (job queues, cache servers, search engines, etc.)

- Deployment instructions

- ...

1. Собрать контейнер:
   docker-compose build
2. Установка гемов:
   docker-compose run --rm web bash -c "bundle install"
3. Интерактивная баш сессия внутри контейнера
   docker-compose run --rm --service-ports web /bin/bash
4. установить все гемы и пакеты
   bundle install,
   yarn install
5. Запустить сетап базы:
   docker-compose run --rm web bash -c "rails db:create db:migrate"
6. Запустить проект
   docker-compose up

Запустить интерактивную bash сессию
docker-compose run web bash
