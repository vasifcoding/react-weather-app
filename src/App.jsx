/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import "./App.css";
import Box from "@mui/material/Box";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import AccountCircle from "@mui/icons-material/AccountCircle";
import ThermostatIcon from "@mui/icons-material/Thermostat";
import SearchIcon from "@mui/icons-material/Search"; // Arama ikonu
import { createTheme, ThemeProvider } from "@mui/material/styles";
import  birazcikYagmurlu from "/backgrounds/abitrainy.mp4";
import  bulutlu from "/backgrounds/bulutlu.mp4";
import  karli from "/backgrounds/snow.mp4";
import  gunesli from "/backgrounds/sunny.mp4";
import ruzgarli from "/backgrounds/windy.mp4";
import varsayilanHava from "/backgrounds/defaultsunny.mp4";
import gunBatimi from "/backgrounds/gunbatimi.mp4";
import yagmurlu from "/backgrounds/rainy.mp4";
import acikgece from "/backgrounds/acikgece.mp4";

const theme = createTheme({
  palette: {
    primary: {
      main: '#fff', // Ana renk: Beyaz
    },
    secondary: {
      main: '#ff2', // İkincil renk: Mor
    },
    background: {
      default: '#f5f5f5', // Arka plan rengi
    },
  },
  components: {
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: '#fff', // Input'un varsayılan metin rengini beyaz yapıyoruz
        },
      },
    },
    MuiInput: {
      styleOverrides: {
        root: {
          color: '#fff', // Input'un varsayılan metin rengini beyaz yapıyoruz
        },
        underline: {
          '&::before': {
            borderBottom: '1px solid #fff', // Before pseudo-elementinin borderBottom rengini beyaz yapıyoruz
          },
        },
      },
    },
    MuiInputAdornment: {
      styleOverrides: {
        root: {
          
          color: '#fff', // Input'un varsayılan metin rengini beyaz yapıyoruz
        },
        
      },
    },
  },
});
const App = () => {
  const [weatherData, setWeatherData] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const handleChange = (event) => {
    setInputValue(event.target.value);
    console.log(inputValue)
  };
  const allIcons = {
    "01d": gunesli,         // Açık ve güneşli gündüz
    "01n": acikgece,       // Açık gece (gün batımı teması olabilir)
    "02d": bulutlu,         // Az bulutlu gündüz
    "02n": bulutlu,         // Az bulutlu gece
    "03d": bulutlu,         // Parçalı bulutlu gündüz
    "03n": bulutlu,         // Parçalı bulutlu gece
    "04d": bulutlu,         // Kapalı hava gündüz
    "04n": bulutlu,         // Kapalı hava gece
    "09d": birazcikYagmurlu, // Hafif yağmurlu gündüz
    "09n": birazcikYagmurlu, // Hafif yağmurlu gece
    "10d": yagmurlu,        // Yağmurlu gündüz
    "10n": yagmurlu,        // Yağmurlu gece
    "11d": ruzgarli,        // Fırtınalı gündüz
    "11n": ruzgarli,        // Fırtınalı gece
    "13d": karli,           // Karlı gündüz
    "13n": karli,           // Karlı gece
    "50d": ruzgarli,        // Sisli veya rüzgarlı gündüz
    "50n": ruzgarli,        // Sisli veya rüzgarlı gece
  };
  const search = async(city) => {
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${import.meta.env.VITE_APP_ID}&units=metric&lang=tr`
    const response = await fetch(url)
      const data = await response.json()
      console.log(data)
      setWeatherData({
        city: data.name,
        country: data.sys.country,
        temp: Math.floor(data.main.temp),
        desc: data.weather[0].description,
        icon: data.weather[0].icon,
        feels: Math.floor(data.main.feels_like),
        humidity: data.main.humidity,
        wind: data.wind.speed,
        sunrise: new Date(data.sys.sunrise * 1000).toLocaleTimeString(),
        sunset: new Date(data.sys.sunset * 1000).toLocaleTimeString(),

      })
      changeVideo(allIcons[data.weather[0].icon])
      
    } catch (error) {
      console.log(error)
    }
  }
   
  useEffect(() => {
    search('Ankara')
  }, []);
  const [currentVideo, setCurrentVideo] = useState(
    "/backgrounds/bulutlu.mp4"
  );

  // Videoyu değiştiren fonksiyon
  const changeVideo = (videoUrl) => {
    setCurrentVideo(videoUrl);
  };

  return (
    <ThemeProvider theme={theme}>
      {/* Tema Provider'ı ile tema uygulanıyor */}
      <div className="relative w-full h-screen">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover object-center"
          src={currentVideo} // Dinamik video
        />
        <div className="absolute inset-0 flex justify-center md:justify-start items-start mt-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 ">
            {/* Left Side: Glassmorphism efekti uygulandı */}
            <div className="leftSide col-span-1">
              <FormControl variant="standard" color="primary">
                <InputLabel  color="primary" htmlFor="input-with-icon-adornment">
                  Bir Şehir Giriniz
                </InputLabel>
                <Input
                onChange={handleChange}
                value={inputValue}
                  autoFocus
                  sx={{"MuiInput-root::before ":{color:'#fff'} }} // Input'un varsayılan metin rengini beyaz yapıyoruz
                  id="input-with-icon-adornment"
                  color="primary"
                  startAdornment={
                    <InputAdornment position="start">
                      <ThermostatIcon color="primary" />
                    </InputAdornment>
                  }
                  endAdornment={
                    <InputAdornment position="end">
                      <button
                        onClick={() => search(inputValue)}
                        style={{
                          
                          cursor: "pointer",
                        }}
                      >
                        <SearchIcon style={{ color: "#fff" }} />
                      </button>
                    </InputAdornment>
                  }
                />
              </FormControl>
              <div className=" p-6 rounded-lg  text-white max-w-md mx-auto my-4">
              <div className="mt-4 text-center ">
        <p className="text-lg font-semibold font-bold">{weatherData.city}, {weatherData.country}</p>
      <h2 className="text-5xl font-bold text-center"> <img  className="inline mb-3" src={`https://openweathermap.org/img/wn/${weatherData.icon}@2x.png`} alt=""   />{weatherData.temp}°C</h2>
      <span className="font-semibold text-center">Hissedilen : </span>
      <span className="text-center">{weatherData.feels}°</span>
      </div>
      <p className="text-lg text-center">{weatherData.desc}</p>

      <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
       

        <span className="font-semibold">Nem:</span>
        <span>{weatherData.humidity}%</span>

        <span className="font-semibold">Rüzgar hızı :</span>
        <span>{weatherData.wind} m/s</span>

        <span className="font-semibold">Gün Doğumu:</span>
        <span>{weatherData.sunrise}</span>

        <span className="font-semibold">Gün Batımı :</span>
        <span>{weatherData.sunset}</span>
      </div>

     
    </div>
            </div>

            {/* Right Side: Buraya eklemek istediğiniz içerik */}
            <div className="rightSide md:col-span-3 flex justify-end bg-amber-950"></div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default App;
