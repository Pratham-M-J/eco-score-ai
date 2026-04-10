# Eco-Score.AI

An autonomous environmental analysis engine that deploys specialized agents and refined PyTorch ML models to quantify and predict real-time environmental impact across materials and supply chains in the e-commerce lifecycle.

## Features

- 🤖 **AI-Powered Analysis**: Autonomous web scraping agents with LLM-powered data extraction
- ⚡ **Real-Time Predictions**: PyTorch ML models for instant carbon emission and eco-score predictions
- 📊 **Comprehensive Reports**: LLM-generated detailed sustainability reports
- 🌍 **Global Impact**: Analyzes products from multiple countries with accurate shipping distance calculations
- 🎨 **Modern UI**: Beautiful React frontend with Tailwind CSS and Framer Motion animations

## Tech Stack

### Backend
- **FastAPI**: REST API framework
- **LangGraph**: Agent orchestration
- **PyTorch**: ML model inference
- **Selenium + BeautifulSoup**: Web scraping
- **OpenAI GPT-4**: LLM-powered extraction and report generation
- **Python 3.10+**

### Frontend
- **React 18**: UI framework
- **Vite**: Build tool
- **Tailwind CSS**: Styling
- **Framer Motion**: Animations
- **Lucide React**: Icons
- **React Router**: Navigation

## Installation

### Backend Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd eco-score-ai
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create a `.env` file:
```env
OPENAI_API_KEY=your_openai_api_key_here
```

5. Run the backend:
```bash
python main.py
```

The API will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## Usage

1. Start both the backend and frontend servers
2. Open `http://localhost:3000` in your browser
3. Paste a Flipkart product URL
4. Click "Analyze" to get instant sustainability insights

## API Endpoints

### POST `/analyze`

Analyzes a product URL and returns sustainability metrics.

**Request:**
```json
{
  "url": "https://www.flipkart.com/product-url"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Analysis complete.",
  "data": {
    "extracted_features": {
      "primary_material": "Cotton",
      "recycled_percentage": 20.0,
      "dye_type": "Natural",
      "chemical_finish": false,
      "manufacturing_country": "India",
      "shipping_distance_km": 800,
      "has_oeko_tex": true,
      "is_fair_trade": false,
      "is_b_corp": false
    },
    "prediction": "Model Output Scores: [12.5, 75.3]",
    "raw_report": "...",
    "final_report": "..."
  }
}
```

## Model Information

- **Carbon Emission Prediction**: Predicts kg CO₂ emissions
- **Eco-Friendliness Score**: 0-100 scale (higher is better)
- **Accuracy**: 85% on validation set
- **Inference Time**: <100ms

## Project Structure

```
eco-score-ai/
├── agent.py              # LangGraph agent orchestration
├── scraper.py            # Web scraping with LLM extraction
├── eco_tools.py          # ML model inference
├── models.py             # PyTorch model definitions
├── main.py               # FastAPI application
├── requirements.txt      # Python dependencies
├── .env                  # Environment variables
├── eco_model_weights.pth # Trained model weights
├── distance_scaler.pkl   # Feature scaler
├── target_encoder.pkl    # Target encoder
└── frontend/
    ├── src/
    │   ├── components/   # React components
    │   ├── App.jsx       # Main app component
    │   └── main.jsx      # Entry point
    ├── package.json      # Node dependencies
    └── vite.config.js    # Vite configuration
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License

## Contact

For questions or feedback, please open an issue on GitHub.

## Acknowledgments

- OpenAI for GPT-4 API
- PyTorch team for the ML framework
- FastAPI for the excellent web framework
- React and Vite teams for frontend tools
