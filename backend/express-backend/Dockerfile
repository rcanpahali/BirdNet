FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json tsconfig.json ./
RUN npm install

# Copy source code
COPY src ./src

# Build TypeScript
RUN npm run build

EXPOSE 8080

CMD ["npm", "run", "start"]
