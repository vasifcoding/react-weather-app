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
import birazcikYagmurlu from "/backgrounds/abitrainy.mp4";
import bulutlu from "/backgrounds/bulutlu.mp4";
import karli from "/backgrounds/snow.mp4";
import gunesli from "/backgrounds/sunny.mp4";
import ruzgarli from "/backgrounds/windy.mp4";
import varsayilanHava from "/backgrounds/defaultsunny.mp4";
import gunBatimi from "/backgrounds/gunbatimi.mp4";
import yagmurlu from "/backgrounds/rainy.mp4";
import acikgece from "/backgrounds/acikgece.mp4";
import axios from "axios";
import { motion } from "framer-motion";
import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

const theme = createTheme({
  palette: {
    primary: {
      main: "#fff", // Ana renk: Beyaz
    },
    secondary: {
      main: "#ff2", // İkincil renk: Mor
    },
    background: {
      default: "#f5f5f5", // Arka plan rengi
    },
  },
  components: {
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "#fff", // Input'un varsayılan metin rengini beyaz yapıyoruz
        },
      },
    },
    MuiInput: {
      styleOverrides: {
        root: {
          color: "#fff", // Input'un varsayılan metin rengini beyaz yapıyoruz
        },
        underline: {
          "&::before": {
            borderBottom: "1px solid #fff", // Before pseudo-elementinin borderBottom rengini beyaz yapıyoruz
          },
        },
      },
    },
    MuiInputAdornment: {
      styleOverrides: {
        root: {
          color: "#fff", // Input'un varsayılan metin rengini beyaz yapıyoruz
        },
      },
    },
  },
});
const App = () => {
  const [loading, setLoading] = useState(false);
  const [weatherData, setWeatherData] = useState(false);
  const filteredData = [];
  const [inputValue, setInputValue] = useState("");
  const [forecast, setForecast] = useState([]);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState("right");
  const date = new Date();
  const currentDate = date.toISOString().slice(0, 10);

  const handleChange = (event) => {
    setInputValue(event.target.value);
    console.log(inputValue);
  };
  const prevCourse = () => {
    setDirection("left"); // Yönü sol olarak ayarla
    setIndex((index) => {
      let newIndex = index - 1;
      if (newIndex < 0) {
        newIndex = forecast.length - 1;
      }
      return newIndex;
    });
  };

  const nextCourse = () => {
    setDirection("right"); // Yönü sağ olarak ayarla
    setIndex((index) => {
      let newIndex = index + 1;
      if (newIndex > forecast.length - 1) {
        newIndex = 0;
      }
      return newIndex;
    });
  };
  const allIcons = {
    "01d": gunesli, // Açık ve güneşli gündüz
    "01n": acikgece, // Açık gece (gün batımı teması olabilir)
    "02d": bulutlu, // Az bulutlu gündüz
    "02n": bulutlu, // Az bulutlu gece
    "03d": bulutlu, // Parçalı bulutlu gündüz
    "03n": bulutlu, // Parçalı bulutlu gece
    "04d": bulutlu, // Kapalı hava gündüz
    "04n": bulutlu, // Kapalı hava gece
    "09d": birazcikYagmurlu, // Hafif yağmurlu gündüz
    "09n": birazcikYagmurlu, // Hafif yağmurlu gece
    "10d": yagmurlu, // Yağmurlu gündüz
    "10n": yagmurlu, // Yağmurlu gece
    "11d": ruzgarli, // Fırtınalı gündüz
    "11n": ruzgarli, // Fırtınalı gece
    "13d": karli, // Karlı gündüz
    "13n": karli, // Karlı gece
    "50d": ruzgarli, // Sisli veya rüzgarlı gündüz
    "50n": ruzgarli, // Sisli veya rüzgarlı gece
  };

  const search = async (city) => {
    try {
      setLoading(true);
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${
        import.meta.env.VITE_APP_ID
      }&units=metric&lang=tr`;
      const response = await fetch(url);
      const data = await response.json();
      console.log(data);
      setWeatherData({
        city: data.name,
        country: data.sys.country,
        temp: Math.floor(data.main.temp),
        max_temp: Math.floor(data.main.temp_max),
        min_temp: Math.floor(data.main.temp_min),
        desc: data.weather[0].description,
        icon: data.weather[0].icon,
        feels: Math.floor(data.main.feels_like),
        lon: data.coord.lon,
        lat: data.coord.lat,
        humidity: data.main.humidity,
        wind: data.wind.speed,
        sunrise: new Date(data.sys.sunrise * 1000).toLocaleTimeString(),
        sunset: new Date(data.sys.sunset * 1000).toLocaleTimeString(),
      });
      changeVideo(allIcons[data.weather[0].icon]);
      setLoading(false);
      setInputValue("");
      setIndex(0);
    } catch (error) {
      console.log(error);
    }
  };

  const searchWeather = async (city) => {
    try {
      setLoading(true);
      const weatherRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${
          import.meta.env.VITE_APP_ID
        }&lang=tr`
      );

      const seenDates = new Set();

      weatherRes.data.list.forEach((item) => {
        const date = item.dt_txt.split(" ")[0]; // Sadece YYYY-MM-DD tarihini al

        if (!seenDates.has(date)) {
          seenDates.add(date);
          filteredData.push({
            date: date,
            temp: Math.floor(item.main.temp),
            min: Math.floor(item.main.temp_min),
            max: Math.floor(item.main.temp_max),
            item: item,
            desc: item.weather[0].description,
            icon: item.weather[0].icon,
          });
        }
      });

      setForecast(filteredData);
      setLoading(false);
      console.log(filteredData);
    } catch (error) {
      console.error("Hata:", error);
      alert("Hava durumu alınırken hata oluştu.");
    }
  };
  const handleSubmit = (event) => {
    event.preventDefault(); // Sayfanın yenilenmesini engelle
    search(inputValue); // Arama fonksiyonunu çağır
  };
  useEffect(() => {
    search("Ankara");
    searchWeather("Ankara");
  }, []);
  const [currentVideo, setCurrentVideo] = useState("/backgrounds/bulutlu.mp4");

  const changeVideo = (videoUrl) => {
    setCurrentVideo(videoUrl);
  };
  const cardVariants = {
    enter: (dir) => ({
      opacity: 0,
      x: dir === "right" ? 50 : -50, // Yöne göre başlangıç pozisyonu
    }),
    center: {
      opacity: 1,
      x: 0, // Merkezde sabit pozisyon
    },
    exit: (dir) => ({
      opacity: 0,
      x: dir === "right" ? -50 : 50, // Yöne göre çıkış pozisyonu
    }),
  };
  return (
    <ThemeProvider theme={theme}>
      <div className="relative w-full h-screen ">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="fixed top-0 left-0 w-full h-full object-cover"
          src={currentVideo} // Dinamik video
        />
        <div className="absolute inset-0 flex justify-center md:justify-start items-start mt-4 md:mt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4  ">
            {/* Left Side: Glassmorphism efekti uygulandı */}
            <div className="leftSide  col-span-1 m-2 md:m-0 ">
              <div className="topSide rounded-2xl md:rounded-bl-none md:rounded-tl-none  md:h-full md:h-screen">
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col items-center justify-center w-full"
                >
                  <FormControl
                    className="flex text-center justify-center w-full "
                    variant="standard"
                    color="primary"
                  >
                    <InputLabel
                      color="primary"
                      htmlFor="input-with-icon-adornment"
                    >
                      Bir Şehir Giriniz
                    </InputLabel>
                    <Input
                      onChange={handleChange}
                      value={inputValue}
                      autoFocus
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
                </form>
                <div className=" p-4 rounded-lg  text-white max-w-md mx-auto my-4">
                  <div className="mt-1 text-center ">
                    <p className="text-lg font-semibold">
                      {weatherData.city}, {weatherData.country}
                    </p>
                    <h2 className="text-5xl font-bold text-center">
                      {" "}
                      <img
                        className="inline mb-3"
                        src={`https://openweathermap.org/img/wn/${weatherData.icon}@2x.png`}
                        alt=""
                      />
                      {weatherData.temp}°C
                    </h2>
                    <span className="font-semibold text-center">
                      Hissedilen :{" "}
                    </span>
                    <span className="text-center">{weatherData.feels}°</span>{" "}
                    <br />
                    <span>
                      Y : {weatherData.max_temp}° D : {weatherData.min_temp}°
                    </span>
                  </div>
                  <p className="text-lg text-center">{weatherData.desc}</p>
                  <div className="grid text-center grid-cols-2 gap-2  mt-4 text-sm">
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
              <div className="bottomSide md:hidden my-2">
                <span className="text-2xl text-white font-semibold">
                  6 Günlük Tahmin
                </span>

                {loading ? (
                  <p className="text-white mt-4">Yükleniyor...</p>
                ) : forecast.length > 0 ? (
                  <div className="flex flex-wrap justify-center items-center mt-2">
                    <Button onClick={prevCourse} className="text-white">
                      <KeyboardArrowLeftIcon fontSize="small" />
                    </Button>
                    <motion.div
                      key={index}
                      custom={direction} // Yönü animation'a parametre olarak geç
                      variants={cardVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.3 }}
                    >
                      <Card
                        className="p-2  rounded-2xl    text-center "
                        sx={{
                          backgroundColor: "rgba(101, 142, 189, 0.3)",
                          color: "white",
                          backdropFilter: "blur(10px)",
                          boxShadow: "0 4px 10px rgba(12, 12, 12, 0.1)"
                        }}
                      >
                        <CardContent className="bg-transparent ">
                          <span className="text-white">
                            {currentDate == forecast[index].date
                              ? "Bugün"
                              : forecast[index].date}
                          </span>

                          <img
                            width={50}
                            height={50}
                            className="mx-auto "
                            src={`https://openweathermap.org/img/wn/${forecast[index].icon}@2x.png`}
                            alt="Hava Durumu İkonu"
                          />

                          <Typography
                            variant="h5"
                            className="text-white font-bold"
                          >
                            {forecast[index].temp}°C
                          </Typography>

                          <Typography className="text-white text-sm">
                            Y: {forecast[index].max}° | D: {forecast[index].min}
                            °
                          </Typography>

                          <Typography className="text-white italic mt-1">
                            {forecast[index].desc}
                          </Typography>
                        </CardContent>
                      </Card>
                    </motion.div>

                    <Button onClick={nextCourse} className="text-white">
                      <KeyboardArrowRightIcon fontSize="small" />
                    </Button>
                  </div>
                ) : (
                  <p className="text-white mt-4">Veri yok</p>
                )}
              </div>

              <div className="rightSide md:col-span-3 flex justify-end bg-amber-950"></div>
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default App;
