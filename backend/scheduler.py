import schedule
import time
from datetime import datetime
import logging
from news_aggregator import NewsAggregator

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('news_updater.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

def update_news_job():
    """Job to update news articles"""
    try:
        logger.info(f"Starting news update job at {datetime.now()}")
        aggregator = NewsAggregator()
        updated_articles = aggregator.update_news()
        logger.info(f"Successfully updated {len(updated_articles)} articles")
    except Exception as e:
        logger.error(f"Error updating news: {str(e)}")

def run_scheduler():
    """Run the scheduler"""
    logger.info("Starting news update scheduler")
    
    # Schedule the job to run every hour
    schedule.every(1).hours.do(update_news_job)
    
    # Run the job immediately on startup
    update_news_job()
    
    # Keep the scheduler running
    while True:
        schedule.run_pending()
        time.sleep(60)  # Check every minute

if __name__ == "__main__":
    run_scheduler()
