import React, { useEffect, useState } from 'react'
import './styles/ForecastCard.css'
import Swal from 'sweetalert2';
import axios from 'axios';

const ForecastCard = ({ onCityChange }) => {
    const [weatherData, setWeatherData] = useState('');
    const [city, setCity] = useState('New York');
    const [searchCity, setSearchCity] = useState('');
    const [isCelsius, setIsCelsius] = useState(true);
    const [loading, setLoading] = useState(false);

    const api = '125cf85862aed3d08eb08cfb5be80250';


    const fetchWeatherCity = async (cityName) => {
        setLoading(true);
        try {
            const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${api}&units=metric`);
            console.log(response.data);
            setWeatherData(response.data);
            onCityChange(cityName)
            setLoading(false);
        } catch (error) {
            console.log('Error while fetching weather data: ', error);
            setLoading(false);
            Swal.fire({
                icon: 'error',
                title: 'City not found'
            })
        }
    }

    useEffect(() => {
        fetchWeatherCity(city);
    }, [city])


    const handleSearch = (event) => {
        event.preventDefault();
        if (searchCity.trim()) {
            setCity(searchCity.trim());
            fetchWeatherCity(searchCity.trim());
            setSearchCity('');
        }
    }

    const toggleTemperatureUnit = () => {
        setIsCelsius((prev) => !prev);
    };

    const tempConvert = (temp) => {
        if (isCelsius) {
            return temp;
        } else {
            return ((temp * 9) / 5) + 32;
        }
    }

    return (
        <div>
            <div className='weather container mt-5 p-3'>
                <form className='d-flex p-3' onSubmit={handleSearch}>
                    <input
                        value={searchCity}
                        onChange={(e) => setSearchCity(e.target.value)}
                        type='search'
                        className='form-control me-2 searchbar'
                        placeholder='Enter City Name'></input>
                    <button type='submit' className='btn btn-secondary'>search</button>
                </form>

                {loading ? ( 
                    <div className="d-flex justify-content-center">
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) :
                    weatherData && (
                        <div className='d-flex flex-column flex-md-row justify-content-between align-items-center p-3'>
                            <p className='fs-2'>{weatherData.name}</p>
                            <div className='d-flex flex-row justify-content-end'>
                                <p className='fs-3'>
                                    {tempConvert(weatherData.main.temp)}
                                    <span className='toggle' id='convertion' onClick={toggleTemperatureUnit} >
                                        °{isCelsius ? 'C' : 'F'}
                                    </span>
                                </p>

                            </div>
                            <div className='d-flex flex-column align-items-center align-items-md-start mt-2 mt-md-0'>
                                <img className='d-flex  image'
                                    src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                                    alt='weather icon'>
                                </img>
                                <p className='fs-4'>{weatherData.weather[0].description}</p>
                            </div>
                        </div>
                    )}
            </div>
        </div>
    )
}

export default ForecastCard