import React from 'react';
import { Container, Typography, Box, Grid } from '@mui/material';
import { Code } from 'lucide-react';

const Footer = () => {
    return (
        <Box className="bg-slate-900 border-t border-slate-800 py-12 mt-20">
            <Container maxWidth="lg">
                <Grid container spacing={4}>
                    <Grid item xs={12} md={4}>
                        <Box className="flex items-center gap-2 mb-4">
                            <Code className="text-cyan-400" />
                            <Typography variant="h6" className="font-bold">TECHCOURSE</Typography>
                        </Box>
                        <Typography className="text-slate-400">
                            Empowering the next generation of developers with premium tech education.
                        </Typography>
                    </Grid>
                    <Grid item xs={6} md={2}>
                        <Typography variant="h6" className="font-bold mb-4">Platform</Typography>
                        <Box className="flex flex-col gap-2 text-slate-400">
                            <a href="#" className="hover:text-cyan-400">Courses</a>
                            <a href="#" className="hover:text-cyan-400">Pricing</a>
                            <a href="#" className="hover:text-cyan-400">For Teams</a>
                        </Box>
                    </Grid>
                    <Grid item xs={6} md={2}>
                        <Typography variant="h6" className="font-bold mb-4">Company</Typography>
                        <Box className="flex flex-col gap-2 text-slate-400">
                            <a href="#" className="hover:text-cyan-400">About</a>
                            <a href="#" className="hover:text-cyan-400">Careers</a>
                            <a href="#" className="hover:text-cyan-400">Blog</a>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Typography variant="h6" className="font-bold mb-4">Stay Updated</Typography>
                        <Typography className="text-slate-400 mb-4">
                            Get the latest tech news and course updates.
                        </Typography>
                        {/* Newsletter input placeholder */}
                        <input
                            type="text"
                            placeholder="Enter your email"
                            className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white focus:outline-none focus:border-cyan-400"
                        />
                    </Grid>
                </Grid>
                <Box className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-500">
                    <Typography>© 2026 TechCourse. All rights reserved.</Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;
