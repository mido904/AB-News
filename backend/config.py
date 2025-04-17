import os
from dotenv import load_dotenv

load_dotenv()

# API Keys
NEWSDATA_API_KEY = os.getenv('NEWSDATA_API_KEY')
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')

# MongoDB Configuration
MONGODB_URI = os.getenv('MONGODB_URI', 'mongodb://localhost:27017')
DB_NAME = 'news_website'

# News Categories
CATEGORIES = ['world', 'technology', 'economics']

# Update Interval (in hours)
UPDATE_INTERVAL = 1

# API Endpoints
NEWSDATA_API_URL = 'https://newsdata.io/api/1/news'

# SEO Configuration
SITE_NAME = "Global News Hub"
SITE_DESCRIPTION = "Latest news from around the world in technology, economics, and global affairs"
