FROM node:19-alpine

RUN apk update && apk add --no-cache curl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

RUN npm run build

RUN npm install -g serve

EXPOSE 3000

CMD ["serve", "-s", "build"]