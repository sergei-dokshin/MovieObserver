# Часть 1: инструкции для клиентской части
FROM node:22 AS client

# создаем рабочую папку
WORKDIR /app/client
# копируем файл package.json с клиентской части в рабочую папку
COPY client/package.json /app/client/
# запускаем команду для установки зависимостей
RUN npm install
# копируем всё содержимое папки client в рабочую папку
COPY client /app/client/
# запускаем команду для сборки приложения(React)
RUN npm run build

# Часть 2: инструкции для серверной части
FROM node:alpine AS server

# создаем рабочую папку
WORKDIR /app
# копируем файл package.json с серверной части в рабочую папку
COPY server/package.json /app
# запускаем команду для установки зависимостей
RUN npm install
# копируем всё содержимое папки server в рабочую папку
COPY server /app
# копируем содержимое папки dist из клиентской рабочей папки в папку client, которую создаем в серверной рабочей папке. Слово client в "--from=client" служит ссылкой на ключевое слово из "FROM node:22 AS client"
COPY --from=client /app/client/dist /app/client
# указываем номер порта
EXPOSE 8080
# запускаем сервер
CMD [ "npm", "start" ]