# Get the nginx stable alpine image from Docker Hub
FROM nginx:stable-alpine

# Set the current work directory in the image
WORKDIR /usr/share/nginx/html/

# Copy the /build folder into the current work directory
COPY /build ./

# Execute nginx command
# '-g daemon off;' will ensure NGINX stays at the foreground for Docker to track properly
ENTRYPOINT ["nginx", "-g", "daemon off;"]