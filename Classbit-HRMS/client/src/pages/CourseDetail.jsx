import React from 'react';
import { Container, Typography, Box, Button, Grid, Chip, Divider } from '@mui/material';
import { useParams } from 'react-router-dom';
import { Clock, Users, PlayCircle, CheckCircle } from 'lucide-react';

const CourseDetail = () => {
    const { id } = useParams();

    return (
        <Box>
            <Box className="bg-slate-800 py-16 border-b border-slate-700">
                <Container maxWidth="lg">
                    <Grid container spacing={6} alignItems="center">
                        <Grid item xs={12} md={7}>
                            <Chip label="Best Seller" color="secondary" className="mb-4" />
                            <Typography variant="h2" className="font-bold mb-4">Full Stack Web Development</Typography>
                            <Typography variant="h5" className="text-slate-400 mb-6">
                                Become a full-stack developer with just one course. HTML, CSS, Javascript, Node, React, MongoDB and more!
                            </Typography>
                            <Box className="flex gap-4 mb-8 text-slate-300">
                                <Box className="flex items-center gap-1"><Clock size={16} /> 40 hours</Box>
                                <Box className="flex items-center gap-1"><Users size={16} /> 15k Students</Box>
                            </Box>
                            <Button variant="contained" color="primary" size="large" className="mr-4">Enroll Now - $49</Button>
                        </Grid>
                        <Grid item xs={12} md={5}>
                            <Box className="aspect-video bg-slate-900 rounded-xl overflow-hidden border border-slate-700 shadow-2xl relative group cursor-pointer">
                                <div className="absolute inset-0 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                                    <PlayCircle size={64} className="text-white opacity-80 group-hover:opacity-100 transition-opacity" />
                                </div>
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            <Container maxWidth="lg" className="py-16">
                <Grid container spacing={8}>
                    <Grid item xs={12} md={8}>
                        <Typography variant="h4" className="font-bold mb-6">What you'll learn</Typography>
                        <Grid container spacing={2} className="mb-12">
                            {['React Hooks', 'Node.js API', 'MongoDB Atlas', 'JWT Auth', 'Redux Toolkit', 'Tailwind CSS'].map(item => (
                                <Grid item xs={12} sm={6} key={item}>
                                    <Box className="flex items-center gap-2 text-slate-300">
                                        <CheckCircle size={20} className="text-cyan-400" /> {item}
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>

                        <Typography variant="h4" className="font-bold mb-6">Course Content</Typography>
                        <Box className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                            <Typography className="text-slate-400">Modules loading...</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        {/* Sidebar content */}
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default CourseDetail;
