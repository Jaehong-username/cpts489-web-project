import React, { useState } from 'react';
import '../index.css';

function HomePage() {
    const [isLoginVisible, setIsLoginVisible] = useState(true);
    
    // Login form state
    const [loginUsername, setLoginUsername] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    
    // Register form state
    const [registerForm, setRegisterForm] = useState({
        name: '',
        username: '',
        email: '',
        password: '',
        role: 'trucker', // Default role
        currentCity: '',
        capacity: '',
        company: '',
    });

    // Handle login submission
    const handleLoginSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!loginUsername) {
            alert("Username is required");
            return;
        }

        if (!loginPassword || loginPassword.length < 6) {
            alert("Password should be at least 6 characters");
            return;
        }

        try {
            // Replace with your actual API endpoint
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: loginUsername,
                    password: loginPassword
                }),
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Login failed');
            }
            
            // Store token in localStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            alert(`Login successful! Welcome, ${data.user.name}`);
            
            // Redirect based on role
            switch (data.user.role) {
                case 'trucker':
                    window.location.href = '/trucker-dashboard';
                    break;
                case 'broker':
                    window.location.href = '/broker-dashboard';
                    break;
                case 'admin':
                    window.location.href = '/admin-dashboard';
                    break;
                default:
                    window.location.href = '/';
            }
            
        } catch (error) {
            alert(error.message);
        }
    };

    // Handle register form changes
    const handleRegisterChange = (e) => {
        const { name, value } = e.target;
        setRegisterForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle register submission
    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        
        // Basic validation
        if (!registerForm.email.includes('@')) {
            alert("Please enter a valid email address");
            return;
        }

        if (registerForm.password.length < 6) {
            alert("Password should be at least 6 characters");
            return;
        }
        
        try {
            // Prepare registration data based on selected role
            const registrationData = {
                username: registerForm.username,
                email: registerForm.email,
                password: registerForm.password,
                name: registerForm.name,
                role: registerForm.role
            };
            
            // Add role-specific data
            if (registerForm.role === 'trucker') {
                registrationData.capacity = registerForm.capacity;
                registrationData.currentCity = registerForm.currentCity;
            } else if (registerForm.role === 'broker') {
                registrationData.company = registerForm.company;
            }
            
            // Replace with your actual API endpoint
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(registrationData),
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Registration failed');
            }
            
            alert("Registration successful! Please login.");
            setIsLoginVisible(true); // Go back to login view
            
        } catch (error) {
            alert(error.message);
        }
    };

    // Render role-specific registration fields
    const renderRoleSpecificFields = () => {
        switch (registerForm.role) {
            case 'trucker':
                return (
                    <>
                        <div className="input-box">
                            <input
                                type="text"
                                name="currentCity"
                                value={registerForm.currentCity}
                                onChange={handleRegisterChange}
                                required
                            />
                            <label>Current City</label>
                        </div>
                        <div className="input-box">
                            <input
                                type="text"
                                name="capacity"
                                value={registerForm.capacity}
                                onChange={handleRegisterChange}
                            />
                            <label>Truck Capacity</label>
                        </div>
                    </>
                );
            case 'broker':
                return (
                    <div className="input-box">
                        <input
                            type="text"
                            name="company"
                            value={registerForm.company}
                            onChange={handleRegisterChange}
                            required
                        />
                        <label>Company</label>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="main-content">
            {isLoginVisible ? (
                <div className="wrapper container-fluid" id="login">
                    <div className="form-box login">
                        <h2>Login</h2>
                        <form onSubmit={handleLoginSubmit}>
                            <div className="input-box">
                                <input
                                    type="text"
                                    required
                                    id="username"
                                    value={loginUsername}
                                    onChange={(e) => setLoginUsername(e.target.value)}
                                />
                                <label>Username</label>
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
                                <button type="button" className="btn">Forgot Password?</button>
                            </div>

                            <button type="submit" className="btn">Login</button>

                            <div className="register" id="signup">
                                <p>
                                    Don't have an account?
                                    <button type="button" className="signup-link btn" onClick={() => setIsLoginVisible(false)} style={{ cursor: 'pointer' }}>
                                        {" "}Sign up
                                    </button>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            ) : (
                <div className="wrapper container-fluid" id="register" style={{ height: 'auto', minHeight: '700px' }}>
                    <div className="form-box register justify-content-center">
                        <h2>Register</h2>
                        <form onSubmit={handleRegisterSubmit}>
                            <div className="input-box">
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={registerForm.name}
                                    onChange={handleRegisterChange}
                                />
                                <label>Full Name</label>
                            </div>

                            <div className="input-box">
                                <input
                                    type="text"
                                    name="username"
                                    required
                                    value={registerForm.username}
                                    onChange={handleRegisterChange}
                                />
                                <label>Username</label>
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

                            <div className="input-box">
                                <select
                                    name="role"
                                    value={registerForm.role}
                                    onChange={handleRegisterChange}
                                    style={{ width: '100%', padding: '10px', marginBottom: '5px' }}
                                >
                                    <option value="trucker">Trucker</option>
                                    <option value="broker">Broker</option>
                                </select>
                                <label style={{ top: '-20px', fontSize: '12px' }}>Role</label>
                            </div>

                            {renderRoleSpecificFields()}

                            <div className="forget">
                                <label style={{ color: 'rgba(0,0,0,.5)', fontWeight: 500 }}>
                                    <input type="checkbox" required /> I agree to the
                                    <button type="button" className="btn" style={{ padding: '10px' }}>terms & conditions</button>
                                </label>
                            </div>

                            <button type="submit" className="btn">Register</button>
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