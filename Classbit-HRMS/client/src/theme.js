import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#38BDF8', // Cyan-400
            contrastText: '#0F172A',
        },
        secondary: {
            main: '#A855F7', // Purple-500
        },
        background: {
            default: '#0F172A', // Slate-900
            paper: '#1E293B',   // Slate-800
        },
        text: {
            primary: '#F8FAFC',
            secondary: '#94A3B8',
        },
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: { fontWeight: 700 },
        h2: { fontWeight: 700 },
        h3: { fontWeight: 600 },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    borderRadius: 8,
                },
            },
        },
    },
});

export default theme;
