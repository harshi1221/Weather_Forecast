import React, { useState } from 'react'
import ForecastCard from '../components/ForecastCard'
import FiveDayCard from '../components/fiveDayCard'

const Home = () => {
    const [city, setCity] = useState('New York');
    const handleCityChange = (newCity)=>{
        setCity(newCity);
    };

    return (
        <>
            <div className='forecasecard'><ForecastCard onCityChange={handleCityChange}/></div>
            <div className='5daycard'><FiveDayCard city={city}/></div>
        </>
    )
}

export default Home