# Global News Hub

An automated news aggregation website that collects and presents news from around the world. The platform uses AI to process and rewrite articles, ensuring high-quality, natural content while maintaining accuracy and proper attribution.

## Features

- Automated news collection from multiple sources
- AI-powered article processing and rewriting
- Copyright-compliant image handling
- SEO optimization for all articles
- Responsive design for all devices
- Real-time updates every hour
- Categories: World News, Technology, Economics

## Tech Stack

### Backend
- Python 3.8+
- Flask (Web Framework)
- MongoDB (Database)
- OpenAI API (Content Processing)
- NewsData API (News Collection)

### Frontend
- React.js
- Material-UI
- Vite (Build Tool)

## Setup Instructions

### Prerequisites
- Python 3.8 or higher
- Node.js 14 or higher
- MongoDB
- NewsData API key
- OpenAI API key

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd news-website/backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   ```

3. Activate the virtual environment:
   - Windows:
     ```bash
     venv\Scripts\activate
     ```
   - Unix/MacOS:
     ```bash
     source venv/bin/activate
     ```

4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

5. Copy the environment template and configure your variables:
   ```bash
   cp .env.example .env
   ```
   Edit .env with your API keys and configuration

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd news-website/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Application

### Backend

1. Start MongoDB service if not running
2. From the backend directory with virtual environment activated:
   ```bash
   python app.py
   ```

The scheduler will automatically start collecting news.

### Frontend

1. From the frontend directory:
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5173`

## Deployment

### Render.com Deployment

1. Create a new Web Service on Render
2. Connect your repository
3. Configure the following:
   - Build Command: `cd frontend && npm install && npm run build && cd ../backend && pip install -r requirements.txt`
   - Start Command: `cd backend && python app.py`
   - Environment Variables: Add all variables from .env

### Environment Variables Required

- `NEWSDATA_API_KEY`: Your NewsData API key
- `OPENAI_API_KEY`: Your OpenAI API key
- `MONGODB_URI`: MongoDB connection string
- `PORT`: Application port (default: 5000)

## Project Structure

```
news-website/
├── backend/
│   ├── app.py              # Main Flask application
│   ├── config.py           # Configuration settings
│   ├── news_aggregator.py  # News processing logic
│   ├── scheduler.py        # Automated update scheduler
│   └── requirements.txt    # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/        # Page components
│   │   ├── App.jsx       # Main React component
│   │   └── main.jsx      # React entry point
│   ├── package.json      # Node.js dependencies
│   └── index.html        # HTML entry point
└── README.md             # Project documentation
```

## Maintenance

- Monitor the logs for any errors or issues
- Regularly update API keys and dependencies
- Check MongoDB storage usage
- Monitor API rate limits

## License

This project is licensed under the MIT License - see the LICENSE file for details.
