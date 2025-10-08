FROM node:18-alpine

WORKDIR /app

# Install dependencies only when needed
COPY package*.json ./

RUN npm install

# Copy source code
COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
