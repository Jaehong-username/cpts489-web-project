import React, { useState } from 'react';
import '../index.css';

function HomePage() {
    const [isLoginVisible, setIsLoginVisible] = useState(true);

    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    const [registerForm, setRegisterForm] = useState({
        firstName: '',
        lastName: '',
        location: '',
        occupation: '',
        email: '',
        password: '',
    });

    const validateEmail = (e) => {
        e.preventDefault();

        const email = loginEmail;
        const password = loginPassword;

        let email_valid = email.includes('@');
        if (!email_valid) {
            alert("Email is bad. Fix it!\n");
        }

        let password_valid = password.length > 10;
        if (!password_valid) {
            alert("Password should be longer than 10 characters. Fix it!\n");
        }

        if (email_valid && password_valid) {
            alert("Login successful (at least passed validation)");
            // Handle login
        }
    };

    const handleRegisterChange = (e) => {
        const { name, value } = e.target;
        setRegisterForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleRegisterSubmit = (e) => {
        e.preventDefault();
        alert("Register submitted (no validation yet)");
        // Add validation or backend logic here
        setIsLoginVisible(true); // Go back to login view
    };

    return (
        <div className="main-content">
            {isLoginVisible ? (
                <div className="wrapper container-fluid" id="login">
                    <div className="form-box login">
                        <h2>Login</h2>
                        <form onSubmit={validateEmail}>
                            <div className="input-box">
                                <input
                                    type="email"
                                    required
                                    id="email"
                                    value={loginEmail}
                                    onChange={(e) => setLoginEmail(e.target.value)}
                                />
                                <label>Email</label>
                            </div>

                            <div className="input-box">
                                <span className="icon"></span>
                                <input
                                    type="password"
                                    required
                                    id="password"
                                    value={loginPassword}
                                    onChange={(e) => setLoginPassword(e.target.value)}
                                />
                                <label>Password</label>
                            </div>

                            <div className="forget">
                                <label style={{ color: 'rgba(0,0,0,.5)', fontWeight: 500 }}>
                                    <input type="checkbox" /> Remember me
                                </label>
                                <br />
                                <button className="btn">Forgot Password?</button>
                            </div>

                            <button type="submit" className="btn">Login</button>

                            <div className="register" id="signup">
                                <p>
                                    Don't have an account?
                                    <button className="signup-link btn" onClick={() => setIsLoginVisible(false)} style={{ cursor: 'pointer' }}>
                                        {" "}Sign up
                                    </button>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            ) : (
                <div className="wrapper container-fluid" id="register" style={{ height: '700px' }}>
                    <div className="form-box register justify-content-center">
                        <h2>Register</h2>
                        <form onSubmit={handleRegisterSubmit}>
                            <div className="input-box">
                                <input
                                    type="text"
                                    name="firstName"
                                    required
                                    value={registerForm.firstName}
                                    onChange={handleRegisterChange}
                                />
                                <label>First Name</label>
                            </div>

                            <div className="input-box">
                                <input
                                    type="text"
                                    name="lastName"
                                    required
                                    value={registerForm.lastName}
                                    onChange={handleRegisterChange}
                                />
                                <label>Last Name</label>
                            </div>

                            <div className="input-box">
                                <input
                                    type="text"
                                    name="location"
                                    required
                                    value={registerForm.location}
                                    onChange={handleRegisterChange}
                                />
                                <label>Location (i.e. Pullman, WA)</label>
                            </div>

                            <div className="input-box">
                                <input
                                    type="text"
                                    name="occupation"
                                    required
                                    value={registerForm.occupation}
                                    onChange={handleRegisterChange}
                                />
                                <label>Occupation (i.e. Trucker, Broker, Brokerage)</label>
                            </div>

                            <div className="input-box">
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={registerForm.email}
                                    onChange={handleRegisterChange}
                                />
                                <label>Email</label>
                            </div>

                            <div className="input-box">
                                <span className="icon"></span>
                                <input
                                    type="password"
                                    name="password"
                                    required
                                    value={registerForm.password}
                                    onChange={handleRegisterChange}
                                />
                                <label>Password</label>
                            </div>

                            <div className="forget">
                                <label style={{ color: 'rgba(0,0,0,.5)', fontWeight: 500 }}>
                                    <input type="checkbox" /> I agree to the
                                    <button className="btn" style={{ padding: '10px' }}>terms & conditions</button>
                                </label>
                            </div>

                            <button type="submit" className="btn">Sign in</button>
                        </form>
                        <p style={{ marginBottom: '50px', cursor: 'pointer' }} onClick={() => setIsLoginVisible(true)}>
                            Already have an account? <u>Go back to login</u>
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default HomePage;
