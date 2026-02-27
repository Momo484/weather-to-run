# 1. Use an official Ubuntu Linux image as the base
FROM ubuntu:22.04

# 2. Avoid user interaction prompts during installation
ENV DEBIAN_FRONTEND=noninteractive

# 3. Install C++ compiler, CMake, OpenSSL, and ASIO
RUN apt-get update && apt-get install -y \
    g++ \
    cmake \
    make \
    libssl-dev \
    libasio-dev \
    && rm -rf /var/lib/apt/lists/*

# 4. Create a working directory inside the container
WORKDIR /app

# 5. Copy your project files into the container
COPY . .

# 6. Build the project from scratch in Linux
RUN mkdir -p build && cd build && cmake .. && make

# 7. Expose the port Crow is running on
EXPOSE 8080

# 8. Start the engine
CMD ["./build/weather_engine"]