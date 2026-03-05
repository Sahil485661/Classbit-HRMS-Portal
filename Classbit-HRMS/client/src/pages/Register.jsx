import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, TextField, Button, Alert } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register, clearError } from '../slices/authSlice';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState(null);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { userInfo, loading, error } = useSelector((state) => state.auth);

    useEffect(() => {
        if (userInfo) {
            navigate('/dashboard');
        }
    }, [userInfo, navigate]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setMessage('Passwords do not match');
        } else {
            setMessage(null);
            dispatch(register({ name, email, password }));
        }
    };

    return (
        <Container maxWidth="xs" className="py-20">
            <Box className="bg-slate-800 p-8 rounded-xl border border-slate-700">
                <Typography variant="h4" className="font-bold mb-6 text-center">Sign Up</Typography>

                {error && <Alert severity="error" className="mb-4" onClose={() => dispatch(clearError())}>{error}</Alert>}
                {message && <Alert severity="error" className="mb-4">{message}</Alert>}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <TextField
                        label="Full Name"
                        variant="outlined"
                        fullWidth
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        InputLabelProps={{ style: { color: '#94a3b8' } }}
                        InputProps={{ style: { color: '#fff' } }}
                        sx={{ '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#334155' }, '&:hover fieldset': { borderColor: '#475569' } } }}
                    />
                    <TextField
                        label="Email Address"
                        variant="outlined"
                        fullWidth
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        InputLabelProps={{ style: { color: '#94a3b8' } }}
                        InputProps={{ style: { color: '#fff' } }}
                        sx={{ '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#334155' }, '&:hover fieldset': { borderColor: '#475569' } } }}
                    />
                    <TextField
                        label="Password"
                        type="password"
                        variant="outlined"
                        fullWidth
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        InputLabelProps={{ style: { color: '#94a3b8' } }}
                        InputProps={{ style: { color: '#fff' } }}
                        sx={{ '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#334155' }, '&:hover fieldset': { borderColor: '#475569' } } }}
                    />
                    <TextField
                        label="Confirm Password"
                        type="password"
                        variant="outlined"
                        fullWidth
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        InputLabelProps={{ style: { color: '#94a3b8' } }}
                        InputProps={{ style: { color: '#fff' } }}
                        sx={{ '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#334155' }, '&:hover fieldset': { borderColor: '#475569' } } }}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        size="large"
                        fullWidth
                        disabled={loading}
                        className="mt-2"
                    >
                        {loading ? 'Creating Account...' : 'Register'}
                    </Button>
                </form>

                <Box className="mt-6 text-center text-slate-400">
                    Already have an account? <Link to="/login" className="text-cyan-400 hover:underline">Login</Link>
                </Box>
            </Box>
        </Container>
    );
};

export default Register;
