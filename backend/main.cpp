#define CPPHTTPLIB_OPENSSL_SUPPORT
#define CROW_ENFORCE_WS_SPEC
#include "include/httplib.h"
#include "include/nlohmann/json.hpp"
#include "WeatherEngine.h"
#include "include/crow_all.h" 

using json = nlohmann::json;

int main() {
    crow::SimpleApp app;

    CROW_ROUTE(app, "/api/forecast")
    ([](const crow::request& req){
        
        // lat and long are stored in the url request.
        char* lat_param = req.url_params.get("lat");
        char* lon_param = req.url_params.get("lon");

        if (!lat_param || !lon_param) {
            return crow::response(400, "{\"error\": \"Missing 'lat' or 'lon' query parameters\"}");
        }

        // convert to string for string concatination.
        std::string lat_str = lat_param;
        std::string lon_str = lon_param;

        std::string endpoint = "/v1/forecast?latitude=" + lat_str + 
                            "&longitude=" + lon_str + 
                            "&hourly=temperature_2m,dewpoint_2m,cloudcover,windspeed_10m";

        // using httplib to get weather data from open-meteo
        httplib::Client cli("https://api.open-meteo.com");
        auto res = cli.Get(endpoint.c_str());

        if (res && res->status == 200) {
            json raw_data = json::parse(res->body);
            
            WeatherEngine engine;
            json scored_data = engine.score_weather_data(raw_data);
            
            // Create the response object
            auto response = crow::response(200, scored_data.dump());
            
            // THE CORS BYPASS: Tell the browser this data is safe to share
            // The "*" means "allow any frontend to read this data"
            response.add_header("Access-Control-Allow-Origin", "*");
            response.add_header("Access-Control-Allow-Methods", "GET, OPTIONS");
            response.add_header("Content-Type", "application/json");
            
            return response;    
        } else {
            return crow::response(502, "{\"error\": \"Bad Gateway: Failed to fetch from Open-Meteo\"}");
        }
        
    });

    // starting server.
    std::cout << "Starting Weather to Run API on http://localhost:8080..." << std::endl;
    app.port(8080).multithreaded().run();
    app.bindaddr("0.0.0.0").port(8080).multithreaded().run();
}