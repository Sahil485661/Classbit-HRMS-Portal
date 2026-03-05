import React from 'react';
import { Container, Typography, Box, Button, List, ListItem, ListItemText, Divider } from '@mui/material';

const Cart = () => {
    // Mock cart items
    const cartItems = [
        { id: 1, title: 'Full Stack Web Development Bootcamp', price: 99.99 },
        { id: 2, title: 'Advanced React patterns', price: 59.99 }
    ];
    const total = cartItems.reduce((acc, item) => acc + item.price, 0).toFixed(2);

    return (
        <Container maxWidth="md" className="py-12">
            <Typography variant="h3" className="font-bold mb-8">Your Cart</Typography>
            <Box className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                <List>
                    {cartItems.map((item) => (
                        <React.Fragment key={item.id}>
                            <ListItem className="py-4">
                                <ListItemText
                                    primary={<Typography variant="h6" className="font-bold mb-1">{item.title}</Typography>}
                                    secondary={<Typography className="text-slate-400">Lifetime Access</Typography>}
                                />
                                <Typography variant="h6" className="text-cyan-400 font-bold">${item.price}</Typography>
                            </ListItem>
                            <Divider className="bg-slate-700" />
                        </React.Fragment>
                    ))}
                </List>
                <Box className="flex justify-between items-center mt-8">
                    <Typography variant="h5" className="font-bold">Total: ${total}</Typography>
                    <Button variant="contained" color="primary" size="large" onClick={() => alert('Checkout flow coming soon!')}>
                        Checkout
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default Cart;
