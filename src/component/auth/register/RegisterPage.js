import React, { useEffect, useState } from 'react';
// Header and Footer removed for auth pages
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { BASE_URL } from '../../../config/api';
import './RegisterPage.css';
import './RegisterPage.css';
import './RegisterPage.css';

const RegisterPage = () => {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [load, setLoad] = useState(true);

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        }, 1000);
        
        // no biometric initialization (feature removed)
    }, []);
    // biometric/face-recognition support removed — registration uses email/password only

    const [inputs, setInputs] = useState({
        userName: "",
        email: "",
        password: "",
        role: "user",
        adminSecretKey: "",
        phoneNumber: "",
        address: "",
        dob: "",
        gender: "",
        district: ""
    });

    const [errors, setErrors] = useState({
        userName: '',
        email: '',
        password: '',
        role: '',
        adminSecretKey: '',
        phoneNumber: '',
        dob: '',
        gender: '',
        district: ''
    });

    const handleChange = (event) => {
        event.persist();
        setInputs({ ...inputs, [event.target.name]: event.target.value });
        setErrors({ ...errors, [event.target.name]: '' });
    };

    const validateForm = () => {
        let valid = true;
        const newErrors = { userName: '', email: '', password: '', phoneNumber: '', dob: '', gender: '', district: '' };

        if (!inputs.userName.trim()) {
            newErrors.userName = 'User Name is required';
            valid = false;
        }

        if (!inputs.email.trim()) {
            newErrors.email = 'Email is required';
            valid = false;
        } else if (!isValidEmail(inputs.email)) {
            newErrors.email = 'Invalid email address';
            valid = false;
        }

        if (!inputs.password.trim()) {
            newErrors.password = 'Password is required';
            valid = false;
        }

        if (!inputs.phoneNumber.trim()) {
            newErrors.phoneNumber = 'Phone Number is required';
            valid = false;
        }

        if (!inputs.dob.trim()) {
            newErrors.dob = 'Date of Birth is required';
            valid = false;
        } else {
            // Age verification - must be at least 18 years old
            const birthDate = new Date(inputs.dob);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }

            if (age < 18) {
                newErrors.dob = 'You must be at least 18 years old to register';
                valid = false;
            }
        }

        if (!inputs.gender.trim()) {
            newErrors.gender = 'Gender is required';
            valid = false;
        }

        if (!inputs.district.trim()) {
            newErrors.district = 'District is required';
            valid = false;
        }

        // Validate admin secret key if registering as admin
        if (inputs.role === 'admin' && !inputs.adminSecretKey.trim()) {
            newErrors.adminSecretKey = 'Admin Secret Key is required for admin registration';
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const isValidEmail = (email) => {
        // Basic email validation, you may need a more comprehensive solution
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();

        if (!validateForm()) {
            // Show specific error for age restriction
            if (errors.dob && errors.dob.includes('18 years old')) {
                Swal.fire({
                    icon: 'error',
                    title: 'Age Restriction',
                    text: 'You must be at least 18 years old to register for voting.',
                    confirmButtonText: 'Ok'
                });
            }
            return;
        }

        // Prepare payload compatible with backend /api/auth/register
        const payload = {
            name: inputs.userName,
            email: inputs.email,
            password: inputs.password,
            role: inputs.role,
            phoneNumber: inputs.phoneNumber,
            address: inputs.address,
            dob: inputs.dob,
            gender: inputs.gender,
            district: inputs.district
        };

        // Add admin secret key to payload if registering as admin
        if (inputs.role === 'admin') {
            payload.adminSecretKey = inputs.adminSecretKey;
        }

        setLoad(false);

        try {
            const res = await axios.post(`${BASE_URL}/api/auth/register`, payload);

            if (res?.data?.token) {
                const { token, user } = res.data;

                // set default Authorization header for subsequent requests
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

                setLoad(true);

                // Store token and user consistently
                localStorage.setItem('token', token);
                localStorage.setItem('userData', JSON.stringify(user));
                localStorage.setItem('id', user.id || user._id);
                localStorage.setItem('role', user.role);

                // Notify other open tabs/components that user data was updated
                try {
                    window.dispatchEvent(new Event('userDataUpdated'));
                } catch (err) {
                    // ignore in older browsers
                }

                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'User Registration Successfully',
                    showConfirmButton: false,
                    timer: 1500
                });

                // Navigate based on user role
                if (user.role === 'admin') {
                    navigate('/admin/dashboard');
                } else {
                    navigate('/voter/dashboard');
                }
            } else {
                throw new Error('Registration failed');
            }
        } catch (e) {
            setLoad(true);
            // Backend may return validation errors as { errors: [ { msg } ] }
            const serverValidation = e.response?.data?.errors?.[0]?.msg;
            // or single message formats { msg } or { message }
            const serverMsg = serverValidation || e.response?.data?.msg || e.response?.data?.message;
            const message = serverMsg || e.message || 'An error occurred';
            
            // Display the actual error message from the backend
            Swal.fire({ 
                title: 'Warning !', 
                icon: 'warning', 
                text: message, 
                confirmButtonText: 'Ok!' 
            });
        }
    };

    return (
                <div className="register-page-container">
            {loading ? (
                <div className="register-loading-container">
                    <div className="loading-text">Loading...</div>
                </div>
            ) : (
                <>
                    {/* Header intentionally removed for auth pages */}
                    <div className="container mt-2">
                        <div className="row justify-content-center">
                            <div className="col-md-10 col-lg-8 mb-2">
                                <div className="register-card">
                                    <div className="register-card-header">
                                        <div className="register-header-icon">
                                            <i className="fas fa-user-plus"></i>
                                        </div>
                                        <h1 className="display-5 fw-bold mb-2">Create Your Account</h1>
                                        <p className="mb-0 opacity-75">Join us with Advanced Face Recognition Security</p>
                                    </div>
                                    <div className="auth-card-body">
                                        {/* Face recognition feature removed */}

                                        {/* Registration Form */}
                                        <form className="row g-3" onSubmit={handleFormSubmit}>
                                            {/* Personal Information Section */}
                                            <div className="col-12 mb-3">
                                                <h6 className="text-primary fw-bold border-bottom pb-2">
                                                    <i className="fas fa-user me-2"></i>
                                                    Personal Information
                                                </h6>
                                            </div>

                                            <div className="col-md-6">
                                                <label htmlFor="userName" className="form-label fw-semibold">
                                                    <i className="fas fa-id-card me-2 text-muted"></i>
                                                    Full Name <span className="text-danger">*</span>
                                                </label>
                                                <input type="text" className={`form-control form-control-lg ${errors.userName && 'is-invalid'}`} id="userName" name='userName' value={inputs.userName} onChange={handleChange} placeholder='Enter your full name' />
                                                {errors.userName && <div className="invalid-feedback">{errors.userName}</div>}
                                            </div>

                                            <div className="col-md-6">
                                                <label htmlFor="inputEmail4" className="form-label fw-semibold">
                                                    <i className="fas fa-envelope me-2 text-muted"></i>
                                                    Email Address <span className="text-danger">*</span>
                                                </label>
                                                <input type="text" className={`form-control form-control-lg text-lowercase ${errors.email && 'is-invalid'}`} id="inputEmail4" name='email' value={inputs.email} onChange={handleChange} placeholder='Enter your email address' />
                                                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                                            </div>

                                            <div className="col-md-6">
                                                <label htmlFor="inputPassword4" className="form-label fw-semibold">
                                                    <i className="fas fa-lock me-2 text-muted"></i>
                                                    Password <span className="text-danger">*</span>
                                                </label>
                                                <input type="password" className={`form-control form-control-lg ${errors.password && 'is-invalid'}`} id="inputPassword4" name='password' value={inputs.password} onChange={handleChange} placeholder='Create a secure password' />
                                                {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                                            </div>

                                            <div className="col-md-6">
                                                <label htmlFor="role" className="form-label fw-semibold">
                                                    <i className="fas fa-user-tag me-2 text-muted"></i>
                                                    Register As <span className="text-danger">*</span>
                                                </label>
                                                <select className={`form-select form-select-lg ${errors.role && 'is-invalid'}`} id="role" name='role' value={inputs.role} onChange={handleChange}>
                                                    <option value="user">Voter</option>
                                                    <option value="admin">Admin</option>
                                                </select>
                                                {errors.role && <div className="invalid-feedback">{errors.role}</div>}
                                            </div>

                                            {/* Admin Secret Key Field - Only shown when Admin is selected */}
                                            {inputs.role === 'admin' && (
                                                <div className="col-md-6">
                                                    <label htmlFor="adminSecretKey" className="form-label fw-semibold">
                                                        <i className="fas fa-key me-2 text-muted"></i>
                                                        Admin Secret Key <span className="text-danger">*</span>
                                                    </label>
                                                    <input 
                                                        type="password" 
                                                        className={`form-control form-control-lg ${errors.adminSecretKey && 'is-invalid'}`} 
                                                        id="adminSecretKey" 
                                                        name='adminSecretKey' 
                                                        value={inputs.adminSecretKey} 
                                                        onChange={handleChange} 
                                                        placeholder='Enter admin secret key' 
                                                    />
                                                    {errors.adminSecretKey && <div className="invalid-feedback">{errors.adminSecretKey}</div>}
                                                    <small className="text-muted">Contact your organization for the admin secret key</small>
                                                </div>
                                            )}

                                            <div className="col-md-6">
                                                <label htmlFor="mobileNumber" className="form-label fw-semibold">
                                                    <i className="fas fa-phone me-2 text-muted"></i>
                                                    Mobile Number <span className="text-danger">*</span>
                                                </label>
                                                <input type="text" className={`form-control form-control-lg ${errors.phoneNumber && 'is-invalid'}`} id="mobileNumber" name='phoneNumber' value={inputs.phoneNumber} onChange={handleChange} placeholder='Enter your mobile number' />
                                                {errors.phoneNumber && <div className="invalid-feedback">{errors.phoneNumber}</div>}
                                            </div>

                                            {/* Additional Information Section */}
                                            <div className="col-12 mb-3 mt-4">
                                                <h6 className="text-primary fw-bold border-bottom pb-2">
                                                    <i className="fas fa-info-circle me-2"></i>
                                                    Additional Information
                                                </h6>
                                            </div>

                                            <div className="col-md-6">
                                                <label htmlFor="inputdob" className="form-label fw-semibold">
                                                    <i className="fas fa-birthday-cake me-2 text-muted"></i>
                                                    Date of Birth <span className="text-danger">*</span>
                                                    <small className="text-muted ms-2">(Must be 18+)</small>
                                                </label>
                                                <input 
                                                    type="date" 
                                                    className={`form-control form-control-lg ${errors.dob && 'is-invalid'}`} 
                                                    id="inputdob" 
                                                    name='dob' 
                                                    value={inputs.dob} 
                                                    onChange={handleChange}
                                                    max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
                                                />
                                                {errors.dob && <div className="invalid-feedback">{errors.dob}</div>}
                                            </div>

                                            <div className="col-md-6">
                                                <label htmlFor="gender" className="form-label fw-semibold">
                                                    <i className="fas fa-venus-mars me-2 text-muted"></i>
                                                    Gender <span className="text-danger">*</span>
                                                </label>
                                                <select className={`form-select form-select-lg ${errors.gender && 'is-invalid'}`} aria-label="Default select example" name='gender' value={inputs.gender} onChange={handleChange}>
                                                    <option value="" disabled>Select your gender</option>
                                                    <option value="Male">Male</option>
                                                    <option value="Female">Female</option>
                                                </select>
                                                {errors.gender && <div className="invalid-feedback">{errors.gender}</div>}
                                            </div>

                                            <div className="col-md-6">
                                                <label htmlFor="district" className="form-label fw-semibold">
                                                    <i className="fas fa-map-marked-alt me-2 text-muted"></i>
                                                    District <span className="text-danger">*</span>
                                                </label>
                                                <select className={`form-select form-select-lg ${errors.district && 'is-invalid'}`} id="district" name='district' value={inputs.district} onChange={handleChange}>
                                                    <option value="" disabled>Select your district</option>
                                                    <option value="Colombo">Colombo</option>
                                                    <option value="Gampaha">Gampaha</option>
                                                    <option value="Kalutara">Kalutara</option>
                                                    <option value="Kandy">Kandy</option>
                                                    <option value="Matale">Matale</option>
                                                    <option value="Nuwara Eliya">Nuwara Eliya</option>
                                                    <option value="Galle">Galle</option>
                                                    <option value="Matara">Matara</option>
                                                    <option value="Hambantota">Hambantota</option>
                                                    <option value="Jaffna">Jaffna</option>
                                                    <option value="Kilinochchi">Kilinochchi</option>
                                                    <option value="Mannar">Mannar</option>
                                                    <option value="Vavuniya">Vavuniya</option>
                                                    <option value="Mullaitivu">Mullaitivu</option>
                                                    <option value="Batticaloa">Batticaloa</option>
                                                    <option value="Ampara">Ampara</option>
                                                    <option value="Trincomalee">Trincomalee</option>
                                                    <option value="Kurunegala">Kurunegala</option>
                                                    <option value="Puttalam">Puttalam</option>
                                                    <option value="Anuradhapura">Anuradhapura</option>
                                                    <option value="Polonnaruwa">Polonnaruwa</option>
                                                    <option value="Badulla">Badulla</option>
                                                    <option value="Moneragala">Moneragala</option>
                                                    <option value="Ratnapura">Ratnapura</option>
                                                    <option value="Kegalle">Kegalle</option>
                                                </select>
                                                {errors.district && <div className="invalid-feedback">{errors.district}</div>}
                                            </div>

                                            <div className="col-12">
                                                <label htmlFor="Address" className="form-label fw-semibold">
                                                    <i className="fas fa-map-marker-alt me-2 text-muted"></i>
                                                    Address (Optional)
                                                </label>
                                                <textarea className="form-control form-control-lg" id="Address" name="address" value={inputs.address} onChange={handleChange} placeholder="Enter your address" rows="3"></textarea>
                                            </div>

                                            {/* Face Recognition Benefits */}
                                            {/* biometric benefits removed */}

                                            {/* Register Button */}
                                            {
                                                load ? (
                                                    <div className="col-12 mt-4">
                                                        <div className="d-grid">
                                                            <button type="submit" className="btn btn-success btn-lg py-3">
                                                                <i className="fas fa-user-plus me-2"></i>
                                                                    <span className="fw-bold">Create Account</span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="col-12 mt-4">
                                                        <div className="d-grid">
                                                            <button className="btn btn-success btn-lg py-3" disabled>
                                                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                                                <span className="fw-bold">Creating Your Account...</span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                )
                                            }
                                        </form>
                                    </div>
                                    <div className="card-footer bg-light text-center py-3">
                                        <span className="text-muted">
                                            Already have an account?
                                            <Link to="/login" className="text-decoration-none fw-semibold ms-1">
                                                Sign In
                                            </Link>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Footer intentionally removed for auth pages */}
                </>
            )}
        </div>
    );
}

export default RegisterPage;
