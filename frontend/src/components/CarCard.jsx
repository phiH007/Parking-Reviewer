import React, { useEffect, useState } from 'react';

function ViolationTags({ carId }) {
  const [violations, setViolations] = useState([]);

  useEffect(() => {
    async function loadViolations() {
      try {
        const response = await fetch(`/api/violations/car/${carId}`);
        const data = await response.json();
        setViolations(data.violations || []);
      } catch (error) {
        setViolations([]);
      }
    }

    loadViolations();
  }, [carId]);

  if (violations.length === 0) {
    return null;
  }

  return (
    <div className="violation-tags">
      {violations.map((violation) => (
        <span className="violation-tag" key={violation._id}>
          {violation.name}
        </span>
      ))}
    </div>
  );
}

function VoteSection({ carId, userId }) {
  const [upvotes, setUpvotes] = useState(0);
  const [downvotes, setDownvotes] = useState(0);
  const [score, setScore] = useState(0);
  const [currentUserVote, setCurrentUserVote] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadVotes() {
      try {
        setError('');

        let url = `/api/votes/car/${carId}`;
        if (userId) {
          url = `${url}?userId=${userId}`;
        }

        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
          setError(data.error || 'Could not load votes.');
          return;
        }

        setUpvotes(data.upvotes || 0);
        setDownvotes(data.downvotes || 0);
        setScore(data.score || 0);
        setCurrentUserVote(data.currentUserVote || 0);
      } catch (loadError) {
        setError('Could not load votes.');
      }
    }

    loadVotes();
  }, [carId, userId]);

  async function handleVote(value) {
    if (!userId) {
      setError('Log in to vote on a car.');
      return;
    }

    try {
      setError('');

      const response = await fetch('/api/votes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ carId, userId, value }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Could not save vote.');
        return;
      }

      setUpvotes(data.upvotes || 0);
      setDownvotes(data.downvotes || 0);
      setScore(data.score || 0);
      setCurrentUserVote(data.currentUserVote || 0);
    } catch (saveError) {
      setError('Could not save vote.');
    }
  }

  return (
    <div className="card-section">
      <h4>Votes</h4>
      <div className="vote-row">
        <button
          type="button"
          className={`vote-button ${currentUserVote === 1 ? 'selected' : ''}`}
          onClick={() => handleVote(1)}
        >
          Upvote
        </button>
        <button
          type="button"
          className={`vote-button ${currentUserVote === -1 ? 'selected' : ''}`}
          onClick={() => handleVote(-1)}
        >
          Downvote
        </button>
      </div>
      <p className="vote-summary">
        Score: {score} | Upvotes: {upvotes} | Downvotes: {downvotes}
      </p>
      {error && <p className="card-message error-text">{error}</p>}
    </div>
  );
}

function CommentSection({ carId, userId }) {
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [error, setError] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [showCommentForm, setShowCommentForm] = useState(false);

  useEffect(() => {
    async function loadComments() {
      try {
        setError('');

        const response = await fetch(`/api/comments/car/${carId}`);
        const data = await response.json();

        if (!response.ok) {
          setError(data.error || 'Could not load comments.');
          return;
        }

        setComments(data.comments || []);
      } catch (loadError) {
        setError('Could not load comments.');
      }
    }

    loadComments();
  }, [carId]);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!userId) {
      setError('Log in to leave a comment.');
      return;
    }

    try {
      setError('');

      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          carId,
          userId,
          text: commentText,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Could not save comment.');
        return;
      }

      setComments([data.comment, ...comments]);
      setCommentText('');
      setShowComments(true);
      setShowCommentForm(false);
    } catch (saveError) {
      setError('Could not save comment.');
    }
  }

  async function handleDeleteComment(commentId) {
    try {
      setError('');

      const response = await fetch(`/api/comments/${commentId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Could not delete comment.');
        return;
      }

      const nextComments = comments.filter((comment) => comment._id !== commentId);
      setComments(nextComments);
    } catch (deleteError) {
      setError('Could not delete comment.');
    }
  }

  return (
    <div className="card-section">
      <div className="comment-header">
        <button
          type="button"
          className="comment-toggle-button"
          onClick={() => setShowComments(!showComments)}
        >
          {showComments ? 'Hide Comments' : `Show Comments (${comments.length})`}
        </button>

        <button
          type="button"
          className="comment-add-button"
          onClick={() => {
            setShowCommentForm(!showCommentForm);
            setError('');
          }}
        >
          +
        </button>
      </div>

      {showCommentForm && (
        <form className="comment-form" onSubmit={handleSubmit}>
          <textarea
            value={commentText}
            onChange={(event) => setCommentText(event.target.value)}
            placeholder="Write a short comment"
          />
          <button type="submit">Add Comment</button>
        </form>
      )}

      {error && <p className="card-message error-text">{error}</p>}

      {showComments && comments.length === 0 && (
        <p className="card-message">No comments yet.</p>
      )}

      {showComments && comments.length > 0 && (
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
      )}
    </div>
  );
}

function CarCard({ car, userId, onCarDeleted, showDelete = false }) {
  const [deleteError, setDeleteError] = useState('');

  async function handleDeleteCar() {
    const confirmed = window.confirm('Are you sure you want to delete this submission?');
    if (!confirmed) {
      return;
    }

    try {
      setDeleteError('');

      const response = await fetch(`/api/cars/${car._id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, requestingUserRole: 'user' }),
      });

      const data = await response.json();

      if (!response.ok) {
        setDeleteError(data.error || 'Could not delete car.');
        return;
      }

      if (onCarDeleted) {
        onCarDeleted(car._id);
      }
    } catch (error) {
      setDeleteError('Could not delete car.');
    }
  }

  return (
    <div className="main-card" style={{ position: 'relative' }}>
      {showDelete && car.userId === userId && (
        <button
          type="button"
          className="delete-button card-delete-corner"
          onClick={handleDeleteCar}
        >
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
      {car.reason && <p>{car.reason}</p>}

      <ViolationTags carId={car._id} />

      {deleteError && <p className="card-message error-text">{deleteError}</p>}

      <VoteSection carId={car._id} userId={userId} />
      <CommentSection carId={car._id} userId={userId} />
    </div>
  );
}

export default CarCard;
