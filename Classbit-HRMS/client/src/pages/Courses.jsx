import React, { useEffect } from 'react';
import { Container, Typography, Grid, Box, Chip, CircularProgress, Button, Alert } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourses } from '../slices/courseSlice';
import { Link } from 'react-router-dom';

const Courses = () => {
    const dispatch = useDispatch();
    const { courses, loading, error } = useSelector((state) => state.courses);

    useEffect(() => {
        dispatch(fetchCourses());
    }, [dispatch]);

    return (
        <Container maxWidth="lg" className="py-12">
            <Box className="mb-12">
                <Typography variant="h3" className="font-bold mb-4 text-white">All Courses</Typography>
                <Box className="flex gap-2">
                    <Chip label="All" color="primary" clickable />
                    <Chip label="Frontend" variant="outlined" clickable className="text-slate-300 border-slate-600" />
                    <Chip label="Backend" variant="outlined" clickable className="text-slate-300 border-slate-600" />
                    <Chip label="DevOps" variant="outlined" clickable className="text-slate-300 border-slate-600" />
                </Box>
            </Box>

            {loading && (
                <Box className="flex justify-center py-20">
                    <CircularProgress />
                </Box>
            )}

            {error && (
                <Alert severity="error" className="mb-4">{error}</Alert>
            )}

            <Grid container spacing={4}>
                {!loading && courses.length === 0 && !error && (
                    <Box className="p-4 text-slate-400">No courses found.</Box>
                )}
                {courses.map((course) => (
                    <Grid item xs={12} sm={6} md={4} key={course._id}>
                        <Box className="h-full bg-slate-800 rounded-xl border border-slate-700 overflow-hidden hover:shadow-lg hover:shadow-cyan-500/10 transition-shadow flex flex-col">
                            <Box className="h-48 bg-slate-700 overflow-hidden relative">
                                {course.thumbnail ? (
                                    <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-600" />
                                )}
                                <div className="absolute top-2 right-2 bg-black/60 px-2 py-1 rounded text-xs font-bold text-white uppercase">{course.level}</div>
                            </Box>
                            <Box className="p-6 flex-1 flex flex-col">
                                <Typography variant="h6" className="font-bold mb-2 line-clamp-2">{course.title}</Typography>
                                <Typography className="text-slate-400 text-sm mb-4 line-clamp-3 flex-1">{course.description}</Typography>
                                <Box className="flex justify-between items-center mt-4 pt-4 border-t border-slate-700">
                                    <Typography variant="h6" className="font-bold text-cyan-400">${course.price}</Typography>
                                    <Button component={Link} to={`/courses/${course._id}`} variant="outlined" size="small">View Details</Button>
                                </Box>
                            </Box>
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default Courses;
