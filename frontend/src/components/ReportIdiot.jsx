import { useEffect, useState } from 'react';
import './report.css';

function ReportIdiot({ onBack, onSuccess }) {
  const [plate, setPlate] = useState('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [availableViolations, setAvailableViolations] = useState([]);
  const [selectedViolations, setSelectedViolations] = useState([]);
  const [message, setMessage] = useState('');

  const savedUser = JSON.parse(localStorage.getItem('user')) || {};

  useEffect(() => {
    fetch('/api/violations').then(res => res.json())
      .then(data => setAvailableViolations(data.violations || []))
      .catch(() => setAvailableViolations([]));
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage('Submitting...');

    try {
      const formData = new FormData();
      formData.append('userId', savedUser._id);
      formData.append('plate', plate);
      formData.append('make', make);
      formData.append('model', model);
      if (imageFile) formData.append('image', imageFile);

      const res = await fetch('/api/cars', { method: 'POST', body: formData });
      const data = await res.json();

      for (const vId of selectedViolations) {
        const vName = availableViolations.find(v => v._id === vId).name;
        await fetch('/api/violations/car', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ carId: data.insertedId, violationId: vId, violationName: vName, userId: savedUser._id }),
        });
      }

      setMessage('Car reported successfully!');
      if (onSuccess) onSuccess();
    } catch (err) {
      setMessage('Failed to report car.');
    }
  }

  return (
    <main className="main-content">
      <h2>Report a Car</h2>
      <button type="button" onClick={onBack}>Back to My Cars</button>

      <form onSubmit={handleSubmit}>
        <input value={plate} onChange={(e) => setPlate(e.target.value)} placeholder="License Plate" required />
        <input value={make} onChange={(e) => setMake(e.target.value)} placeholder="Make" required />
        <input value={model} onChange={(e) => setModel(e.target.value)} placeholder="Model" required />

        {availableViolations.length > 0 && (
          <div className="violation-checkboxes">
            <p>Violation Types:</p>
            {availableViolations.map((item) => (
              <label key={item._id} className="violation-checkbox-label">
                <input
                  type="checkbox"
                  checked={selectedViolations.includes(item._id)}
                  onChange={() => {
                    selectedViolations.includes(item._id) 
                      ? setSelectedViolations(selectedViolations.filter(id => id !== item._id))
                      : setSelectedViolations([...selectedViolations, item._id]);
                  }}
                />
                {item.name}
              </label>
            ))}
          </div>
        )}

        <input type="file" accept="image/png, image/jpeg" onChange={(e) => setImageFile(e.target.files[0])} />
        <button type="submit">Submit Report</button>
      </form>
      <p>{message}</p>
    </main>
  );
}

export default ReportIdiot;