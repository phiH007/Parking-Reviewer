import { useEffect, useState } from 'react';

function CarCard({ car, user, showDelete, onCarDeleted }) {
  const [violations, setViolations] = useState([]);
  const [votes, setVotes] = useState({ upvotes: 0, downvotes: 0, score: 0 });
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);

  // Load everything when the card mounts
  useEffect(() => {
    fetch(`/api/violations/car/${car._id}`).then(res => res.json()).then(data => setViolations(data.violations || []));
    fetch(`/api/votes/car/${car._id}`).then(res => res.json()).then(data => setVotes(data));
    fetch(`/api/comments/car/${car._id}`).then(res => res.json()).then(data => setComments(data.comments || []));
  }, [car._id]);

  async function handleVote(value) {
    if (!user) return alert("Log in to vote!");
    await fetch('/api/votes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ carId: car._id, userId: user._id, value })
    });
    // Refresh votes
    fetch(`/api/votes/car/${car._id}`).then(res => res.json()).then(data => setVotes(data));
  }

  async function handleComment(e) {
    e.preventDefault();
    if (!user) return alert("Log in to comment!");
    
    await fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ carId: car._id, userId: user._id, username: user.username, text: commentText })
    });
    
    setCommentText('');
    fetch(`/api/comments/car/${car._id}`).then(res => res.json()).then(data => setComments(data.comments || []));
  }

  async function handleDeleteComment(commentId) {
    if (!user) return;

    const response = await fetch(`/api/comments/${commentId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user._id, role: user.role })
    });

    const responseText = await response.text();

    if (response.ok) {
      setComments(comments.filter(comment => comment._id !== commentId));
    } else {
      alert(responseText);
    }
  }

  async function handleDelete() {
    if (!window.confirm('Delete this car?')) return;
    const response = await fetch(`/api/cars/${car._id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user._id, role: user.role })
    });

    if (response.ok) {
      if (onCarDeleted) onCarDeleted(car._id);
    } else {
      const responseText = await response.text();
      alert(responseText);
    }
  }

  const canDeleteCar = user && (String(car.userId) === String(user._id) || user.role === 'admin');

  return (
    <div className="main-card" style={{ position: 'relative' }}>
      {showDelete && canDeleteCar ? (
        <button className="delete-button card-delete-corner" onClick={handleDelete}>Delete</button>
      ) : <></>}

      <h3>{car.plate}</h3>
      {car.imagePath && <img src={`/${car.imagePath}`} alt="Car" className="car-report-image" />}
      <p>{car.make} {car.model}</p>

      <div className="violation-tags">
        {violations.map(v => <span className="violation-tag" key={v._id}>{v.violationName}</span>)}
      </div>

      <div className="card-section">
        <p>Votes: {votes.score} | Up: {votes.upvotes} | Down: {votes.downvotes}</p>
        <button onClick={() => handleVote(1)}>Upvote</button>
        <button onClick={() => handleVote(-1)}>Downvote</button>
      </div>

      <div className="card-section">
        <button onClick={() => setShowComments(!showComments)}>
          {showComments ? 'Hide comments' : `Comments (${comments.length})`}
        </button>
        
        {showComments && (
          <div>
            <form onSubmit={handleComment}>
              <input value={commentText} onChange={e => setCommentText(e.target.value)} placeholder="write a comment" required/>
              <button type="submit">+</button>
            </form>
            {comments.map(c => (
              <div key={c._id} className="comment-box">
                <div className="comment-row">
                  <div>
                    <b>{c.username}</b>: {c.text}
                  </div>

                  {user && (String(c.userId) === String(user._id) || user.role === 'admin') ? (
                    <button
                      type="button"
                      className="comment-delete-button"
                      onClick={() => handleDeleteComment(c._id)}
                    >
                      Delete
                    </button>
                  ) : <></>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CarCard;
