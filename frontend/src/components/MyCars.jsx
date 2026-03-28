import React, { useEffect, useState } from 'react';
import ReportIdiot from './ReportIdiot';

const ViolationTags = ({ carId }) => {
  const [violations, setViolations] = useState([]);

  useEffect(() => {
    fetch(`/api/violations/car/${carId}`)
      .then((res) => res.json())
      .then((data) => setViolations(data.violations || []));
  }, [carId]);

  if (violations.length === 0) return null;

  return (
    <div className="violation-tags">
      {violations.map((v) => (
        <span className="violation-tag" key={v._id}>{v.name}</span>
      ))}
    </div>
  );
};

const MyCars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showReportForm, setShowReportForm] = useState(false);

  const savedUser = JSON.parse(localStorage.getItem('user'));
  const userId = savedUser?.id;

  const fetchCars = async () => {
    try {
      const res = await fetch(`/api/cars?userId=${userId}`);
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

  useEffect(() => {
    if (userId) {
      fetchCars();
    } else {
      setError('No logged-in user found.');
      setLoading(false);
    }
  }, [userId]);

  if (loading) {
    return <main className="main-content"><p>Loading cars...</p></main>;
  }

  if (error) {
    return <main className="main-content"><p>{error}</p></main>;
  }

  if (showReportForm) {
    return (
      <ReportIdiot
        onBack={() => setShowReportForm(false)}
        onSuccess={() => {
          setShowReportForm(false);
          fetchCars();
        }}
      />
    );
  }

  return (
    <main className="main-content">
      <h2>My Reported Cars</h2>

      <button onClick={() => setShowReportForm(true)}>
        Report a Car
      </button>

      {cars.length === 0 ? (
        <p>No reported cars yet.</p>
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
              <ViolationTags carId={car._id} />
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default MyCars;
