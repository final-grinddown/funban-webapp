# Build stage
FROM node:20-alpine AS builder
WORKDIR /app

# Enable corepack for Yarn 4
RUN corepack enable

# Install dependencies
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn ./.yarn
RUN yarn install --immutable

# Copy source code and build
COPY . .
RUN yarn build

# Production stage
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy necessary files from builder
COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Expose the port your app runs on
EXPOSE 3000

# Start the application
CMD ["node", "server.js"]