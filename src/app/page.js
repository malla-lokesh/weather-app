"use client";

import { useEffect, useState } from "react";
import CalculateDate from "./CalculateDate";
import CalculateTime from "./CalculateTime";
import { weatherCodes } from "./WeatherCodes";
import Image from "next/image";
import { weatherIcons } from "./WeatherIcons";

export default function Home() {
  // useState to set the current location.
  const [location, setLocation] = useState("");
  // useState to set the today's realtime data in state variable
  const [realtimeData, setRealtimeData] = useState({});
  // useState to set the forecast data in state variable
  const [forecast, setForecast] = useState({});

  // Effect hook to fetch data when component mounts
  useEffect(() => {
    const fetchData = async () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            const bdcApi = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;
            const temperatureUrl = `https://api.tomorrow.io/v4/weather/realtime?location=${latitude},${longitude}&apikey=hp3e1h4OglFd1VZGeDDuHBj5MuBeH6a3`;
            const forecastUrl = `https://api.tomorrow.io/v4/weather/forecast?location=${latitude},${longitude}&apikey=hp3e1h4OglFd1VZGeDDuHBj5MuBeH6a3`;

            // to get the city location
            try {
              const response = await fetch(bdcApi);
              if (response.ok) {
                const data = await response.json();
                setLocation(data.city);
              } else {
                console.log("Unable to detect location: ", response.status);
              }
            } catch (error) {
              console.log("Error while fetching location: ", error);
            }

            // to get today's realtime temperature data
            try {
              const response = await fetch(temperatureUrl);
              if (response.ok) {
                const data = await response.json();
                setRealtimeData(data);
              } else {
                console.log(
                  "Unable to fetch today's weather data: ",
                  response.status
                );
              }
            } catch (error) {
              console.log("Error while fetching today's weather: ", error);
            }

            // to get the upcoming 5 forecast data.
            try {
              const response = await fetch(forecastUrl);
              if (response.ok) {
                const data = await response.json();
                setForecast(data);
              } else {
                console.log("Fetching forecast failed! ", response.status);
              }
            } catch (error) {
              console.log("Error while fetching forecast: ", error);
            }
          },
          (err) => console.log(err.message)
        );
      } else {
        console.log("Geolocation is not supported!");
      }
    };

    fetchData();
  }, []);

  return (
    <main className="flex flex-col">
      <div className={`text-5xl font-mono p-7`}>
        <span className="text-[#0071e3]">Weather</span> App
      </div>
      <div className="flex gap-x-3 m-10 mb-2">
        <div className="bg-[#F5F5F7] rounded-xl py-8 w-7/12">
          {location ? (
            <div className={`flex flex-col items-center`}>
              <div className="flex">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="20"
                  viewBox="0 -960 960 960"
                  width="20"
                >
                  <path d="M516-120 402-402 120-516v-56l720-268-268 720h-56Zm26-148 162-436-436 162 196 78 78 196Zm-78-196Z" />
                </svg>
                {location}
              </div>
              <div className="text-5xl mt-2">
                {Math.round(realtimeData?.data?.values?.temperature)}°
              </div>
              <div className="flex gap-3 mb-4">
                <div className="text-[#232324]">
                  High -{" "}
                  {Math.round(
                    forecast?.timelines?.daily[0]?.values?.temperatureMax
                  )}
                  °
                </div>
                <div className="text-[#232324]">
                  Low -{" "}
                  {Math.round(
                    forecast?.timelines?.daily[0]?.values?.temperatureMin
                  )}
                  °
                </div>
              </div>

              <div>humidity: {realtimeData?.data?.values?.humidity}</div>
              <div>wind speed: {realtimeData?.data?.values?.windSpeed}</div>
              <div>
                wind direction: {realtimeData?.data?.values?.windDirection}
              </div>
              <div>
                precipitation Probability:
                {realtimeData?.data?.values?.precipitationProbability}
              </div>
            </div>
          ) : (
            // If location state variable is not set, it will say processing...
            <div className="flex">Processing...</div>
          )}
        </div>
        <div className="bg-[#F5F5F7] rounded-xl p-5 w-5/12 flex justify-center items-center">
          {weatherCodes[realtimeData?.data?.values?.weatherCode]}
          <Image
            src={weatherIcons[realtimeData?.data?.values?.weatherCode]}
            width={64}
            height={64}
            alt={weatherCodes[realtimeData?.data?.values?.weatherCode]}
          />
        </div>
      </div>
      <div className="bg-gray-100 rounded-lg mx-10 mt-2 p-7">
        <div className="flex justify-evenly">
          {forecast &&
            forecast?.timelines?.daily?.map((day, index) => (
              <div key={index}>
                <CalculateDate className="mr-10" DateTimeStamp={day?.time} />
                <div>High - {day?.values?.temperatureMax}</div>
                <div>Low - {day?.values?.temperatureMin}</div>
                <div>
                  sunrise -{" "}
                  <CalculateTime DateTimeStamp={day?.values?.sunriseTime} />
                </div>
                <div>
                  sunset -{" "}
                  <CalculateTime DateTimeStamp={day?.values?.sunsetTime} />
                </div>
                <div>
                  moonrise -{" "}
                  <CalculateTime DateTimeStamp={day?.values?.moonriseTime} />
                </div>
                <div>
                  moonset -{" "}
                  <CalculateTime DateTimeStamp={day?.values?.moonsetTime} />
                </div>
              </div>
            ))}
        </div>
      </div>
    </main>
  );
}
