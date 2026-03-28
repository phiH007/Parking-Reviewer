import React, { useEffect, useState } from 'react';
import CarCard from './CarCard';
import './main.css';

const Main = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const savedUser = JSON.parse(localStorage.getItem('user'));
  const userId = savedUser?.id;

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const res = await fetch('/api/cars');
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Failed to load cars');
        }

        setCars(data.cars);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  if (loading) {
    return <main className="main-content"><p>Loading reported cars...</p></main>;
  }

  if (error) {
    return <main className="main-content"><p>{error}</p></main>;
  }

  return (
    <main className="main-content">
      <h2>All Reported Cars</h2>

      {cars.length === 0 ? (
        <p>No cars have been reported yet.</p>
      ) : (
        <div className="card-container">
          {cars.map((car) => (
            <CarCard car={car} key={car._id} userId={userId} />
          ))}
        </div>
      )}
    </main>
  );
};

export default Main;
