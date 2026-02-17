# -- Stage 1: Build the React App --
FROM node:20-alpine as build

WORKDIR /app

# Install dependencies first (Caching layer)
COPY package.json package-lock.json ./
RUN npm ci --silent

# Copy source and build
COPY . .
RUN npm run build

# -- Stage 2: Serve with Nginx --
FROM nginx:alpine

# Copy the build output from Stage 1 to Nginx html folder
COPY --from=build /app/build /usr/share/nginx/html
# Expose HTTP port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
