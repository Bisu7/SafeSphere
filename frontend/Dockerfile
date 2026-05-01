# Stage 1: Build the React application
FROM node:18-alpine AS build

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy application code and build
COPY . .
RUN npm run build

# Stage 2: Serve the application using Nginx
FROM nginx:stable-alpine

# Copy the build output to the Nginx html directory
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
