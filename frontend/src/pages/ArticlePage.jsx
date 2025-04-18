import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Box, 
  Container, 
  Chip,
  Divider,
  Skeleton,
  Paper,
  Grid
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';
import axios from 'axios';
import API_BASE_URL from '../config';
import { Helmet } from 'react-helmet';

const LoadingSkeleton = () => (
  <>
    <Skeleton variant="text" height={60} />
    <Skeleton variant="text" width="30%" />
    <Skeleton variant="rectangular" height={400} sx={{ my: 2 }} />
    <Skeleton variant="text" />
    <Skeleton variant="text" />
    <Skeleton variant="text" />
    <Skeleton variant="text" width="80%" />
  </>
);

const ArticlePage = () => {
  const { category, slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/articles/${category}/${slug}`);
        if (response.data.status === 'success') {
          setArticle(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching article:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
    window.scrollTo(0, 0);
  }, [category, slug]);

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          <LoadingSkeleton />
        </Box>
      </Container>
    );
  }

  if (!article) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          <Typography variant="h4" component="h1">
            Article not found
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`${article.title} - Global News Hub`}</title>
        <meta name="description" content={article.meta_description} />
        <meta name="keywords" content={article.keywords.join(', ')} />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.meta_description} />
        {article.image_url && <meta property="og:image" content={article.image_url} />}
      </Helmet>

      <Container maxWidth="lg">
        <Paper elevation={0} sx={{ py: 4 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={8} sx={{ margin: '0 auto' }}>
              <Box sx={{ mb: 2 }}>
                <Chip 
                  label={article.category.charAt(0).toUpperCase() + article.category.slice(1)} 
                  color="primary" 
                  sx={{ mr: 1 }}
                />
                <Typography variant="subtitle1" color="text.secondary" component="span">
                  {format(new Date(article.published_date), 'MMMM dd, yyyy')}
                </Typography>
              </Box>

              <Typography variant="h3" component="h1" gutterBottom>
                {article.title}
              </Typography>

              {article.image_url && (
                <Box sx={{ my: 3, position: 'relative' }}>
                  <img 
                    src={article.image_url} 
                    alt={article.title}
                    style={{
                      width: '100%',
                      height: 'auto',
                      maxHeight: '500px',
                      objectFit: 'cover',
                      borderRadius: '4px'
                    }}
                  />
                </Box>
              )}

              <Typography variant="subtitle1" color="text.secondary" paragraph>
                {article.meta_description}
              </Typography>

              <Divider sx={{ my: 3 }} />

              <Typography variant="body1" component="div" sx={{ 
                '& p': { mb: 2 },
                '& a': { color: 'primary.main', textDecoration: 'none' },
                '& a:hover': { textDecoration: 'underline' }
              }}>
                {article.content.split('\n').map((paragraph, index) => (
                  <Typography key={index} paragraph>
                    {paragraph}
                  </Typography>
                ))}
              </Typography>

              <Box sx={{ mt: 4 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Source: {article.source}
                </Typography>
              </Box>

              <Box sx={{ mt: 3 }}>
                {article.keywords.map((keyword, index) => (
                  <Chip 
                    key={index}
                    label={keyword}
                    size="small"
                    sx={{ mr: 1, mb: 1 }}
                  />
                ))}
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </>
  );
};

export default ArticlePage;
