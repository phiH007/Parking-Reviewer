import { useState } from 'react';
import './login.css';

function Login(props) {
  const onLogin = props.onLogin;

  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('standard');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  function handleUsernameChange(e) {
    setUsername(e.target.value);
  }

  function handlePasswordChange(e) {
    setPassword(e.target.value);
  }

  function handleToggleMode() {
    setIsRegister(!isRegister);
    setError('');
    setMessage('');
    setRole('standard');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setMessage('');

    let endpoint = '/api/auth/login';
    if (isRegister) {
      endpoint = '/api/auth/register';
    }

    try {
      const doc = {
        username: username,
        password: password,
      };

      if (isRegister) {
        doc.role = role;
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        body: JSON.stringify(doc),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const responseText = await response.text();

      if (responseText === "Invalid Login") {
        setError("Invalid username or password.");
        return;
      }
      if (responseText === "Error") {
        setError("Something went wrong on the server.");
        return;
      }

      const data = JSON.parse(responseText);

      if (isRegister) {
        setMessage('Account created! You can now log in.');
        setIsRegister(false);
        setRole('standard');
        return;
      }

      localStorage.setItem('user', JSON.stringify(data));
      onLogin(data); 

    } catch (errorObject) {
      console.error(errorObject);
      setError('Could not reach the server.');
    }
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>{isRegister ? 'Register' : 'Login'}</h2>

        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              placeholder="Enter your username"
              value={username}
              onChange={handleUsernameChange}
            />
          </div>

          <div>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={handlePasswordChange}
            />
          </div>

          {isRegister ? (
            <div>
              <label htmlFor="role">Role:</label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="standard">Standard</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          ) : <></>}

          {error ? <p className="login-error">{error}</p> : <></>}
          {message ? <p className="login-success">{message}</p> : <></>}

          <button type="submit">{isRegister ? 'Register' : 'Login'}</button>
        </form>

        <p>
          {isRegister ? 'Already have an account?' : "Don't have an account?"}
          {' '}
          <button
            type="button"
            onClick={handleToggleMode}
            className="login-toggle"
          >
            {isRegister ? 'Log in' : 'Register'}
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;
