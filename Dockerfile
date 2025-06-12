FROM node:19-alpine

RUN apk update && apk add --no-cache curl file && rm -rf /var/lib/apt/lists/*

WORKDIR /src

COPY package*.json .

RUN npm ci

COPY . .

RUN ["npm", "run", "client-postbuild"]

EXPOSE 8080

CMD ["npm", "run", "start"]