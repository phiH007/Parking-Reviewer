import { useState } from 'react';
import './login.css';

const Login = ({ onLogin }) => {
    const [isRegister, setIsRegister] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';

        try {
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Something went wrong.');
                return;
            }

            if (isRegister) {
                setMessage('Account created! You can now log in.');
                setIsRegister(false);
            } else {
                localStorage.setItem('user', JSON.stringify(data.user));
                onLogin(data.user);
            }
        } catch {
            setError('Could not reach the server.');
        }
    };

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
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    {error && <p className="login-error">{error}</p>}
                    {message && <p className="login-success">{message}</p>}
                    <button type="submit">{isRegister ? 'Register' : 'Login'}</button>
                </form>
                <p>
                    {isRegister ? 'Already have an account?' : "Don't have an account?"}
                    {' '}
                    <button
                        type="button"
                        onClick={() => { setIsRegister(!isRegister); setError(''); setMessage(''); }}
                        className="login-toggle"
                    >
                        {isRegister ? 'Log in' : 'Register'}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Login;
