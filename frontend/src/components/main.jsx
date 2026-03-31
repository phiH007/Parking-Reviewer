import { useEffect, useState } from 'react';
import CarCard from './CarCard';
import './main.css';

function Main() {
  const [cars, setCars] = useState([]);
  const savedUser = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetch('/api/cars').then(res => res.json()).then(data => setCars(data.cars || []));
  }, []);

  return (
    <main className="main-content">
      <h2>Cars People Reported</h2>
      {cars.length === 0 ? <p>No cars yet, or still loading.</p> : (
        <div className="card-container">
          {cars.map(item => (
            <CarCard
              car={item}
              key={item._id}
              user={savedUser}
              showDelete={true}
              onCarDeleted={(id) => setCars(cars.filter(car => car._id !== id))}
            />
          ))}
        </div>
      )}
    </main>
  );
}

export default Main;
