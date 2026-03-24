#include "WeatherEngine.h"
#include <cmath>

// Constructor implementation
WeatherEngine::WeatherEngine() {
    // Initialize your research-backed weights here (60/20/10/10)
}

nlohmann::json WeatherEngine::score_weather_data(const nlohmann::json& weather_data) {
    nlohmann::json output = nlohmann::json::array();

    auto temps = weather_data["hourly"]["temperature_2m"];
    auto dew_points = weather_data["hourly"]["dewpoint_2m"];
    auto clouds = weather_data["hourly"]["cloudcover"];
    auto wind_speeds = weather_data["hourly"]["windspeed_10m"];
    auto times = weather_data["hourly"]["time"];
    auto rains = weather_data["hourly"]["rain"];

    // Open-Meteo returns 168 hours (7 days). We chunk them into arrays of 24.
    size_t total_hours = temps.size();
    size_t days = total_hours / 24;

    for (size_t d = 0; d < days; ++d) {
        // Create a new JSON object for this specific day
        nlohmann::json day_data;
        
        // Initialize the empty arrays required by your TypeScript interface
        day_data["time"] = nlohmann::json::array();
        day_data["score"] = nlohmann::json::array();
        day_data["rawTemp"] = nlohmann::json::array();
        day_data["rawDp"] = nlohmann::json::array();
        day_data["rawClouds"] = nlohmann::json::array();
        day_data["rawWind"] = nlohmann::json::array();
        day_data["scoredTemp"] = nlohmann::json::array();
        day_data["scoredDp"] = nlohmann::json::array();
        day_data["scoredClouds"] = nlohmann::json::array();
        day_data["scoredWind"] = nlohmann::json::array();
        day_data["rains"] = nlohmann::json::array();

        // Loop exactly 24 times for the 24 hours in this specific day
        for (size_t h = 0; h < 24; ++h) {
            // Calculate the absolute index in the 168-hour array
            size_t i = d * 24 + h; 
            
            // Failsafe just in case the API returns slightly less data
            if (i >= total_hours) break; 

            double temp = temps[i];
            double dp = dew_points[i];
            double cloud_percentage = clouds[i];
            double wind_speed = wind_speeds[i];
            double rain = rains[i];

            double tempScore = score_temperature(temp);
            double dewScore = score_dew_point(dp);
            double cloudScore = score_clouds(cloud_percentage);
            double windScore = score_wind(wind_speed);

            double score = 60*tempScore + 20*dewScore + 10*cloudScore + 10*windScore;

            // Push each hour's calculated data into this day's arrays
            // Note: Keys now perfectly match your TypeScript camelCase!
            day_data["time"].push_back(times[i]);
            day_data["score"].push_back(std::round(score * 10) / 10.0);
            
            day_data["rawTemp"].push_back(temp);
            day_data["rawDp"].push_back(dp);
            day_data["rawClouds"].push_back(cloud_percentage);
            day_data["rawWind"].push_back(wind_speed);
            
            day_data["scoredTemp"].push_back(tempScore);
            day_data["scoredDp"].push_back(dewScore);
            day_data["scoredClouds"].push_back(cloudScore);
            day_data["scoredWind"].push_back(windScore);
            day_data["rains"].push_back(rain);
        }
        
        // Add the completed day object to our final output array
        output.push_back(day_data);
    }

    return output;
}

// --- MATHEMATICAL IMPLEMENTATIONS ---

double WeatherEngine::score_dew_point(double dp) {
  double mu = 12;
  double sigma = 8;
  double p = 4;
  double exponent = -pow((abs(dp - mu)/sigma), p);
  double result = exp(exponent);
  return result;
}

double WeatherEngine::score_temperature(double temp) {
  double mu = 12;
  double sigma = 14;
  double p = 2;
  double exponent = -pow((abs(temp - mu)/sigma), p);
  double result = exp(exponent);
  return result;
}

double WeatherEngine::score_clouds(double cloud_percentage) {
  return 0.01*cloud_percentage;
}

double WeatherEngine::score_wind(double wind_speed) {
  double mu = 7.5;
  double sigma = 5;
  double p = 8;
  double exponent = -pow((abs(wind_speed - mu)/sigma), p);
  double result = exp(exponent);
  return result;
}