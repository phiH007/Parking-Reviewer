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
      <h2>All Reported Cars</h2>
      {cars.length === 0 ? <p>Loading or no cars...</p> : (
        <div className="card-container">
          {cars.map(item => <CarCard car={item} key={item._id} user={savedUser} />)}
        </div>
      )}
    </main>
  );
}

export default Main;