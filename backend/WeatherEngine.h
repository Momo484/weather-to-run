#ifndef WEATHER_ENGINE_H
#define WEATHER_ENGINE_H

#include <string>
#include "include/nlohmann/json.hpp"

// Use a class to encapsulate the scoring logic (The OOP Flex)
class WeatherEngine {
public:
    // Constructor to initialize any weights or thresholds
    WeatherEngine();

    // The primary "Public API" of the class: 
    // Takes the giant Open-Meteo JSON and returns a refined, scored JSON object
    nlohmann::json score_weather_data(const nlohmann::json& weather_data);

private:
    // --- PRIVATE PENALTY FUNCTIONS (The Math Flex) ---
    
    // Implements a Flat-Top Guassian with high P for dew_point/humidity.
    double score_dew_point(double dp);

    // Implements the Flat-Top Gaussian for Temperature
    double score_temperature(double temp);

    // Implements the Cloud Cover/Solar Radiation penalty logic
    double score_clouds(double cloud_percentage);

    double score_wind(double wind_speed);

    // --- INTERNAL DATA STRUCTURES ---
    
};

#endif