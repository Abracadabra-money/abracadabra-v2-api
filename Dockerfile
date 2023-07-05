FROM node:18 as builder
WORKDIR /app
COPY . .
RUN yarn install --frozen-lockfile
RUN yarn build

FROM node:18
WORKDIR /app
COPY --from=builder /app/dist /app/dist
COPY package.json .
COPY yarn.lock .
RUN yarn install --production=true --frozen-lockfile

EXPOSE 8000

CMD ["yarn", "start:prod"]