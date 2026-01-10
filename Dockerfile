# Development image
FROM node:22-alpine AS development
WORKDIR /var/www/html
COPY package*.json ./
COPY . .
EXPOSE 5173

# Build stage
FROM development AS build
#RUN npm ci --only=production
RUN npm run build

# Production stage
FROM nginx:1.29-alpine AS production

ENV NODE_ENV production

COPY --from=build /var/www/html/dist /usr/share/nginx/html
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]