FROM node:20-alpine

WORKDIR /app

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["sh", "-c", "npm start -- --hostname 0.0.0.0 --port ${PORT:-3000}"]