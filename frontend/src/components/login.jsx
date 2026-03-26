const Login = () => {
    return (
        <div className="login-container">
            <div className="login-box">
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
            </div>
        </div>
    );
};

export default Login