import time
import json
import os
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from pydantic import BaseModel, Field
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

# 1. Define the Pydantic model with detailed descriptions for the LLM
class SustainabilityData(BaseModel):
    primary_material: str = Field(
        default="Unknown", 
        description="Main fabric or material (e.g., Cotton, Polyester, Nylon, Wool, Silk, Linen, Rayon, Blend). Infer from fabric composition."
    )
    recycled_percentage: float = Field(
        default=0.0, 
        description="Percentage of recycled material (0-100). Extract if mentioned, otherwise default to 0."
    )
    dye_type: str = Field(
        default="Unknown", 
        description="Type of dye used: 'Natural', 'Synthetic', 'Eco-Friendly', or 'Unknown'."
    )
    chemical_finish: bool = Field(
        default=False, 
        description="True if specs mention wrinkle-free, stain-resistant, anti-bacterial, coating, or similar treatments."
    )
    manufacturing_country: str = Field(
        default="India", 
        description="Country of origin/manufacturing (e.g., India, China, Bangladesh, Vietnam). Default to 'India' if not found."
    )
    has_oeko_tex: bool = Field(
        default=False, 
        description="True if mentions OEKO-TEX, GOTS, Bluesign, Standard 100, or similar eco-certifications."
    )
    is_fair_trade: bool = Field(
        default=False, 
        description="True if mentions Fair Trade, Fairtrade, Ethical sourcing, or similar."
    )
    is_b_corp: bool = Field(
        default=False, 
        description="True if the brand is a known B-Corp (e.g., Patagonia, Allbirds, Tentree, Eileen Fisher, Seventh Generation)."
    )
    shipping_distance_km: float = Field(
        default=0.0,
        description="Leave as 0.0. This will be calculated programmatically later."
    )

def extract_specifications(driver):
    soup = BeautifulSoup(driver.page_source, "html.parser")
    specs = {}
    divs = soup.find_all("div")

    for i in range(len(divs) - 1):
        key = divs[i].get_text(strip=True)
        value = divs[i + 1].get_text(strip=True)

        if (
            len(key) > 1 and
            len(value) > 1 and
            key != value and
            len(key) < 50 and
            len(value) < 200
        ):
            if key not in ["Specifications", "Description", "Manufacturer info", "See more", "All details"]:
                specs[key] = value

    return specs

def map_to_sustainability(specs: dict) -> SustainabilityData:
    """
    Use LLM Structured Outputs to intelligently extract sustainability data.
    """
    print("🤖 Using LLM to analyze product specifications...")
    
    try:
        client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        
        prompt = f"""Analyze the following product specifications and extract sustainability information.
Make intelligent inferences based on the data provided. Check carefully for premium brands, material compositions, and hidden certifications.

PRODUCT SPECIFICATIONS:
{json.dumps(specs, indent=2)}"""

        # 2. Use the 'parse' endpoint to force the output into the Pydantic model
        response = client.beta.chat.completions.parse(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": "You are a sustainability data extraction expert. Extract environmental and ethical attributes from product data."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            response_format=SustainabilityData, # Pass the Pydantic class directly
            temperature=0.1 # Low temperature for factual extraction
        )
        
        # 3. The response is automatically parsed into your Pydantic object
        extracted_data = response.choices[0].message.parsed
        
        # 4. Perform programmable business logic (shipping distance)
        country = extracted_data.manufacturing_country.lower()
        distance_map = {
            "india": 800, "china": 4500, "bangladesh": 2200, "vietnam": 3200,
            "thailand": 2800, "indonesia": 3800, "sri lanka": 600, "pakistan": 2000,
            "turkey": 5500, "usa": 13000, "italy": 6500, "spain": 7500, "portugal": 8000
        }
        
        shipping = distance_map.get(country, 1000)
        
        # Adjust for premium brands
        brand = specs.get("brand", specs.get("Brand", "")).lower()
        premium_brands = ["nike", "adidas", "puma", "zara", "h&m", "uniqlo", "levis", "tommy", "calvin klein"]
        if any(b in brand for b in premium_brands):
            shipping = int(shipping * 0.8)
            
        extracted_data.shipping_distance_km = shipping
        
        print(f"✅ LLM extracted:\n{extracted_data.model_dump_json(indent=2)}")
        
        return extracted_data
        
    except Exception as e:
        print(f"⚠️ LLM extraction failed: {e}")
        print("📋 Falling back to basic extraction...")
        return fallback_extraction(specs)


def fallback_extraction(specs: dict) -> SustainabilityData:
    """
    Fallback method if LLM fails - basic rule-based extraction
    """
    specs_lower = {k.lower(): v.lower() for k, v in specs.items()}
    specs_str = str(specs_lower)
    
    material = "Unknown"
    if "fabric" in specs_lower:
        fabric_value = specs_lower["fabric"]
        if "cotton" in fabric_value: material = "Cotton"
        elif "polyester" in fabric_value: material = "Polyester"
        elif "nylon" in fabric_value: material = "Nylon"
    
    recycled = 0.0
    if "recycled" in specs_str:
        import re
        match = re.search(r'(\d+)%?\s*recycled', specs_str)
        recycled = float(match.group(1)) if match else 20.0
    
    dye = "Natural" if any(w in specs_str for w in ["natural dye", "plant-based", "organic dye"]) else "Synthetic"
    chemical = any(w in specs_str for w in ["wrinkle", "anti-", "coating", "finish", "treatment"])
    
    country = "India"
    country_keywords = {"china": "China", "bangladesh": "Bangladesh", "vietnam": "Vietnam", "usa": "USA"}
    for keyword, country_name in country_keywords.items():
        if keyword in specs_str:
            country = country_name
            break
            
    distance_map = {"india": 800, "china": 4500, "bangladesh": 2200, "vietnam": 3200, "usa": 13000}
    shipping = distance_map.get(country.lower(), 1000)
    
    has_oeko = any(x in specs_str for x in ["oeko", "gots", "bluesign"])
    fair_trade = "fair trade" in specs_str
    
    brand = specs_lower.get("brand", "")
    known_bcorp = ["patagonia", "allbirds", "tentree"]
    is_bcorp = any(b in brand for b in known_bcorp)
    
    return SustainabilityData(
        primary_material=material,
        recycled_percentage=recycled,
        dye_type=dye,
        chemical_finish=chemical,
        manufacturing_country=country,
        shipping_distance_km=shipping,
        has_oeko_tex=has_oeko,
        is_fair_trade=fair_trade,
        is_b_corp=is_bcorp
    )

def scrape_flipkart(url):
    print("🕸️ Starting scraper...")
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--window-size=1920,1080")

    driver = webdriver.Chrome(options=chrome_options)

    try:
        driver.get(url)
        time.sleep(4)

        try:
            see_more = driver.find_element(By.XPATH, "//div[text()='See more']")
            driver.execute_script("arguments[0].click();", see_more)
            time.sleep(2)
        except:
            print("ℹ️ No 'See more' button")

        specs = extract_specifications(driver)
        final_output = map_to_sustainability(specs)
        return final_output

    except Exception as e:
        print(f"🚨 Error: {e}")

    finally:
        driver.quit()