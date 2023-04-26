const APIKey = "8e050015e74a58b5b8c61db2e46b7318"
const citynameInput = document.querySelector("#cityname");
const citynameForm = document.getElementById("citynameForm");
const currentWeatherEL = document.querySelector('.CurrentWeather'); 
const forcastEL = document.querySelector('.forcastContainer');


let storedcityButton = document.querySelector(".storedcityButton");

let cities = [];

function formsubmitHandler(event){
    event.preventDefault();

    const cityname = citynameInput.value;

    citynameInput.value = '';
    
    if(cityname){
        renderCityname(cityname)  
    }else{
        alert("Please enter a valid City name")
        return;
    };
    
    cities.push(cityname);
    storeCities();
    printout();
    
}

function printout() {
    
    
    storedcityButton.innerHTML = '';
     for (let i = 0; i < cities.length; i++) {
        let City = cities[i];
    
        const li = document.createElement("button");
        li.textContent = City;
        li.setAttribute("data-city", City);
        li.setAttribute("class","block")
        storedcityButton.append(li);

    }
   
};


function init() {
    let storedCities = JSON.parse(localStorage.getItem("cities"));
  
    if (storedCities !== null) {
      cities = storedCities;
    }
  
    printout();
  };

function storeCities() {
    localStorage.setItem("cities", JSON.stringify(cities));
    
}

function renderCityname(cityname){
    const currentWeatherURL= "https://api.openweathermap.org/data/2.5/weather?q=" + cityname + "&appid=" + APIKey;

    fetch(currentWeatherURL)
    .then(function(response){
        if(response.ok){
        response.json().then(function(data){
        currentWeather(data, cityname)
        })
        }else {
          alert('Error: ' + response.statusText);
          }
})
    .catch(function (error) {
        alert('Unable to connect to Open Weather');
     });

    const forcastURL= "https://api.openweathermap.org/data/2.5/forecast?q="+ cityname + "&appid=" + APIKey;

     fetch(forcastURL)
    .then(function(responseF){
        if(responseF.ok){
        responseF.json().then(function(dataF){
        Forcast(dataF, cityname);
        })
        }else {
          alert('Error: ' + responseF.statusText);
          }
})
    .catch(function (error) {
        alert('Unable to connect to Open Weather');
     });
};

function createWeatherIcon(iconCode){
    // create the img tag with src as
    const imgEL=document.createElement('img');
    const iconurl = "http://openweathermap.org/img/w/" + iconCode + ".png";
    imgEL.setAttribute('src', iconurl);
    currentWeatherEL.append(imgEL);

}


function currentWeather(data){
    currentWeatherEL.textContent = '';

    const weatherIconEl = createWeatherIcon(data.weather[0].icon);
   const currentWeatherH2 = document.createElement('h2');
   currentWeatherH2.innerHTML = data.name + ' (' + dayjs().format('MMM D, YYYY') + ')';

   const currentWeatherP = document.createElement('p');
   currentWeatherP.innerHTML = 'Temp: '+ (data.main.temp - 273.15).toFixed(1) + "°C <br> Wind: " + data.wind.speed + "(m/s) <br>Humidity: " + data.main.humidity + "%";

   currentWeatherEL.append(currentWeatherH2);
   currentWeatherEL.append(currentWeatherP);
   currentWeatherEL.style.display = 'block';
   
   
}

function createWeatherIcon2 (iconCode){
    const imgEL=document.createElement('img');
    const iconurl= "http://openweathermap.org/img/w/" + iconCode + ".png";
    imgEL.setAttribute('src', iconurl);
    imgEL.style.width='50px';
    imgEL.style.height='50px';
    imgEL.style.display='block'
    // imgEL.classList.add('weather-icon');
    forcastEL.append(imgEL);
}

function Forcast(dataF) {

    forcastEL.textContent = '';

    for (let i = 1; i < 6; i++) {
      const nextDate = dayjs().add(i, 'day').format('MMM D, YYYY');
      const forcastCard = document.createElement('div');
      const dataFList = dataF.list[i]
      const weatherIcon2 = createWeatherIcon2(dataFList.weather[0].icon);
      forcastCard.innerHTML = nextDate+ '<br>Temp: '+ (dataFList.main.temp -273.15).toFixed(1)+ "°C <br> Wind: " + dataFList.wind.speed + "(m/s) <br>Humidity: " + dataFList.main.humidity + "%";
      
      forcastCard.setAttribute('class','col-2')
      forcastCard.style.display='block';
      
      forcastEL.append(forcastCard);
    }
    
}


citynameForm.addEventListener('submit', formsubmitHandler);
init();