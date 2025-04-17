import React from 'react';
import { Box, Container, Typography, Link, Grid, Divider } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Global News Hub
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Your source for the latest news in technology, economics, and world affairs.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Categories
            </Typography>
            <Link
              component={RouterLink}
              to="/category/world"
              color="text.secondary"
              display="block"
              sx={{ mb: 0.5 }}
            >
              World News
            </Link>
            <Link
              component={RouterLink}
              to="/category/technology"
              color="text.secondary"
              display="block"
              sx={{ mb: 0.5 }}
            >
              Technology
            </Link>
            <Link
              component={RouterLink}
              to="/category/economics"
              color="text.secondary"
              display="block"
              sx={{ mb: 0.5 }}
            >
              Economics
            </Link>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              About
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Global News Hub is an automated news aggregation platform that brings you the latest news from around the world, processed and presented using advanced AI technology.
            </Typography>
          </Grid>
        </Grid>
        <Divider sx={{ mt: 3, mb: 2 }} />
        <Typography variant="body2" color="text.secondary" align="center">
          {'Copyright © '}
          <Link color="inherit" component={RouterLink} to="/">
            Global News Hub
          </Link>{' '}
          {currentYear}
          {'. All rights reserved.'}
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
