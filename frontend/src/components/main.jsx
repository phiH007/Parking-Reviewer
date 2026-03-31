import { useEffect, useState } from 'react';
import CarCard from './CarCard';
import './main.css';

function Main() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const savedUser = JSON.parse(localStorage.getItem('user'));
  const userId = savedUser ? savedUser.id : '';

  useEffect(() => {
    async function fetchCars() {
      try {
        const response = await fetch('/api/cars');
        const theJson = await response.json();

        if (!response.ok) {
          setError(theJson.error || 'Failed to load cars');
          setLoading(false);
          return;
        }

        setCars(theJson.cars || []);
        setError('');
        setLoading(false);
      } catch (errorObject) {
        setError('Failed to load cars');
        setLoading(false);
      }
    }

    fetchCars();
  }, []);

  if (loading) {
    return (
      <main className="main-content">
        <p>Loading reported cars...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="main-content">
        <p>{error}</p>
      </main>
    );
  }

  return (
    <main className="main-content">
      <h2>All Reported Cars</h2>

      {cars.length === 0 ? (
        <p>No cars have been reported yet.</p>
      ) : (
        <div className="card-container">
          {cars.map((item) => (
            <CarCard car={item} key={item._id} userId={userId} />
          ))}
        </div>
      )}
    </main>
  );
}

export default Main;
