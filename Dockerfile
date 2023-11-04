# FROM node:18-alpine
# # Install Chrome
# RUN apt-get update && apt-get install -y \
# 	apt-transport-https \
# 	ca-certificates \
# 	curl \
# 	gnupg \
# 	hicolor-icon-theme \
# 	libcanberra-gtk* \
# 	libgl1-mesa-dri \
# 	libgl1-mesa-glx \
# 	libpangox-1.0-0 \
# 	libpulse0 \
# 	libv4l-0 \
# 	fonts-symbola \
# 	--no-install-recommends \
# 	&& curl -sSL https://dl.google.com/linux/linux_signing_key.pub | apt-key add - \
# 	&& echo "deb [arch=amd64] https://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google.list \
# 	&& apt-get update && apt-get install -y \
# 	google-chrome-stable \
# 	--no-install-recommends \
# 	&& apt-get purge --auto-remove -y curl \
# 	&& rm -rf /var/lib/apt/lists/*

# WORKDIR /usr/src/app

# COPY package.json /usr/src/app/

# RUN npm install -g nodemon
# RUN npm install

# COPY . /usr/src/app

# RUN npm run build

# COPY .env .env

# EXPOSE 4004

# CMD [ "nodemon", "src/index.ts" ]

# Use an official Node.js runtime as the base image
FROM node:18-slim

# Install additional dependencies
RUN apt-get update -y && apt-get install -y \
    gconf-service \
    libasound2 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libc6 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libexpat1 \
    libfontconfig1 \
    libgcc1 \
    libgconf-2-4 \
    libgdk-pixbuf2.0-0 \
    libglib2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libstdc++6 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxtst6 \
    ca-certificates \
    fonts-liberation \
    libappindicator1 \
    libnss3 \
    lsb-release \
    xdg-utils \
    wget

RUN apt-get update && apt-get install -y chromium

# Set environment variables
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
ENV PUPPETEER_EXECUTABLE_PATH /usr/bin/chromium

# Create a working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json to the container
COPY package*.json ./

RUN npm install -g nodemon

# Install Node.js dependencies
RUN npm install

# Expose a port if needed (you can change the port as per your requirements)
EXPOSE 4004

# Copy your application code into the container
COPY . .

# Start your Node.js application
CMD [ "nodemon", "src/index.ts" ]