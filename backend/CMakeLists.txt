cmake_minimum_required(VERSION 3.10)

# Project Name
project(WeatherToRun)

# Ensure we use C++17 (Required by modern JSON and Crow)
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED True)

# --- DEPENDENCIES ---

# 1. Locate OpenSSL installed via Homebrew (Apple Silicon path)
set(OPENSSL_ROOT_DIR /opt/homebrew/opt/openssl)
find_package(OpenSSL REQUIRED)

# 2. Locate Threads (Required by Crow to handle multiple web requests at once)
find_package(Threads REQUIRED)


# --- BUILD INSTRUCTIONS ---

# 3. Define the executable and its source files
add_executable(weather_engine 
    main.cpp 
    WeatherEngine.cpp
)

# 4. Tell the compiler where to find all the header files (.h / .hpp)
# Tell the compiler where to find headers
if(APPLE)
    # Mac Settings
    target_include_directories(weather_engine PRIVATE 
        include 
        ${OPENSSL_INCLUDE_DIR}
        /opt/homebrew/include 
    )
else()
    # Linux/Cloud Settings
    target_include_directories(weather_engine PRIVATE 
        include 
        ${OPENSSL_INCLUDE_DIR}
    )
endif()
# 5. Link the necessary C++ libraries to your executable
target_link_libraries(weather_engine PRIVATE 
    OpenSSL::SSL 
    OpenSSL::Crypto
    Threads::Threads         # Links the threading library for Crow
)

# 6. Link macOS-specific Security frameworks (Needed for HTTPS requests on Mac)
if(APPLE)
    find_library(COREFOUNDATION_LIBRARY CoreFoundation)
    find_library(SECURITY_LIBRARY Security)
    target_link_libraries(weather_engine PRIVATE 
        ${COREFOUNDATION_LIBRARY} 
        ${SECURITY_LIBRARY}
    )
endif()