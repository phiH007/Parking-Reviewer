import { useEffect, useState } from 'react';
import ReportIdiot from './ReportIdiot';
import CarCard from './CarCard';

function MyCars() {
  const [cars, setCars] = useState([]);
  const [showReportForm, setShowReportForm] = useState(false);
  const savedUser = JSON.parse(localStorage.getItem('user'));

  function fetchCars() {
    if (savedUser) {
      fetch(`/api/cars?userId=${savedUser._id}`)
        .then(res => res.json())
        .then(data => setCars(data.cars || []));
    }
  }

  useEffect(() => { fetchCars(); }, []);

  if (!savedUser) return <main className="main-content"><p>Please log in.</p></main>;

  if (showReportForm) {
    return <ReportIdiot onBack={() => setShowReportForm(false)} onSuccess={() => { setShowReportForm(false); fetchCars(); }} />;
  }

  return (
    <main className="main-content">
      <h2>My Reported Cars</h2>
      <button onClick={() => setShowReportForm(true)}>Report a Car</button>

      <div className="card-container">
        {cars.map(item => (
          <CarCard car={item} key={item._id} user={savedUser} showDelete={true} onCarDeleted={(id) => setCars(cars.filter(c => c._id !== id))} />
        ))}
      </div>
    </main>
  );
}

export default MyCars;