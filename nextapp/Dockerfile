FROM node:16
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn

COPY . /usr/src/app
EXPOSE 3000
CMD ["yarn", "dev"]
