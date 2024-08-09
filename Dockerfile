# Use a Node.js official image as a parent image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port your Node.js app runs on
EXPOSE 3000

# Command to run your application
CMD ["node", "index.js"]