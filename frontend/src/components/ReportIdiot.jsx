import React, { useState, useEffect } from 'react';

const ReportIdiot = ({ onBack, onSuccess }) => {
  const [formData, setFormData] = useState({
    plate: '',
    make: '',
    model: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');
  const [availableViolations, setAvailableViolations] = useState([]);
  const [selectedViolations, setSelectedViolations] = useState([]);

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/violations')
      .then((res) => res.json())
      .then((data) => setAvailableViolations(data.violations || []));
  }, []);

  const savedUser = JSON.parse(localStorage.getItem('user'));
  const userId = savedUser?.id;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      setImageFile(null);
      setImagePreviewUrl('');
      return;
    }

    if (!['image/png', 'image/jpeg'].includes(file.type)) {
      setError('Please upload a PNG or JPG image.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Please upload an image smaller than 5 MB.');
      return;
    }

    setError('');
    setImageFile(file);
    setImagePreviewUrl(URL.createObjectURL(file));
  };

  const handleViolationToggle = (violationId) => {
    setSelectedViolations((prev) =>
      prev.includes(violationId)
        ? prev.filter((id) => id !== violationId)
        : [...prev, violationId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const payload = new FormData();
      payload.append('userId', userId);
      payload.append('plate', formData.plate);
      payload.append('make', formData.make);
      payload.append('model', formData.model);
      if (imageFile) {
        payload.append('image', imageFile);
      }

      const res = await fetch('/api/cars', {
        method: 'POST',
        body: payload,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to report car');
      }

      // Tag selected violations on the new car
      await Promise.all(
        selectedViolations.map((violationId) =>
          fetch('/api/violations/car', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ carId: data.carId, violationId, userId }),
          })
        )
      );

      setMessage('Car reported successfully.');
      setFormData({ plate: '', make: '', model: '' });
      setImageFile(null);
      setImagePreviewUrl('');
      setSelectedViolations([]);

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main className="main-content">
      <h2>Report a Car</h2>

      <button type="button" onClick={onBack}>
        Back to My Cars
      </button>

      <form onSubmit={handleSubmit}>
        <input
          name="plate"
          value={formData.plate}
          onChange={handleChange}
          placeholder="License Plate"
        />
        <input
          name="make"
          value={formData.make}
          onChange={handleChange}
          placeholder="Make"
        />
        <input
          name="model"
          value={formData.model}
          onChange={handleChange}
          placeholder="Model"
        />
        {availableViolations.length > 0 && (
          <div className="violation-checkboxes">
            <p>Violation Types:</p>
            {availableViolations.map((v) => (
              <label key={v._id} className="violation-checkbox-label">
                <input
                  type="checkbox"
                  checked={selectedViolations.includes(v._id)}
                  onChange={() => handleViolationToggle(v._id)}
                />
                {v.name}
              </label>
            ))}
          </div>
        )}
        <input
          type="file"
          accept=".png,.jpg,.jpeg,image/png,image/jpeg"
          onChange={handleImageChange}
        />
        {imagePreviewUrl && (
          <div className="report-image-preview">
            <img src={imagePreviewUrl} alt="Selected car" className="car-report-image" />
            <p>{imageFile?.name}</p>
          </div>
        )}
        <button type="submit">Submit Report</button>
      </form>

      {message && <p>{message}</p>}
      {error && <p>{error}</p>}
    </main>
  );
};

export default ReportIdiot;
