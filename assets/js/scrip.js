const APIKey = "8e050015e74a58b5b8c61db2e46b7318"
const citynameInput = document.querySelector("#cityname");
const citynameForm = document.getElementById("citynameForm");
const storedcityButton = document.querySelector("#storedcityButton");
const currentWeatherEL = document.querySelector('.currentWeather'); 
const forcastEL = document.querySelector('.forcastContainer')
const currentWeatherURL= "https://api.openweathermap.org/data/2.5/weather?q=" + cityname + "&appid=" + APIKey;
const forcastURL= "https://api.openweathermap.org/data/2.5/forecast?q="+ cityname + "&appid=" + APIKey;
