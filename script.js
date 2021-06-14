//DATAHANDLING
//PRIVATE
//returns speed in m/s, rounded to 1 digits
const convertSpeedToMetric = (imperialSpeed) => +(imperialSpeed * 1.609344).toFixed(1);

//returns temp in Celsius, rounded to 1 digits
const convertTempToMetric = (imperialTemp) => +((imperialTemp - 32) / 1.8).toFixed(1);

//PUBLIC
//converts api call to object containing only used data
const convertData = (weatherData) => {
  const data = {
    humidity: weatherData.main.humidity,
    location: {
      name: weatherData.name,
      country: weatherData.sys.country
    },
    temp: {
      imperial:+weatherData.main.temp.toFixed(1),
      metric: convertTempToMetric(weatherData.main.temp)
    },
    tempFeelsLike: {
      imperial: +weatherData.main.feels_like.toFixed(1),
      metric: convertTempToMetric(weatherData.main.feels_like)
    },
    tempMax: {
      imperial: +weatherData.main.temp_max.toFixed(1),
      metric: convertTempToMetric(weatherData.main.temp_max)
    },
    tempMin: {
      imperial: +weatherData.main.temp_min.toFixed(1),
      metric: convertTempToMetric(weatherData.main.temp_min)
    },
    weather: {
      description: weatherData.weather[0].description,
      main: weatherData.weather[0].main
    },
    windSpeed: {
      imperial: +weatherData.wind.speed.toFixed(1),
      metric: convertSpeedToMetric(weatherData.wind.speed)
    }
  }
  return data;
}

//handles api request
const weatherRequest = async (city) => {
  try {
    const key = '039268e896c862a9ccf796f360b5aab0';
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${key}`, {mode: 'cors'});
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}

//VIEWHANDLING
const fillData = (weatherData, isImperial) => {
  dataCurrentTemp.textContent = isImperial ? `${weatherData.temp.imperial}°F` : `${weatherData.temp.metric}°C`;
  dataLocation.textContent = `${weatherData.location.name}, ${weatherData.location.country}`;
  dataWeatherType.textContent = weatherData.weather.main;
  dataWeatherTypeDetailed.textContent = weatherData.weather.description;
  dataFeelsLike.textContent = isImperial ? `${weatherData.tempFeelsLike.imperial}°F` : `${weatherData.tempFeelsLike.metric}°C`;
  dataHumidity.textContent = `${weatherData.humidity}%`;
  dataWindSpeed.textContent = isImperial ? `${weatherData.windSpeed.imperial} mph` : `${weatherData.windSpeed.metric} km/h`;
  dataMinTemp.textContent = isImperial ? `${weatherData.tempMin.imperial}°F` : `${weatherData.tempMin.metric}°C`;
  dataMaxTemp.textContent = isImperial ? `${weatherData.tempMax.imperial}°F` : `${weatherData.tempMax.metric}°C`;
};

const hideErrorMessage = () => {
  errorMessage.classList.add('message--hidden');
};

const hideWeatherData = () => {
  mainDataHolder.classList.add('main--hidden');
};

const hideWelcomeMessage = () => {
  welcomeMessage.classList.add('message--hidden');
};

const resetInput = () => {
  searchInput.value = '';
  searchInput.focus();
};

const showErrorMessage = () => {
  errorMessage.classList.remove('message--hidden');
};

const showWeatherData = () => {
  mainDataHolder.classList.remove('main--hidden');
};

//EVENTS
const submitHandler = async () => {
  const city = searchInput.value;
  if(city.length !== 0) {
    try {
      requestedData = await weatherRequest(city);
      weatherData = convertData(requestedData);
      fillData(weatherData, isImperialMode);
      hideWelcomeMessage();
      hideErrorMessage();
      resetInput();
      showWeatherData();
    } catch (error) {
      hideWeatherData();
      hideWelcomeMessage();
      showErrorMessage();
    }
  }
};

const toggleMeasurementType = () => {
  isImperialMode = !isImperialMode;
  changeModeButton.textContent = isImperialMode ? 'Display in Metric' : 'Display in Imperial';
  fillData(weatherData, isImperialMode);
};

//variables
//search elements
const searchButton = document.querySelector('#search-button');
const searchInput = document.querySelector('#input-location');
//message elements
const welcomeMessage = document.querySelector('#welcome-message');
const errorMessage = document.querySelector('#error-message');
//data elements
const mainDataHolder = document.querySelector('#main');
const changeModeButton = document.querySelector('#change-mode');
const dataCurrentTemp = document.querySelector('#current-temp');
const dataWeatherType = document.querySelector('#weather-type');
const dataWeatherTypeDetailed = document.querySelector('#weather-type-detailed');
const dataLocation = document.querySelector('#location');
const dataFeelsLike = document.querySelector('#feels-like');
const dataHumidity = document.querySelector('#humidity');
const dataWindSpeed = document.querySelector('#wind-speed');
const dataMinTemp = document.querySelector('#min-temp');
const dataMaxTemp = document.querySelector('#max-temp');
//data
let isImperialMode = true;
let weatherData = null;

changeModeButton.addEventListener('click', toggleMeasurementType);
searchButton.addEventListener('click', submitHandler);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') submitHandler();
});
resetInput();
