# agent.py
from typing import TypedDict
from dotenv import load_dotenv
from langgraph.graph import StateGraph, START, END
import json
import os
from openai import OpenAI

# Import your scraper and your new predictor
from scraper import scrape_flipkart
from eco_tools import get_eco_score

load_dotenv()

class AgentState(TypedDict):
    product_link: str
    user_payload: dict
    prediction_result: str
    raw_report: str
    final_report: str
    scraped_raw_data: dict

# --- Node 1: Extractor ---
def extract_data(state: AgentState):
    print("--- 🕷️ Extracting Data ---")
    scraped_data_model = scrape_flipkart(state["product_link"])
    payload = scraped_data_model.model_dump()
    return {
        "user_payload": payload,
        "scraped_raw_data": payload  # Store for LLM report generation
    }

# --- Node 2: Predictor (UPDATED) ---
def get_prediction(state: AgentState):
    print("--- 🧠 Running ML Prediction ---")
    payload = state.get("user_payload", {})
    
    # Check if the scraper actually found data before predicting
    if not payload or payload.get("primary_material") == "Unknown":
        return {"prediction_result": "Insufficient data to calculate Eco Score."}
    
    # Pass the payload to your PyTorch model
    inference_result = get_eco_score(payload)
    
    if inference_result["status"] == "success":
        # Format the result (adjust based on your model's exact output meaning)
        scores = inference_result["raw_prediction"]
        result_string = f"Model Output Scores: {scores}"
    else:
        result_string = f"Prediction failed: {inference_result.get('message')}"
    
    return {"prediction_result": result_string}

# --- Node 3: Report Generator (LLM-Powered) ---
def generate_report(state: AgentState):
    print("--- 📝 Generating LLM-Powered Report ---")
    
    payload = state.get('scraped_raw_data', {})
    prediction = state.get('prediction_result', 'No prediction available.')
    
    # Create raw report for reference
    raw_report = (
        f"🌱 Eco-Score Analysis Report 🌱\n"
        f"=================================\n"
        f"🔗 URL: {state['product_link']}\n\n"
        f"📦 Extracted Specifications:\n"
        f"  • Material: {payload.get('primary_material', 'Unknown')} (Recycled: {payload.get('recycled_percentage', 0)}%)\n"
        f"  • Dye Type: {payload.get('dye_type', 'Unknown')}\n"
        f"  • Origin: {payload.get('manufacturing_country', 'Unknown')} (Shipping Dist: {payload.get('shipping_distance_km', 0)} km)\n"
        f"  • Chemical Finish: {'Yes' if payload.get('chemical_finish') else 'No'}\n\n"
        f"🏅 Certifications & Ethics:\n"
        f"  • OEKO-TEX: {'✅' if payload.get('has_oeko_tex') else '❌'}\n"
        f"  • Fair Trade: {'✅' if payload.get('is_fair_trade') else '❌'}\n"
        f"  • B-Corp: {'✅' if payload.get('is_b_corp') else '❌'}\n\n"
        f"📊 Final ML Prediction:\n"
        f"  {prediction}\n"
        f"================================="
    )
    
    # Generate beautiful LLM report
    try:
        client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        
        prompt = f"""You are an expert sustainability analyst. Based on the following product data and ML prediction, create a comprehensive, well-structured sustainability report.

SCRAPED PRODUCT DATA:
{json.dumps(payload, indent=2)}

ML PREDICTION RESULT:
{prediction}

IMPORTANT CONTEXT:
- Shipping distance is calculated from the manufacturing location to Bangalore, India (the delivery destination)
- For products manufactured in India, the distance represents domestic shipping (typically 500-2000 km depending on the manufacturing city)
- For international products, the distance represents air/sea freight from the manufacturing country to Bangalore

Create a detailed, professional sustainability report with the following sections:

1. **Executive Summary** - Brief overview of the product's environmental impact (2-3 sentences)

2. **Material Analysis** - Deep dive into the materials used and their environmental implications
   - Discuss the primary material and its sustainability characteristics
   - Mention recycled content percentage if applicable
   - Explain the environmental impact of the dye type used

3. **Manufacturing & Supply Chain** - Analysis of production location, shipping distance, and carbon footprint
   - Explain where the product is manufactured
   - Discuss the shipping distance to Bangalore and its carbon impact
   - Consider whether it's domestic (within India) or international shipping
   - Mention any chemical finishes and their environmental concerns

4. **Certifications & Standards** - Evaluation of eco-certifications and ethical standards
   - Discuss presence or absence of OEKO-TEX, Fair Trade, B-Corp certifications
   - Explain what these certifications mean for sustainability

5. **Environmental Impact Score** - Interpretation of the ML prediction score
   - First score: Carbon emission in kg CO₂
   - Second score: Eco-friendliness rating (0-100, higher is better)
   - Provide context on whether these scores are good or concerning

6. **Recommendations** - Suggestions for improvement and consumer guidance
   - For manufacturers: How to improve sustainability
   - For consumers: What to consider when purchasing

Use clear headings (## for main sections, ### for subsections), bullet points where appropriate, and make it engaging and informative. Be specific about environmental impacts and use data from the analysis. Keep the tone professional but accessible."""

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are an expert sustainability analyst who creates detailed, professional environmental impact reports. You understand supply chain logistics, material science, and carbon footprint calculations."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=1500
        )
        
        final_report = response.choices[0].message.content
        
    except Exception as e:
        print(f"⚠️ LLM Report Generation Failed: {e}")
        final_report = raw_report  # Fallback to raw report
    
    return {
        "raw_report": raw_report,
        "final_report": final_report
    }

# ... (rest of your graph build logic remains the exact same)
# --- Graph Compilation ---
def build_graph():
    graph = StateGraph(AgentState)

    graph.add_node("product_data_extractor", extract_data)
    graph.add_node("predictor", get_prediction)
    graph.add_node("report_generator", generate_report)

    graph.add_edge(START, "product_data_extractor")
    graph.add_edge("product_data_extractor", "predictor")
    graph.add_edge("predictor", "report_generator")
    graph.add_edge("report_generator", END)

    return graph.compile()

# --- To Test It ---
if __name__ == "__main__":
    app = build_graph()
    
    # Initialize the state with the product link
    initial_state = {
        "product_link": "https://dl.flipkart.com/s/9lCgGHuuuN"
    }
    
    # Run the graph
    result = app.invoke(initial_state)
    
    print("\n--- Final Extracted Payload in State ---")
    print(json.dumps(result["user_payload"], indent=2))
    print(json.dumps(result["prediction_result"], indent=2))