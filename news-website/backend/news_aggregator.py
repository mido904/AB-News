import requests
import openai
from datetime import datetime
from pymongo import MongoClient
from bs4 import BeautifulSoup
import hashlib
import requests
from PIL import Image
from io import BytesIO
from slugify import slugify
from config import *

class NewsAggregator:
    def __init__(self):
        self.client = MongoClient(MONGODB_URI)
        self.db = self.client[DB_NAME]
        self.articles = self.db.articles
        openai.api_key = OPENAI_API_KEY

    def fetch_news(self, category):
        """Fetch news from NewsData API for a specific category"""
        params = {
            'apikey': NEWSDATA_API_KEY,
            'category': category,
            'language': 'en'
        }
        
        response = requests.get(NEWSDATA_API_URL, params=params)
        if response.status_code == 200:
            return response.json().get('results', [])
        return []

    def is_image_copyrighted(self, image_url):
        """Check if an image might be copyrighted using basic heuristics"""
        try:
            response = requests.get(image_url)
            img = Image.open(BytesIO(response.content))
            
            # Check image metadata for copyright information
            if hasattr(img, '_getexif'):
                exif = img._getexif()
                if exif:
                    for tag_id in exif:
                        if 'copyright' in str(tag_id).lower():
                            return True
            
            # Generate image hash for potential duplicate checking
            img_hash = hashlib.md5(response.content).hexdigest()
            
            # Check if image hash exists in database
            if self.db.image_hashes.find_one({'hash': img_hash}):
                return True
                
            # Store new image hash
            self.db.image_hashes.insert_one({
                'hash': img_hash,
                'url': image_url,
                'date_added': datetime.now()
            })
            
            return False
        except:
            return True

    def rewrite_article(self, original_text):
        """Use OpenAI to rewrite the article in a natural, professional style"""
        try:
            prompt = f"""
            Rewrite the following news article in a professional, journalistic style. 
            Make it engaging while maintaining accuracy and adding relevant context:
            
            {original_text}
            """
            
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a professional news editor."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=1500,
                temperature=0.7
            )
            
            return response.choices[0].message.content.strip()
        except:
            return original_text

    def generate_seo_metadata(self, title, content):
        """Generate SEO-optimized metadata for the article"""
        try:
            prompt = f"""
            Generate SEO metadata for this news article:
            Title: {title}
            Content: {content[:500]}...
            
            Please provide:
            1. Meta description (max 160 characters)
            2. Focus keywords (5-7 keywords)
            """
            
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are an SEO expert."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=200,
                temperature=0.3
            )
            
            seo_text = response.choices[0].message.content
            meta_desc = seo_text.split('\n')[0][:160]
            keywords = seo_text.split('\n')[1].split(',')[:7]
            
            return {
                'meta_description': meta_desc,
                'keywords': keywords
            }
        except:
            return {
                'meta_description': content[:160],
                'keywords': []
            }

    def process_article(self, article, category):
        """Process a single article"""
        # Check if article already exists
        existing = self.articles.find_one({'original_id': article.get('article_id')})
        if existing:
            return None

        # Process image
        image_url = article.get('image_url')
        if image_url and self.is_image_copyrighted(image_url):
            image_url = None  # Don't use potentially copyrighted images

        # Rewrite content
        original_content = article.get('content', '')
        rewritten_content = self.rewrite_article(original_content)

        # Generate SEO metadata
        seo_data = self.generate_seo_metadata(article.get('title', ''), rewritten_content)

        # Create slug
        slug = slugify(article.get('title', ''))

        # Prepare article document
        processed_article = {
            'original_id': article.get('article_id'),
            'title': article.get('title'),
            'slug': slug,
            'content': rewritten_content,
            'image_url': image_url,
            'category': category,
            'source': article.get('source'),
            'published_date': article.get('pubDate'),
            'processed_date': datetime.now(),
            'meta_description': seo_data['meta_description'],
            'keywords': seo_data['keywords'],
            'url': f'/{category}/{slug}'
        }

        # Save to database
        self.articles.insert_one(processed_article)
        return processed_article

    def update_news(self):
        """Update news for all categories"""
        updated_articles = []
        for category in CATEGORIES:
            articles = self.fetch_news(category)
            for article in articles:
                processed = self.process_article(article, category)
                if processed:
                    updated_articles.append(processed)
        return updated_articles

if __name__ == "__main__":
    aggregator = NewsAggregator()
    aggregator.update_news()
