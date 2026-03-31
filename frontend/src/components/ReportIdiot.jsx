import { useEffect, useState } from 'react';

function ReportIdiot(props) {
  const onBack = props.onBack;
  const onSuccess = props.onSuccess;

  const [plate, setPlate] = useState('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');
  const [availableViolations, setAvailableViolations] = useState([]);
  const [selectedViolations, setSelectedViolations] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const savedUser = JSON.parse(localStorage.getItem('user'));
  const userId = savedUser ? savedUser.id : '';

  useEffect(() => {
    async function fetchViolations() {
      try {
        const response = await fetch('/api/violations');
        const theJson = await response.json();
        setAvailableViolations(theJson.violations || []);
      } catch (errorObject) {
        setAvailableViolations([]);
      }
    }

    fetchViolations();
  }, []);

  function handlePlateChange(e) {
    setPlate(e.target.value);
  }

  function handleMakeChange(e) {
    setMake(e.target.value);
  }

  function handleModelChange(e) {
    setModel(e.target.value);
  }

  function handleImageChange(e) {
    const file = e.target.files ? e.target.files[0] : null;

    if (!file) {
      setImageFile(null);
      setImagePreviewUrl('');
      return;
    }

    if (file.type !== 'image/png' && file.type !== 'image/jpeg') {
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
  }

  function handleViolationToggle(violationId) {
    if (selectedViolations.includes(violationId)) {
      setSelectedViolations(selectedViolations.filter((item) => item !== violationId));
      return;
    }

    setSelectedViolations([...selectedViolations, violationId]);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const formData = new FormData();
      formData.append('userId', userId);
      formData.append('plate', plate);
      formData.append('make', make);
      formData.append('model', model);

      if (imageFile) {
        formData.append('image', imageFile);
      }

      const response = await fetch('/api/cars', {
        method: 'POST',
        body: formData,
      });

      const theJson = await response.json();

      if (!response.ok) {
        setError(theJson.error || 'Failed to report car');
        return;
      }

      for (const violationId of selectedViolations) {
        await fetch('/api/violations/car', {
          method: 'POST',
          body: JSON.stringify({
            carId: theJson.carId,
            violationId: violationId,
            userId: userId,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }

      setMessage('Car reported successfully.');
      setPlate('');
      setMake('');
      setModel('');
      setImageFile(null);
      setImagePreviewUrl('');
      setSelectedViolations([]);

      if (onSuccess) {
        onSuccess();
      }
    } catch (errorObject) {
      setError('Failed to report car');
    }
  }

  return (
    <main className="main-content">
      <h2>Report a Car</h2>

      <button type="button" onClick={onBack}>
        Back to My Cars
      </button>

      <form onSubmit={handleSubmit}>
        <input
          name="plate"
          value={plate}
          onChange={handlePlateChange}
          placeholder="License Plate"
        />

        <input
          name="make"
          value={make}
          onChange={handleMakeChange}
          placeholder="Make"
        />

        <input
          name="model"
          value={model}
          onChange={handleModelChange}
          placeholder="Model"
        />

        {availableViolations.length > 0 ? (
          <div className="violation-checkboxes">
            <p>Violation Types:</p>

            {availableViolations.map((item) => (
              <label key={item._id} className="violation-checkbox-label">
                <input
                  type="checkbox"
                  checked={selectedViolations.includes(item._id)}
                  onChange={() => handleViolationToggle(item._id)}
                />
                {item.name}
              </label>
            ))}
          </div>
        ) : <></>}

        <input
          type="file"
          accept=".png,.jpg,.jpeg,image/png,image/jpeg"
          onChange={handleImageChange}
        />

        {imagePreviewUrl ? (
          <div className="report-image-preview">
            <img
              src={imagePreviewUrl}
              alt="Selected car"
              className="car-report-image"
            />
            <p>{imageFile ? imageFile.name : ''}</p>
          </div>
        ) : <></>}

        <button type="submit">Submit Report</button>
      </form>

      {message ? <p>{message}</p> : <></>}
      {error ? <p>{error}</p> : <></>}
    </main>
  );
}

export default ReportIdiot;
