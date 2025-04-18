import React, { useState, useEffect } from 'react';
import { 
  Grid, 
  Typography, 
  Card, 
  CardContent, 
  CardMedia, 
  Box,
  Skeleton,
  Container,
  Chip
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { format } from 'date-fns';
import axios from 'axios';
import API_BASE_URL from '../config';
import { Helmet } from 'react-helmet';

const ArticleCard = ({ article }) => (
  <Card 
    component={RouterLink} 
    to={article.url}
    sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      textDecoration: 'none',
      transition: '0.3s',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: 4
      }
    }}
  >
    {article.image_url ? (
      <CardMedia
        component="img"
        height="200"
        image={article.image_url}
        alt={article.title}
        sx={{ objectFit: 'cover' }}
      />
    ) : (
      <Box
        sx={{
          height: 200,
          backgroundColor: 'grey.200',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Typography variant="body2" color="text.secondary">
          No image available
        </Typography>
      </Box>
    )}
    <CardContent sx={{ flexGrow: 1 }}>
      <Box sx={{ mb: 1 }}>
        <Chip 
          label={article.category.charAt(0).toUpperCase() + article.category.slice(1)} 
          size="small" 
          color="primary" 
          sx={{ mr: 1 }}
        />
        <Typography variant="caption" color="text.secondary">
          {format(new Date(article.published_date), 'MMM dd, yyyy')}
        </Typography>
      </Box>
      <Typography gutterBottom variant="h6" component="h2">
        {article.title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {article.meta_description}
      </Typography>
    </CardContent>
  </Card>
);

const LoadingSkeleton = () => (
  <Card sx={{ height: '100%' }}>
    <Skeleton variant="rectangular" height={200} />
    <CardContent>
      <Skeleton variant="text" width="30%" />
      <Skeleton variant="text" height={40} />
      <Skeleton variant="text" />
      <Skeleton variant="text" />
    </CardContent>
  </Card>
);

const Home = () => {
  const [latestNews, setLatestNews] = useState([]);
  const [loading, setLoading] = useState(true);

    useEffect(() => {
    const fetchLatestNews = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/articles/latest?limit=12`);
        if (response.data.status === 'success') {
          setLatestNews(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching latest news:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestNews();
  }, []);

  return (
    <>
      <Helmet>
        <title>Global News Hub - Latest News in Technology, Economics, and World Affairs</title>
        <meta name="description" content="Stay updated with the latest news from around the world. Coverage includes technology, economics, and global affairs." />
        <meta name="keywords" content="news, technology news, economic news, world news, latest news" />
      </Helmet>

      <Container maxWidth="lg">
        <Typography variant="h4" component="h1" gutterBottom>
          Latest News
        </Typography>

        <Grid container spacing={4}>
          {loading
            ? Array.from(new Array(12)).map((_, index) => (
                <Grid item key={index} xs={12} sm={6} md={4}>
                  <LoadingSkeleton />
                </Grid>
              ))
            : latestNews.map((article) => (
                <Grid item key={article.slug} xs={12} sm={6} md={4}>
                  <ArticleCard article={article} />
                </Grid>
              ))}
        </Grid>
      </Container>
    </>
  );
};

export default Home;
