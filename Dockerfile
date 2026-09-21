# -----------------------------------------------------------
# Stage 1: Build dependencies and compile application
# -----------------------------------------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Install build dependencies
COPY package.json package-lock.json* ./
RUN npm ci

# Copy source code and build config
COPY . .

# Build Vite client assets and compile Express server to dist/server.cjs
RUN npm run build

# -----------------------------------------------------------
# Stage 2: Minimal production runtime container
# -----------------------------------------------------------
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Install only production runtime dependencies
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy compiled distribution artifacts from builder stage
COPY --from=builder /app/dist ./dist

# Run as non-root user for security
USER node

# Expose internal port
EXPOSE 3000

# Built-in container healthcheck using Alpine wget
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:3000/api/health || exit 1

# Launch the compiled CommonJS server
CMD ["node", "dist/server.cjs"]
