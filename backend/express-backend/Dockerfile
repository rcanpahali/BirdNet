FROM node:20-alpine

WORKDIR /app

# Install build dependencies required by better-sqlite3
RUN apk add --no-cache python3 make g++

# Install dependencies
COPY package*.json tsconfig.json ./
RUN npm install

# Copy source code
COPY src ./src

# Ensure database directory exists (also persisted via volume)
RUN mkdir -p /app/data

# Build TypeScript
RUN npm run build

EXPOSE 8080

CMD ["npm", "run", "start"]
