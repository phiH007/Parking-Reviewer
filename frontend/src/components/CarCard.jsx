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
    
    // MVP: We pass the username directly to the backend!
    await fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ carId: car._id, userId: user._id, username: user.username, text: commentText })
    });
    
    setCommentText('');
    fetch(`/api/comments/car/${car._id}`).then(res => res.json()).then(data => setComments(data.comments || []));
  }

  async function handleDelete() {
    if (!window.confirm('Delete this car?')) return;
    await fetch(`/api/cars/${car._id}`, { method: 'DELETE' });
    if (onCarDeleted) onCarDeleted(car._id);
  }

  return (
    <div className="main-card" style={{ position: 'relative' }}>
      {showDelete && car.userId === user?._id && (
        <button className="delete-button card-delete-corner" onClick={handleDelete}>Delete</button>
      )}

      <h3>{car.plate}</h3>
      {car.imageUrl && <img src={car.imageUrl} alt="Car" className="car-report-image" />}
      <p>{car.make} {car.model}</p>

      <div className="violation-tags">
        {violations.map(v => <span className="violation-tag" key={v._id}>{v.violationName}</span>)}
      </div>

      <div className="card-section">
        <p>Score: {votes.score} | Up: {votes.upvotes} | Down: {votes.downvotes}</p>
        <button onClick={() => handleVote(1)}>Upvote</button>
        <button onClick={() => handleVote(-1)}>Downvote</button>
      </div>

      <div className="card-section">
        <button onClick={() => setShowComments(!showComments)}>
          {showComments ? 'Hide Comments' : `Show Comments (${comments.length})`}
        </button>
        
        {showComments && (
          <div>
            <form onSubmit={handleComment}>
              <input value={commentText} onChange={e => setCommentText(e.target.value)} placeholder="Add comment..." required/>
              <button type="submit">+</button>
            </form>
            {comments.map(c => (
              <div key={c._id} className="comment-box">
                <b>{c.username}</b>: {c.text}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CarCard;