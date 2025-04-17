import React, { useState, useEffect } from 'react';
import { 
  Grid, 
  Typography, 
  Card, 
  CardContent, 
  CardMedia, 
  Box,
  Pagination,
  Container,
  Chip,
  Skeleton
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';
import { format } from 'date-fns';
import axios from 'axios';
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

const CategoryPage = () => {
  const { category } = useParams();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/articles/category/${category}?page=${page}&per_page=9`);
        if (response.data.status === 'success') {
          setArticles(response.data.data);
          setTotalPages(response.data.pagination.total_pages);
        }
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
    window.scrollTo(0, 0);
  }, [category, page]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const categoryTitle = category.charAt(0).toUpperCase() + category.slice(1);

  return (
    <>
      <Helmet>
        <title>{`${categoryTitle} News - Global News Hub`}</title>
        <meta 
          name="description" 
          content={`Latest ${categoryTitle} news and updates. Stay informed with our comprehensive coverage of ${category} news from around the world.`}
        />
        <meta name="keywords" content={`${category} news, ${category} updates, latest ${category} news`} />
      </Helmet>

      <Container maxWidth="lg">
        <Typography variant="h4" component="h1" gutterBottom>
          {categoryTitle} News
        </Typography>

        <Grid container spacing={4} sx={{ mb: 4 }}>
          {loading
            ? Array.from(new Array(9)).map((_, index) => (
                <Grid item key={index} xs={12} sm={6} md={4}>
                  <LoadingSkeleton />
                </Grid>
              ))
            : articles.map((article) => (
                <Grid item key={article.slug} xs={12} sm={6} md={4}>
                  <ArticleCard article={article} />
                </Grid>
              ))}
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
          <Pagination 
            count={totalPages} 
            page={page} 
            onChange={handlePageChange}
            color="primary"
            size="large"
          />
        </Box>
      </Container>
    </>
  );
};

export default CategoryPage;
