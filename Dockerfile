# Get the nginx stable alpine image from Docker Hub
FROM nginx:stable-alpine

# Copy the nginx config
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d

# Set the current work directory in the image
WORKDIR /usr/share/nginx/html/

# Copy the /build folder into the current work directory
COPY /build ./

# Execute nginx command
# '-g daemon off;' will ensure NGINX stays at the foreground for Docker to track properly
ENTRYPOINT ["nginx", "-g", "daemon off;"]