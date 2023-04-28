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
        li.style.width= '250px';
        li.style.margin='10px';
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
    imgEL.setAttribute('class', 'img1');
    currentWeatherEL.append(imgEL);

}

function createWeatherIcon2 (iconCode){
    const imgEL=document.createElement('img');
    const iconurl= "http://openweathermap.org/img/w/" + iconCode + ".png";
    imgEL.setAttribute('src', iconurl);
    imgEL.style.width='50px';
    imgEL.style.height='50px';
    return imgEL;
}

function currentWeather(data){
    currentWeatherEL.textContent = '';

    const weatherIconEl = createWeatherIcon(data.weather[0].icon);
   const currentWeatherH2 = document.createElement('h2');
   currentWeatherH2.innerHTML = data.name + ' (' + dayjs().format('MMM D, YYYY') + ')';
   currentWeatherH2.setAttribute('class', 'title');
   const currentWeatherP = document.createElement('p');
   currentWeatherP.innerHTML = 'Temp: '+ (data.main.temp - 273.15).toFixed(1) + "°C <br><br> Wind: " + data.wind.speed + "(m/s) <br><br>Humidity: " + data.main.humidity + "%";

   currentWeatherEL.append(currentWeatherH2);
   currentWeatherEL.append(currentWeatherP);
   currentWeatherEL.style.display = 'block';
   
   
}



function Forcast(dataF) {

    forcastEL.textContent = '';
    const h4 = document.querySelector('h4');
    h4.style.display='block';

    let dailyForcasts = {};
    for (let i = 0; i < dataF.list.length; i++) {

      
      const dataFList = dataF.list[i]
      const date = dayjs.unix(dataFList.dt).format('MMM D, YYYY');

      if(!dailyForcasts[date]){
        dailyForcasts[date] = {
            date: date,
            temp: (dataFList.main.temp -273.15).toFixed(1),
            wind: dataFList.wind.speed,
            humidity: dataFList.main.humidity,
        };
      }
    }

    const keys = Object.keys(dailyForcasts)
    for (let i =0; i< keys.length; i++){

        const forecast = dailyForcasts[keys[i]]
        const weatherIcon2 = createWeatherIcon2(dataF.list[i].weather[0].icon);
        const forcastCard = document.createElement('div');
        forcastCard.innerHTML = forecast.date+ '<br>Temp: '+ forecast.temp + "°C <br> Wind: " + forecast.wind + "(m/s) <br>Humidity: " + forecast.humidity + "%";
    
        forcastCard.setAttribute('class','col-2');

        forcastCard.style.display='block';
    
        forcastEL.append(forcastCard);
        forcastCard.append(weatherIcon2);
    }


};

function renderSearchHistory(event){
   
    if (event.target.matches('button')){
        
        buttonData= event.target.getAttribute('data-city');
        renderCityname(buttonData);
   
    }else{
        return;
    }
};

       


citynameForm.addEventListener('submit', formsubmitHandler);
storedcityButton.addEventListener('click',renderSearchHistory);
init();