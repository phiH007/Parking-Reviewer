import { useState } from 'react';

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
                onLogin(data.user);
            }
        } catch {
            setError('Could not reach the server.');
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
<<<<<<< HEAD
            <h2>Login</h2>
            <form>
                <div>
                    <label for="usn">Username:</label>
                    <input type="text" id="usn" placeholder="Enter your username" />
                </div>
                <div>
                    <label for="password">Password:</label>
                    <input type="password" id="password" placeholder="Enter your password" />
                </div>
                <button type="submit">Login</button>
             </form>
=======
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
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    {message && <p style={{ color: 'green' }}>{message}</p>}
                    <button type="submit">{isRegister ? 'Register' : 'Login'}</button>
                </form>
                <p>
                    {isRegister ? 'Already have an account?' : "Don't have an account?"}
                    {' '}
                    <button
                        type="button"
                        onClick={() => { setIsRegister(!isRegister); setError(''); setMessage(''); }}
                        style={{ background: 'none', border: 'none', color: 'blue', cursor: 'pointer', padding: 0 }}
                    >
                        {isRegister ? 'Log in' : 'Register'}
                    </button>
                </p>
>>>>>>> adb74f5 (implement user authentication with login and registration features; add dotenv for environment variables; set up MongoDB connection; update frontend to handle user state)
            </div>
        </div>
    );
};

export default Login;
