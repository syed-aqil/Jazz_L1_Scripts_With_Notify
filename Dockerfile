# Use official Playwright image with all dependencies
FROM mcr.microsoft.com/playwright:focal

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Install Playwright browsers
RUN npx playwright install --with-deps

# Create necessary directories
RUN mkdir -p test-results allure-results playwright-report

# Set environment variables
ENV CI=true
ENV NODE_ENV=test

# Default command
CMD ["npx", "playwright", "test"]