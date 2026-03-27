import React, { useEffect, useState } from 'react';
import './main.css';

const Main = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
            <div className="main-card" key={car._id}>
              <h3>{car.plate}</h3>
              {car.imageUrl && (
                <img
                  src={car.imageUrl}
                  alt={`${car.make} ${car.model}`}
                  className="car-report-image"
                />
              )}
              <p>{car.make} {car.model}</p>
              <p>{car.reason}</p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default Main;
