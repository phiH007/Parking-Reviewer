import { useEffect, useState } from 'react';

function ViolationTags(props) {
  const carId = props.carId;
  const [violations, setViolations] = useState([]);

  useEffect(() => {
    async function fetchViolations() {
      try {
        const response = await fetch(`/api/violations/car/${carId}`);
        const theJson = await response.json();
        setViolations(theJson.violations || []);
      } catch (error) {
        setViolations([]);
      }
    }

    fetchViolations();
  }, [carId]);

  if (violations.length === 0) {
    return <></>;
  }

  return (
    <div className="violation-tags">
      {violations.map((item) => (
        <span className="violation-tag" key={item._id}>{item.name}</span>
      ))}
    </div>
  );
}

function VoteSection(props) {
  const carId = props.carId;
  const userId = props.userId;

  const [upvotes, setUpvotes] = useState(0);
  const [downvotes, setDownvotes] = useState(0);
  const [score, setScore] = useState(0);
  const [currentUserVote, setCurrentUserVote] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchVotes() {
      try {
        let url = `/api/votes/car/${carId}`;

        if (userId) {
          url = `/api/votes/car/${carId}?userId=${userId}`;
        }

        const response = await fetch(url);
        const theJson = await response.json();

        if (!response.ok) {
          setError(theJson.error || 'Could not load votes.');
          return;
        }

        setError('');
        setUpvotes(theJson.upvotes || 0);
        setDownvotes(theJson.downvotes || 0);
        setScore(theJson.score || 0);
        setCurrentUserVote(theJson.currentUserVote || 0);
      } catch (loadError) {
        setError('Could not load votes.');
      }
    }

    fetchVotes();
  }, [carId, userId]);

  async function saveVote(value) {
    if (!userId) {
      setError('Log in to vote on a car.');
      return;
    }

    try {
      const doc = {
        carId: carId,
        userId: userId,
        value: value,
      };

      const response = await fetch('/api/votes', {
        method: 'POST',
        body: JSON.stringify(doc),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const theJson = await response.json();

      if (!response.ok) {
        setError(theJson.error || 'Could not save vote.');
        return;
      }

      setError('');
      setUpvotes(theJson.upvotes || 0);
      setDownvotes(theJson.downvotes || 0);
      setScore(theJson.score || 0);
      setCurrentUserVote(theJson.currentUserVote || 0);
    } catch (saveError) {
      setError('Could not save vote.');
    }
  }

  function handleUpvoteClick() {
    saveVote(1);
  }

  function handleDownvoteClick() {
    saveVote(-1);
  }

  return (
    <div className="card-section">
      <h4>Votes</h4>

      <div className="vote-row">
        <button
          type="button"
          className={`vote-button ${currentUserVote === 1 ? 'selected' : ''}`}
          onClick={handleUpvoteClick}
        >
          Upvote
        </button>

        <button
          type="button"
          className={`vote-button ${currentUserVote === -1 ? 'selected' : ''}`}
          onClick={handleDownvoteClick}
        >
          Downvote
        </button>
      </div>

      <p className="vote-summary">
        Score: {score} | Upvotes: {upvotes} | Downvotes: {downvotes}
      </p>

      {error ? <p className="card-message error-text">{error}</p> : <></>}
    </div>
  );
}

function CommentSection(props) {
  const carId = props.carId;
  const userId = props.userId;

  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [error, setError] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [showCommentForm, setShowCommentForm] = useState(false);

  useEffect(() => {
    async function fetchComments() {
      try {
        const response = await fetch(`/api/comments/car/${carId}`);
        const theJson = await response.json();

        if (!response.ok) {
          setError(theJson.error || 'Could not load comments.');
          return;
        }

        setError('');
        setComments(theJson.comments || []);
      } catch (loadError) {
        setError('Could not load comments.');
      }
    }

    fetchComments();
  }, [carId]);

  function handleCommentTextChange(e) {
    setCommentText(e.target.value);
  }

  function handleToggleComments() {
    setShowComments(!showComments);
  }

  function handleToggleCommentForm() {
    setShowCommentForm(!showCommentForm);
    setError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!userId) {
      setError('Log in to leave a comment.');
      return;
    }

    try {
      const doc = {
        carId: carId,
        userId: userId,
        text: commentText,
      };

      const response = await fetch('/api/comments', {
        method: 'POST',
        body: JSON.stringify(doc),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const theJson = await response.json();

      if (!response.ok) {
        setError(theJson.error || 'Could not save comment.');
        return;
      }

      setError('');
      setComments([theJson.comment, ...comments]);
      setCommentText('');
      setShowComments(true);
      setShowCommentForm(false);
    } catch (saveError) {
      setError('Could not save comment.');
    }
  }

  async function handleDeleteComment(commentId) {
    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: 'DELETE',
        body: JSON.stringify({ userId: userId }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const theJson = await response.json();

      if (!response.ok) {
        setError(theJson.error || 'Could not delete comment.');
        return;
      }

      setError('');
      setComments(comments.filter((item) => item._id !== commentId));
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
          onClick={handleToggleComments}
        >
          {showComments ? 'Hide Comments' : `Show Comments (${comments.length})`}
        </button>

        <button
          type="button"
          className="comment-add-button"
          onClick={handleToggleCommentForm}
        >
          +
        </button>
      </div>

      {showCommentForm ? (
        <form className="comment-form" onSubmit={handleSubmit}>
          <textarea
            value={commentText}
            onChange={handleCommentTextChange}
            placeholder="Write a short comment"
          />
          <button type="submit">Add Comment</button>
        </form>
      ) : <></>}

      {error ? <p className="card-message error-text">{error}</p> : <></>}

      {showComments ? (
        comments.length === 0 ? (
          <p className="card-message">No comments yet.</p>
        ) : (
          <div className="comment-list">
            {comments.map((item) => (
              <div className="comment-box" key={item._id}>
                <p className="comment-name">{item.username}</p>
                <p className="comment-text">{item.text}</p>

                {item.userId === userId ? (
                  <button
                    type="button"
                    className="delete-button"
                    onClick={() => handleDeleteComment(item._id)}
                  >
                    Delete
                  </button>
                ) : <></>}
              </div>
            ))}
          </div>
        )
      ) : <></>}
    </div>
  );
}

function CarCard(props) {
  const car = props.car;
  const userId = props.userId;
  const onCarDeleted = props.onCarDeleted;
  const showDelete = props.showDelete || false;

  const [deleteError, setDeleteError] = useState('');

  async function handleDeleteCar() {
    const confirmed = window.confirm('Are you sure you want to delete this submission?');

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(`/api/cars/${car._id}`, {
        method: 'DELETE',
        body: JSON.stringify({
          userId: userId,
          requestingUserRole: 'user',
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const theJson = await response.json();

      if (!response.ok) {
        setDeleteError(theJson.error || 'Could not delete car.');
        return;
      }

      setDeleteError('');

      if (onCarDeleted) {
        onCarDeleted(car._id);
      }
    } catch (error) {
      setDeleteError('Could not delete car.');
    }
  }

  return (
    <div className="main-card" style={{ position: 'relative' }}>
      {showDelete && car.userId === userId ? (
        <button
          type="button"
          className="delete-button card-delete-corner"
          onClick={handleDeleteCar}
        >
          Delete
        </button>
      ) : <></>}

      <h3>{car.plate}</h3>

      {car.imageUrl ? (
        <img
          src={car.imageUrl}
          alt={`${car.make} ${car.model}`}
          className="car-report-image"
        />
      ) : <></>}

      <p>{car.make} {car.model}</p>
      {car.reason ? <p>{car.reason}</p> : <></>}

      <ViolationTags carId={car._id} />

      {deleteError ? <p className="card-message error-text">{deleteError}</p> : <></>}

      <VoteSection carId={car._id} userId={userId} />
      <CommentSection carId={car._id} userId={userId} />
    </div>
  );
}

export default CarCard;
