import React, { useEffect, useState } from 'react'
import axios from 'axios';
import Swal from 'sweetalert2';
import './styles/fivedaycard.css'

const FiveDayCard = ({ city }) => {
    const [dayForecast, setDayForecast] = useState([]);

    const api = '125cf85862aed3d08eb08cfb5be80250';


    const fetchDayforecast = async () => {
        try {
            const response = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${api}`);
            const data = response.data;

            const today = new Date().toISOString().split('T')[0];

            const groupedForecasts = data.list.reduce((acc, forecast) => {
                const date = forecast.dt_txt.split(' ')[0];
                if (date !== today) {
                    if (!acc[date]) {
                        acc[date] = [];
                    }
                    acc[date].push(forecast);
                }
                return acc;
            }, {});

            const nextFiveDaysForecast = Object.keys(groupedForecasts).slice(0, 5).map(date => {
                const dailyForecasts = groupedForecasts[date];
                const tempMax = Math.max(...dailyForecasts.map(f => f.main.temp_max));
                const tempMin = Math.min(...dailyForecasts.map(f => f.main.temp_min));
                const weather = dailyForecasts[0].weather[0]; 

                return {
                    day: new Date(date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long' }),
                    tempMax,
                    tempMin,
                    weather,
                };
            });

            setDayForecast(nextFiveDaysForecast);
        } catch (err) {
            console.log('error while fetching day forecast: ', err)
            Swal.fire({
                icon: 'error',
                title: 'Error occured while fetching the data'
            })
        }
    }

    useEffect(() => {
        fetchDayforecast();
    }, [city]);


    return (
        <>
            <h3 className='text-center mb-2 mt-4'>5-Day weather Forecast for {city}</h3>
            <div className='forecast-container d-flex flex-wrap justify-content-center  p-3'>

                {dayForecast.map((day, index) => (
                    < div key={index} className='col-12 col-sm-6 col-md-4 col-lg-2 d-flex justify-content-center mb-3'>
                        <div className='forecast-card  p-3'>
                            <h4>{day.day}</h4>
                            <img className='weather-icon' src={`https://openweathermap.org/img/wn/${day.weather.icon}@2x.png`}
                                alt={day.weather.description} />
                            <div className='temperatures'>
                                <p> High: {Math.round(day.tempMax)}°C</p>
                                <p>Low: {Math.round(day.tempMin)}°C</p>
                            </div>
                        </div>
                    </div>
                ))}

            </div >
        </>
    )
}

export default FiveDayCard