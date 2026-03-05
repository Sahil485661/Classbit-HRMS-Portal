import React from 'react';
import { Container, Typography, Button, Box, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import { ArrowRight, Code, Database, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <Box>
            {/* Hero Section */}
            <Box className="relative overflow-hidden bg-slate-900 border-b border-slate-800 pb-32 pt-16 lg:pt-32">
                <Container maxWidth="lg" className="relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center"
                    >
                        <Typography variant="h1" component="h1" className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-600 mb-6 pb-2">
                            Master the Future of Tech
                        </Typography>
                        <Typography variant="h5" className="text-slate-400 max-w-2xl mx-auto mb-8">
                            Premium coding courses designed for the next generation of developers. Learn efficiently, build scalability.
                        </Typography>
                        <Box className="flex justify-center gap-4">
                            <Button component={Link} to="/courses" variant="contained" color="primary" size="large" endIcon={<ArrowRight />}>
                                Explore Courses
                            </Button>
                            <Button component={Link} to="/about" variant="outlined" color="primary" size="large">
                                Learn More
                            </Button>
                        </Box>
                    </motion.div>
                </Container>

                {/* Background Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-cyan-500/10 to-transparent blur-3xl -z-10" />
            </Box>

            {/* Featured Section Placeholder */}
            <Container maxWidth="lg" className="py-20">
                <Typography variant="h4" className="font-bold mb-10 text-center text-white">Featured Tracks</Typography>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={4}>
                        <Box className="bg-slate-800 p-8 rounded-2xl border border-slate-700 hover:border-cyan-400 transition-colors h-full">
                            <Globe className="w-12 h-12 text-cyan-400 mb-6" />
                            <Typography variant="h6" className="font-bold mb-3 text-white">Full Stack Dev</Typography>
                            <Typography className="text-slate-400">Master MERN stack with real-world projects and scalable architecture.</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Box className="bg-slate-800 p-8 rounded-2xl border border-slate-700 hover:border-purple-400 transition-colors h-full">
                            <Database className="w-12 h-12 text-purple-400 mb-6" />
                            <Typography variant="h6" className="font-bold mb-3 text-white">Cloud Computing</Typography>
                            <Typography className="text-slate-400">Deploy applications with AWS, Docker, and Kubernetes.</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Box className="bg-slate-800 p-8 rounded-2xl border border-slate-700 hover:border-green-400 transition-colors h-full">
                            <Code className="w-12 h-12 text-green-400 mb-6" />
                            <Typography variant="h6" className="font-bold mb-3 text-white">System Design</Typography>
                            <Typography className="text-slate-400">Architect complex systems for high availability and low latency.</Typography>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default Home;
