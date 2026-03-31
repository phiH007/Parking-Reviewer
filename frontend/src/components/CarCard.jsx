import React, { useEffect, useState } from 'react';

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
      {violations.map((violation) => (
        <span className="violation-tag" key={violation._id}>{violation.name}</span>
      ))}
    </div>
  );
};

const VoteSection = ({ carId, userId }) => {
  const [voteInfo, setVoteInfo] = useState({
    upvotes: 0,
    downvotes: 0,
    score: 0,
    currentUserVote: 0,
  });
  const [voteError, setVoteError] = useState('');

  const loadVotes = async () => {
    const query = userId ? `?userId=${userId}` : '';
    const res = await fetch(`/api/votes/car/${carId}${query}`);
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'Could not load votes.');
    }

    setVoteInfo(data);
  };

  useEffect(() => {
    loadVotes().catch((err) => setVoteError(err.message));
  }, [carId, userId]);

  const handleVote = async (value) => {
    if (!userId) {
      setVoteError('Log in to vote on a car.');
      return;
    }

    try {
      setVoteError('');

      const res = await fetch('/api/votes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ carId, userId, value }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Could not save vote.');
      }

      setVoteInfo(data);
    } catch (err) {
      setVoteError(err.message);
    }
  };

  return (
    <div className="card-section">
      <h4>Votes</h4>
      <div className="vote-row">
        <button
          type="button"
          className={`vote-button ${voteInfo.currentUserVote === 1 ? 'selected' : ''}`}
          onClick={() => handleVote(1)}
        >
          Upvote
        </button>
        <button
          type="button"
          className={`vote-button ${voteInfo.currentUserVote === -1 ? 'selected' : ''}`}
          onClick={() => handleVote(-1)}
        >
          Downvote
        </button>
      </div>
      <p className="vote-summary">
        Score: {voteInfo.score} | Upvotes: {voteInfo.upvotes} | Downvotes: {voteInfo.downvotes}
      </p>
      {voteError && <p className="card-message error-text">{voteError}</p>}
    </div>
  );
};

const CommentSection = ({ carId, userId }) => {
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [commentError, setCommentError] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [showCommentForm, setShowCommentForm] = useState(false);

  const handleDeleteComment = async (commentId) => {
    try {
      const res = await fetch(`/api/comments/${commentId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not delete comment.');
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch (err) {
      setCommentError(err.message);
    }
  };

  const loadComments = async () => {
    const res = await fetch(`/api/comments/car/${carId}`);
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'Could not load comments.');
    }

    setComments(data.comments || []);
  };

  useEffect(() => {
    loadComments().catch((err) => setCommentError(err.message));
  }, [carId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      setCommentError('Log in to leave a comment.');
      return;
    }

    try {
      setCommentError('');

      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          carId,
          userId,
          text: commentText,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Could not save comment.');
      }

      setComments((prev) => [data.comment, ...prev]);
      setCommentText('');
      setShowComments(true);
      setShowCommentForm(false);
    } catch (err) {
      setCommentError(err.message);
    }
  };

  return (
    <div className="card-section">
      <div className="comment-header">
        <button
          type="button"
          className="comment-toggle-button"
          onClick={() => setShowComments((prev) => !prev)}
        >
          {showComments ? 'Hide Comments' : `Show Comments (${comments.length})`}
        </button>
        <button
          type="button"
          className="comment-add-button"
          onClick={() => {
            setShowCommentForm((prev) => !prev);
            setCommentError('');
          }}
        >
          +
        </button>
      </div>

      {showCommentForm && (
        <form className="comment-form" onSubmit={handleSubmit}>
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write a short comment"
          />
          <button type="submit">Add Comment</button>
        </form>
      )}

      {commentError && <p className="card-message error-text">{commentError}</p>}

      {showComments && (
        comments.length === 0 ? (
          <p className="card-message">No comments yet.</p>
        ) : (
          <div className="comment-list">
            {comments.map((comment) => (
              <div className="comment-box" key={comment._id}>
                <p className="comment-name">{comment.username}</p>
                <p className="comment-text">{comment.text}</p>
                {comment.userId === userId && (
                  <button
                    type="button"
                    className="delete-button"
                    onClick={() => handleDeleteComment(comment._id)}
                  >
                    Delete
                  </button>
                )}
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
};

const CarCard = ({ car, userId, onCarDeleted, showDelete = false }) => {
  const [deleteError, setDeleteError] = useState('');

  const handleDeleteCar = async () => {
    if (!window.confirm('Are you sure you want to delete this submission?')) return;

    try {
      const res = await fetch(`/api/cars/${car._id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, requestingUserRole: 'user' }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not delete car.');

      if (onCarDeleted) onCarDeleted(car._id);
    } catch (err) {
      setDeleteError(err.message);
    }
  };

  return (
    <div className="main-card" style={{ position: 'relative' }}>
      {showDelete && car.userId === userId && (
        <button type="button" className="delete-button card-delete-corner" onClick={handleDeleteCar}>
          Delete
        </button>
      )}
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
      {deleteError && <p className="card-message error-text">{deleteError}</p>}
      <VoteSection carId={car._id} userId={userId} />
      <CommentSection carId={car._id} userId={userId} />
    </div>
  );
};

export default CarCard;
