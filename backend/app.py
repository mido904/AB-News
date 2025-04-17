from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
from datetime import datetime, timedelta
from config import *
import threading
from scheduler import run_scheduler

app = Flask(__name__)
CORS(app)

# Connect to MongoDB
client = MongoClient(MONGODB_URI, **MONGO_CLIENT_OPTIONS)
db = client[DB_NAME]
articles = db.articles

# Start the scheduler in a separate thread
scheduler_thread = threading.Thread(target=run_scheduler, daemon=True)
scheduler_thread.start()

@app.route('/api/articles/latest', methods=['GET'])
def get_latest_articles():
    """Get the latest articles across all categories"""
    try:
        limit = int(request.args.get('limit', 10))
        latest = list(articles.find(
            {},
            {'_id': 0}
        ).sort('published_date', -1).limit(limit))
        
        return jsonify({
            'status': 'success',
            'data': latest
        }), 200
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@app.route('/api/articles/category/<category>', methods=['GET'])
def get_articles_by_category(category):
    """Get articles for a specific category"""
    try:
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 10))
        skip = (page - 1) * per_page
        
        category_articles = list(articles.find(
            {'category': category},
            {'_id': 0}
        ).sort('published_date', -1).skip(skip).limit(per_page))
        
        total = articles.count_documents({'category': category})
        
        return jsonify({
            'status': 'success',
            'data': category_articles,
            'pagination': {
                'current_page': page,
                'total_pages': (total + per_page - 1) // per_page,
                'total_articles': total
            }
        }), 200
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@app.route('/api/articles/<category>/<slug>', methods=['GET'])
def get_article(category, slug):
    """Get a specific article by category and slug"""
    try:
        article = articles.find_one(
            {'category': category, 'slug': slug},
            {'_id': 0}
        )
        
        if not article:
            return jsonify({
                'status': 'error',
                'message': 'Article not found'
            }), 404
            
        return jsonify({
            'status': 'success',
            'data': article
        }), 200
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@app.route('/api/categories', methods=['GET'])
def get_categories():
    """Get all available categories"""
    try:
        return jsonify({
            'status': 'success',
            'data': CATEGORIES
        }), 200
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@app.route('/api/stats', methods=['GET'])
def get_stats():
    """Get website statistics"""
    try:
        stats = {
            'total_articles': articles.count_documents({}),
            'articles_by_category': {
                category: articles.count_documents({'category': category})
                for category in CATEGORIES
            },
            'latest_update': articles.find_one(
                {},
                {'processed_date': 1, '_id': 0},
                sort=[('processed_date', -1)]
            )['processed_date']
        }
        
        return jsonify({
            'status': 'success',
            'data': stats
        }), 200
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
