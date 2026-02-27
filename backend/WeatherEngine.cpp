#include "WeatherEngine.h"
#include <cmath>

// Constructor implementation
WeatherEngine::WeatherEngine() {
    // Initialize your research-backed weights here (60/20/10/10)
}

// Logic for extracting data from JSON and looping through the 168 hours
nlohmann::json WeatherEngine::score_weather_data(const nlohmann::json& weather_data) {
    nlohmann::json output = nlohmann::json::array();

    auto temps = weather_data["hourly"]["temperature_2m"];
    auto dew_points = weather_data["hourly"]["dewpoint_2m"];
    auto clouds = weather_data["hourly"]["cloudcover"];
    auto wind_speeds = weather_data["hourly"]["windspeed_10m"];
    auto times = weather_data["hourly"]["time"];

    
    for (size_t i = 0; i < temps.size(); ++i) {
      double temp = temps[i];
      double dp = dew_points[i];
      double cloud_percentage = clouds[i];
      double wind_speed = wind_speeds[i];

      double tempScore = score_temperature(temp);
      double dewScore = score_dew_point(dp);
      double cloudScore = score_clouds(cloud_percentage);
      double windScore = score_wind(wind_speed);

      double score = 60*tempScore + 20*dewScore + 10*cloudScore + 10*windScore;
      output.push_back({
        {"time", times[i]},
        {"score", std::round(score * 10) / 10.0},
            // Add raw data back into the JSON object
        {"raw_temp", temp},
        {"raw_dp", dp},
        {"raw_clouds", cloud_percentage},
        {"raw_wind", wind_speed}
      });
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