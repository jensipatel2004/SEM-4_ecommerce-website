import React, { useState } from 'react';
import './style.css';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../../Server';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSeller, setIsSeller] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate(); // Hook to programmatically navigate

    const handleLogin = async () => {
        if (!email || !password) {
            setErrorMessage("Email and Password are required.");
            return;
        }
    
        setErrorMessage('');
        try {
            const data = await login(email, password, isSeller); // Await the login function
            if (data.message) {
                alert(data.message);
                // Store user details in local storage
                console.log(data.id)
                localStorage.setItem('user_id', data.id);
                localStorage.setItem('user_name', data.name);
                if (isSeller){
                    navigate('/admin'); // Navigate to a different route after login
                }else{
                    navigate('/'); // Navigate to a different route after login
                }
            } else {
                setErrorMessage("Invalid email or password.");
            }
        } catch (error) {
            console.error('Fetch error:', error);
            setErrorMessage('Failed to log in. Please try again.');
        }
    };
    
    return (
        <>
            <div className='row g-0 vh-100 justify-content-center align-items-center mt-2'>
                <div className='col-10 row g-0 align-items-center border rounded-2'>
                    <div className='col-6'>
                        <h1 className='text1'>WELCOME BACK!!</h1>
                        <img src="https://img.freepik.com/premium-vector/people-with-portable-electronic-devices_178888-354.jpg" alt="computer-logo" className='img-1' />
                    </div>

                    <div className='col-6 py-4 px-3'>
                        <form>
                            <h4 className='login-title text-center py-2 mb-2'>
                                {isSeller ? 'Seller Login' : 'Login'}
                            </h4>
                            {errorMessage && <div className="alert alert-danger text-center">{errorMessage}</div>}
                            <div className='form-floating mb-3'>
                                <input
                                    type='email'
                                    className='form-control'
                                    id='email'
                                    placeholder='name@example.com'
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <label htmlFor='email'>Email</label>
                            </div>
                            <div className='form-floating mb-3'>
                                <input
                                    type='password'
                                    className='form-control'
                                    id='password'
                                    placeholder='password'
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <label htmlFor='password'>Password</label>
                            </div>
                            <div className='form-check mb-3'>
                                <input
                                    type='checkbox'
                                    className='form-check-input'
                                    id='sellerAccount'
                                    checked={isSeller}
                                    onChange={() => setIsSeller(prev => !prev)}
                                />
                                <label className='form-check-label' htmlFor='sellerAccount'>
                                    If login by Seller Account
                                </label>
                            </div>
                            <div className='text-center'>
                                <button
                                    type='button'
                                    className='login-btn py-3 rounded-3'
                                    onClick={handleLogin}
                                >
                                    Login
                                </button>
                            </div>
                            <div className='text-center mt-3'>
                                Not Registered? <Link to='/signup'>Sign Up</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Login;
