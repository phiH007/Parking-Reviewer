import { useEffect, useState } from 'react';
import ReportIdiot from './ReportIdiot';
import CarCard from './CarCard';

function MyCars() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showReportForm, setShowReportForm] = useState(false);

  const savedUser = JSON.parse(localStorage.getItem('user'));
  const userId = savedUser ? savedUser.id : '';

  async function fetchCars() {
    try {
      const response = await fetch(`/api/cars?userId=${userId}`);
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

  useEffect(() => {
    if (userId) {
      fetchCars();
      return;
    }

    setError('No logged-in user found.');
    setLoading(false);
  }, [userId]);

  function handleShowReportForm() {
    setShowReportForm(true);
  }

  function handleBackFromReport() {
    setShowReportForm(false);
  }

  function handleReportSuccess() {
    setShowReportForm(false);
    fetchCars();
  }

  function handleCarDeleted(deletedId) {
    setCars(cars.filter((item) => item._id !== deletedId));
  }

  if (loading) {
    return (
      <main className="main-content">
        <p>Loading cars...</p>
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

  if (showReportForm) {
    return (
      <ReportIdiot
        onBack={handleBackFromReport}
        onSuccess={handleReportSuccess}
      />
    );
  }

  return (
    <main className="main-content">
      <h2>My Reported Cars</h2>

      <button type="button" onClick={handleShowReportForm}>
        Report a Car
      </button>

      {cars.length === 0 ? (
        <p>No reported cars yet.</p>
      ) : (
        <div className="card-container">
          {cars.map((item) => (
            <CarCard
              car={item}
              key={item._id}
              userId={userId}
              showDelete={true}
              onCarDeleted={handleCarDeleted}
            />
          ))}
        </div>
      )}
    </main>
  );
}

export default MyCars;
