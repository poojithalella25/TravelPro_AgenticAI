# Simulated Travel Data Source with Live Google Maps Links & Multi-Destination Support
import urllib.parse

def make_google_maps_url(name: str, destination: str) -> str:
    """Generates an authentic Google Maps search link for a given place & destination."""
    query = f"{name}, {destination}"
    return f"https://www.google.com/maps/search/?api=1&query={urllib.parse.quote_plus(query)}"

DESTINATIONS = {
    "kerala": {
        "name": "Kerala",
        "state": "Kerala",
        "description": "God's Own Country, famous for serene backwaters, tea plantations, palm-fringed beaches, and rich heritage.",
        "weather_templates": {
            "summer": {"temp": "28-34°C", "condition": "Warm & Humid", "rain_chance": 20, "suitability": "Good for hill stations like Munnar & coastal breezes"},
            "monsoon": {"temp": "23-28°C", "condition": "Heavy Tropical Monsoons", "rain_chance": 85, "suitability": "Ayurvedic wellness & lush greenery, caution near rivers"},
            "winter": {"temp": "18-28°C", "condition": "Pleasant & Clear", "rain_chance": 5, "suitability": "Ideal season for backwaters, beaches & sightseeing"}
        },
        "food": [
            {
                "name": "Kerala Sadya on Banana Leaf",
                "type": "Vegetarian",
                "description": "Traditional grand feast with 20+ dishes including Parippu, Sambar, Avial, and Payasam.",
                "rating": 4.9,
                "price_estimate": 300,
                "places": ["Grand Hotel Kochi", "Mothers Veg Plaza Trivandrum"],
                "google_maps_url": make_google_maps_url("Grand Hotel Kochi", "Kochi Kerala")
            },
            {
                "name": "Karimeen Pollichathu",
                "type": "Non-Vegetarian",
                "description": "Pearl spot fish marinated in spicy masala and baked wrapped in a banana leaf.",
                "rating": 4.8,
                "price_estimate": 450,
                "places": ["Pearl Spot Restaurant Kumarakom", "Fort House Restaurant"],
                "google_maps_url": make_google_maps_url("Fort House Restaurant", "Fort Kochi Kerala")
            },
            {
                "name": "Kerala Appam with Stew",
                "type": "Vegetarian",
                "description": "Lacy fermented rice crepes served with aromatic coconut milk vegetable stew.",
                "rating": 4.9,
                "price_estimate": 180,
                "places": ["Kashi Art Cafe", "Saravana Bhavan Kochi"],
                "google_maps_url": make_google_maps_url("Kashi Art Cafe", "Fort Kochi")
            },
            {
                "name": "Malabar Parotta with Chicken Curry",
                "type": "Non-Vegetarian",
                "description": "Flaky layered parottas served with rich spiced Kerala chicken gravy.",
                "rating": 4.7,
                "price_estimate": 250,
                "places": ["Paragon Restaurant Kochi", "Rahmath Hotel"],
                "google_maps_url": make_google_maps_url("Paragon Restaurant", "Kochi Kerala")
            }
        ],
        "attractions": [
            {
                "id": "fort_kochi",
                "name": "Fort Kochi & Chinese Fishing Nets",
                "category": "Historical",
                "rating": 4.7,
                "entry_fee": 0,
                "duration_hours": 3,
                "opening_hours": "06:00 AM - 08:00 PM",
                "closed_on": "None",
                "description": "Charming colonial neighborhood with iconic fixed cantilevered Chinese fishing nets and historic streetscapes.",
                "outdoor": True,
                "google_maps_url": make_google_maps_url("Fort Kochi Chinese Fishing Nets", "Kerala")
            },
            {
                "id": "mattancherry_palace",
                "name": "Mattancherry Palace (Dutch Palace)",
                "category": "Historical",
                "rating": 4.5,
                "entry_fee": 20,
                "duration_hours": 2,
                "opening_hours": "09:45 AM - 04:45 PM",
                "closed_on": "Friday",
                "description": "Portuguese palace featuring Hindu temple murals, royal portraits, and traditional Kerala architecture.",
                "outdoor": False,
                "google_maps_url": make_google_maps_url("Mattancherry Palace", "Kochi Kerala")
            },
            {
                "id": "marine_drive_kochi",
                "name": "Marine Drive Promenade Kochi",
                "category": "Nature",
                "rating": 4.4,
                "entry_fee": 0,
                "duration_hours": 2,
                "opening_hours": "Open 24 Hours",
                "closed_on": "None",
                "description": "Picturesque backwater walkway overlooking Vembanad Lake, popular for sunset walks and boat rides.",
                "outdoor": True,
                "google_maps_url": make_google_maps_url("Marine Drive", "Kochi Kerala")
            },
            {
                "id": "jew_town",
                "name": "Jew Town & Paradesi Synagogue",
                "category": "Cultural",
                "rating": 4.6,
                "entry_fee": 10,
                "duration_hours": 2,
                "opening_hours": "10:00 AM - 05:00 PM",
                "closed_on": "Saturday",
                "description": "Vibrant heritage market filled with antique shops, spice warehouses, and the oldest active synagogue in the Commonwealth.",
                "outdoor": True,
                "google_maps_url": make_google_maps_url("Paradesi Synagogue Jew Town", "Mattancherry Kerala")
            },
            {
                "id": "folklore_museum",
                "name": "Kerala Folklore Museum",
                "category": "Museums",
                "rating": 4.8,
                "entry_fee": 100,
                "duration_hours": 2.5,
                "opening_hours": "09:30 AM - 06:00 PM",
                "closed_on": "None",
                "description": "Three-story architectural masterpiece housing over 4,000 cultural artifacts, masks, and traditional art costumes.",
                "outdoor": False,
                "google_maps_url": make_google_maps_url("Kerala Folklore Museum", "Kochi Kerala")
            },
            {
                "id": "alleppey_backwaters",
                "name": "Alleppey Houseboat Backwater Cruise",
                "category": "Nature",
                "rating": 4.9,
                "entry_fee": 1500,
                "duration_hours": 5,
                "opening_hours": "08:00 AM - 06:00 PM",
                "closed_on": "None",
                "description": "Cruising calm coconut-lined canals and Vembanad Lake aboard a traditional Kettuvalam luxury houseboat.",
                "outdoor": True,
                "google_maps_url": make_google_maps_url("Alleppey Backwaters Houseboat", "Alappuzha Kerala")
            },
            {
                "id": "munnar_tea_gardens",
                "name": "Munnar Tea Gardens & Eravikulam National Park",
                "category": "Nature",
                "rating": 4.8,
                "entry_fee": 200,
                "duration_hours": 4,
                "opening_hours": "07:30 AM - 04:00 PM",
                "closed_on": "None",
                "description": "Sprawling mist-covered emerald tea plantations home to the rare endangered Nilgiri Tahr mountain goat.",
                "outdoor": True,
                "google_maps_url": make_google_maps_url("Eravikulam National Park Munnar", "Kerala")
            },
            {
                "id": "athirappilly_falls",
                "name": "Athirappilly Waterfalls",
                "category": "Nature",
                "rating": 4.7,
                "entry_fee": 50,
                "duration_hours": 3,
                "opening_hours": "08:00 AM - 06:00 PM",
                "closed_on": "None",
                "description": "The 'Niagara of India', an 80-foot majestic waterfall nestled inside lush Western Ghats reserve forest.",
                "outdoor": True,
                "google_maps_url": make_google_maps_url("Athirappilly Waterfalls", "Thrissur Kerala")
            },
            {
                "id": "varkala_cliff",
                "name": "Varkala Beach & North Cliff",
                "category": "Nature",
                "rating": 4.6,
                "entry_fee": 0,
                "duration_hours": 3,
                "opening_hours": "Open 24 Hours",
                "closed_on": "None",
                "description": "Dramatic red sandstone cliffs adjacent to the Arabian Sea, dotted with seaside cafes and yoga retreats.",
                "outdoor": True,
                "google_maps_url": make_google_maps_url("Varkala Beach Cliff", "Kerala")
            },
            {
                "id": "periyar_sanctuary",
                "name": "Periyar Wildlife Sanctuary Thekkady",
                "category": "Adventure",
                "rating": 4.5,
                "entry_fee": 250,
                "duration_hours": 4,
                "opening_hours": "06:00 AM - 05:00 PM",
                "closed_on": "None",
                "description": "Protected tiger and elephant reserve offering lake boat safaris and guided jungle treks.",
                "outdoor": True,
                "google_maps_url": make_google_maps_url("Periyar National Park", "Thekkady Kerala")
            }
        ],
        "hotels": [
            {
                "id": "ker_budget_1",
                "name": "Fort Bridge Hotel & Residency",
                "style": "Budget",
                "price_per_night": 1400,
                "rating": 4.2,
                "distance_km": 1.2,
                "description": "Clean heritage hotel close to Fort Kochi beach, offering free Wi-Fi, helpful staff, and rooftop breakfast.",
                "trade_off": "Highly economic base in heritage zone; basic room amenities.",
                "google_maps_url": make_google_maps_url("Fort Bridge Hotel", "Fort Kochi Kerala")
            },
            {
                "id": "ker_standard_1",
                "name": "Fort House Hotel Kochi",
                "style": "Standard",
                "price_per_night": 3600,
                "rating": 4.5,
                "distance_km": 0.8,
                "description": "Charming waterfront boutique hotel with lush garden courtyard and acclaimed seafood restaurant.",
                "trade_off": "Balanced comfort with scenic waterfront dining at reasonable rates.",
                "google_maps_url": make_google_maps_url("Fort House Hotel", "Fort Kochi Kerala")
            },
            {
                "id": "ker_premium_1",
                "name": "Brunton Boatyard - CGH Earth",
                "style": "Premium",
                "price_per_night": 8800,
                "rating": 4.7,
                "distance_km": 0.3,
                "description": "Colonial-style luxury harbor resort built on a 19th-century ship yard with sea-facing balconies and pool.",
                "trade_off": "Higher pricing for premium historic charm and direct harbor vistas.",
                "google_maps_url": make_google_maps_url("Brunton Boatyard", "Fort Kochi Kerala")
            },
            {
                "id": "ker_luxury_1",
                "name": "Kumarakom Lake Resort",
                "style": "Luxury",
                "price_per_night": 18500,
                "rating": 4.9,
                "distance_km": 0.1,
                "description": "Award-winning heritage backwater luxury resort featuring meandering pool villas, traditional spa, and sunset cruises.",
                "trade_off": "Top-tier luxury splurge for world-class backwater pampering.",
                "google_maps_url": make_google_maps_url("Kumarakom Lake Resort", "Kerala")
            }
        ]
    },
    "hyderabad": {
        "name": "Hyderabad",
        "state": "Telangana",
        "description": "City of Pearls, famous for its rich history, biryani, and tech hubs.",
        "weather_templates": {
            "summer": {"temp": "35-42°C", "condition": "Hot & Sunny", "rain_chance": 5, "suitability": "Good for indoor activities, evenings outdoor"},
            "monsoon": {"temp": "26-32°C", "condition": "Moderate to Heavy Rain", "rain_chance": 75, "suitability": "Indoor activities recommended, carry umbrella"},
            "winter": {"temp": "15-28°C", "condition": "Pleasant & Clear", "rain_chance": 2, "suitability": "Excellent for outdoor sightseeing"}
        },
        "food": [
            {"name": "Hyderabadi Dum Biryani", "type": "Non-Vegetarian", "description": "Iconic rice dish cooked with meat and spices.", "rating": 4.9, "price_estimate": 350, "places": ["Paradise Biryani", "Bawarchi"], "google_maps_url": make_google_maps_url("Paradise Biryani", "Hyderabad")},
            {"name": "Irani Chai & Osmania Biscuits", "type": "Vegetarian", "description": "Thick milk tea served with sweet-salty cookies.", "rating": 4.9, "price_estimate": 60, "places": ["Nimrah Cafe"], "google_maps_url": make_google_maps_url("Nimrah Cafe", "Charminar Hyderabad")},
            {"name": "Qubani Ka Meetha", "type": "Vegetarian", "description": "Apricot compote served with fresh cream.", "rating": 4.8, "price_estimate": 180, "places": ["Shah Ghouse"], "google_maps_url": make_google_maps_url("Shah Ghouse", "Hyderabad")}
        ],
        "attractions": [
            {"id": "charminar", "name": "Charminar", "category": "Historical", "is_nearby": False, "rating": 4.6, "entry_fee": 40, "duration_hours": 2, "opening_hours": "09:00 AM - 05:30 PM", "closed_on": "None", "description": "Global icon of Hyderabad, built in 1591, featuring four grand minarets.", "outdoor": True, "google_maps_url": make_google_maps_url("Charminar", "Hyderabad")},
            {"id": "golconda_fort", "name": "Golconda Fort", "category": "Historical", "is_nearby": False, "rating": 4.7, "entry_fee": 80, "duration_hours": 3, "opening_hours": "09:00 AM - 05:30 PM", "closed_on": "None", "description": "Famed diamond trading center and majestic fort featuring spectacular acoustic effects.", "outdoor": True, "google_maps_url": make_google_maps_url("Golconda Fort", "Hyderabad")},
            {"id": "salar_jung", "name": "Salar Jung Museum", "category": "Museums", "is_nearby": False, "rating": 4.5, "entry_fee": 100, "duration_hours": 3.5, "opening_hours": "10:00 AM - 05:00 PM", "closed_on": "Friday", "description": "Massive collection of art, sculptures, and historical relics.", "outdoor": False, "google_maps_url": make_google_maps_url("Salar Jung Museum", "Hyderabad")},
            {"id": "chowmahalla", "name": "Chowmahalla Palace", "category": "Historical", "is_nearby": False, "rating": 4.6, "entry_fee": 80, "duration_hours": 2.5, "opening_hours": "10:00 AM - 05:00 PM", "closed_on": "Friday", "description": "Magnificent seat of the Asaf Jahi dynasty, built in neoclassic style.", "outdoor": False, "google_maps_url": make_google_maps_url("Chowmahalla Palace", "Hyderabad")},
            {"id": "hussain_sagar", "name": "Hussain Sagar Lake & Buddha Statue", "category": "Nature", "is_nearby": False, "rating": 4.4, "entry_fee": 100, "duration_hours": 2, "opening_hours": "08:00 AM - 10:00 PM", "closed_on": "None", "description": "Large heart-shaped artificial lake with a giant Buddha statue reached by boat.", "outdoor": True, "google_maps_url": make_google_maps_url("Hussain Sagar Lake", "Hyderabad")},
            {"id": "ramoji", "name": "Ramoji Film City", "category": "Entertainment", "is_nearby": False, "rating": 4.5, "entry_fee": 1300, "duration_hours": 8, "opening_hours": "09:00 AM - 05:30 PM", "closed_on": "None", "description": "World's largest film studio complex with theme park rides.", "outdoor": True, "google_maps_url": make_google_maps_url("Ramoji Film City", "Hyderabad")},
            # Nearby / Surrounding Attractions around Hyderabad
            {"id": "ananthagiri_hills", "name": "Ananthagiri Hills & Vikarabad Forest", "category": "Nearby Excursion", "is_nearby": True, "distance": "75 km from Hyderabad", "rating": 4.8, "entry_fee": 0, "duration_hours": 4, "opening_hours": "Open 24 Hours", "closed_on": "None", "description": "Lush green hill station, coffee plantations, and tranquil trekking trails near Hyderabad.", "outdoor": True, "google_maps_url": make_google_maps_url("Ananthagiri Hills Vikarabad", "Telangana")},
            {"id": "bhongir_fort", "name": "Bhongir Monolithic Rock Fort", "category": "Nearby Excursion", "is_nearby": True, "distance": "48 km from Hyderabad", "rating": 4.6, "entry_fee": 20, "duration_hours": 3, "opening_hours": "09:00 AM - 05:00 PM", "closed_on": "None", "description": "Historic 10th-century fort carved out of an extraordinary single monolithic egg-shaped rock.", "outdoor": True, "google_maps_url": make_google_maps_url("Bhongir Fort", "Telangana")}
        ],
        "hotels": [
            {"id": "hyd_budget_1", "name": "Hotel Santosh Grand", "style": "Budget", "price_per_night": 1200, "rating": 4.0, "distance_km": 3.8, "description": "Cozy rooms near railway station.", "trade_off": "Budget-friendly base.", "google_maps_url": make_google_maps_url("Hotel Santosh Grand", "Hyderabad")},
            {"id": "hyd_standard_1", "name": "Minerva Grand Secunderabad", "style": "Standard", "price_per_night": 2800, "rating": 4.3, "distance_km": 2.1, "description": "Mid-range business hotel with fine dining.", "trade_off": "Balanced comfort.", "google_maps_url": make_google_maps_url("Minerva Grand Secunderabad", "Hyderabad")},
            {"id": "hyd_premium_1", "name": "Taj Banjara Hyderabad", "style": "Premium", "price_per_night": 6500, "rating": 4.6, "distance_km": 1.2, "description": "Overlooks private lake, located in prime Banjara Hills.", "trade_off": "Superior comfort.", "google_maps_url": make_google_maps_url("Taj Banjara", "Hyderabad")},
            {"id": "hyd_luxury_1", "name": "ITC Kohenur Luxury Collection", "style": "Luxury", "price_per_night": 13000, "rating": 4.8, "distance_km": 0.5, "description": "Ultra-modern luxury suites in HITEC city.", "trade_off": "Top-tier luxury.", "google_maps_url": make_google_maps_url("ITC Kohenur", "Hyderabad")}
        ]
    },
    "goa": {
        "name": "Goa",
        "state": "Goa",
        "description": "Famous for pristine beaches, Portuguese heritage churches, seafood, and vibrant nightlife.",
        "weather_templates": {
            "summer": {"temp": "30-36°C", "condition": "Humid & Sunny", "rain_chance": 10, "suitability": "Good for watersports"},
            "monsoon": {"temp": "24-29°C", "condition": "Heavy Rain", "rain_chance": 90, "suitability": "Waterfall tours"},
            "winter": {"temp": "19-31°C", "condition": "Warm & Pleasant", "rain_chance": 0, "suitability": "Perfect for beach"}
        },
        "food": [
            {"name": "Goan Fish Curry Thali", "type": "Non-Vegetarian", "description": "Fresh catch cooked in coconut curry.", "rating": 4.9, "price_estimate": 300, "places": ["Ritz Classic"], "google_maps_url": make_google_maps_url("Ritz Classic", "Goa")},
            {"name": "Bebinca Dessert", "type": "Vegetarian", "description": "Traditional 7-layer Goan pudding cake.", "rating": 4.8, "price_estimate": 150, "places": ["Infantaria Bakery"], "google_maps_url": make_google_maps_url("Infantaria Bakery", "Calangute Goa")}
        ],
        "attractions": [
            {"id": "calangute", "name": "Calangute Beach", "category": "Nature", "is_nearby": False, "rating": 4.4, "entry_fee": 0, "duration_hours": 3, "opening_hours": "06:00 AM - 11:00 PM", "closed_on": "None", "description": "Busy North Goa beach with shacks and watersports.", "outdoor": True, "google_maps_url": make_google_maps_url("Calangute Beach", "Goa")},
            {"id": "bom_jesus", "name": "Basilica of Bom Jesus", "category": "Historical", "is_nearby": False, "rating": 4.7, "entry_fee": 0, "duration_hours": 1.5, "opening_hours": "09:00 AM - 06:30 PM", "closed_on": "None", "description": "UNESCO heritage site with Baroque architecture.", "outdoor": False, "google_maps_url": make_google_maps_url("Basilica of Bom Jesus", "Old Goa")},
            {"id": "fort_aguada", "name": "Fort Aguada & Lighthouse", "category": "Historical", "is_nearby": False, "rating": 4.5, "entry_fee": 25, "duration_hours": 2, "opening_hours": "09:30 AM - 06:00 PM", "closed_on": "None", "description": "17th-century Portuguese fort overlooking Arabian Sea.", "outdoor": True, "google_maps_url": make_google_maps_url("Fort Aguada", "Goa")},
            # Nearby / Surrounding Attractions around Goa
            {"id": "dudhsagar", "name": "Dudhsagar Waterfalls & Spice Plantation", "category": "Nearby Excursion", "is_nearby": True, "distance": "60 km from Panaji", "rating": 4.8, "entry_fee": 450, "duration_hours": 5, "opening_hours": "09:00 AM - 05:00 PM", "closed_on": "None", "description": "Four-tiered majestic waterfall in Western Ghats combined with organic spice plantation guided tour.", "outdoor": True, "google_maps_url": make_google_maps_url("Dudhsagar Waterfalls", "Goa")},
            {"id": "divar_island", "name": "Divar Island Heritage Village", "category": "Nearby Excursion", "is_nearby": True, "distance": "Ferry from Old Goa", "rating": 4.7, "entry_fee": 0, "duration_hours": 3, "opening_hours": "Open 24 Hours", "closed_on": "None", "description": "Tranquil island getaway in Mandovi river featuring vintage Indo-Portuguese villas and scenic paddy fields.", "outdoor": True, "google_maps_url": make_google_maps_url("Divar Island", "Goa")}
        ],
        "hotels": [
            {"id": "goa_budget_1", "name": "Bunkd Hostel Anjuna", "style": "Budget", "price_per_night": 750, "rating": 4.1, "distance_km": 1.5, "description": "Social hostel with garden vibe.", "trade_off": "Highly budget friendly.", "google_maps_url": make_google_maps_url("Bunkd Hostel", "Anjuna Goa")},
            {"id": "goa_standard_1", "name": "Calangute Beach Holiday Resort", "style": "Standard", "price_per_night": 3200, "rating": 4.2, "distance_km": 0.3, "description": "Family hotel steps from beach.", "trade_off": "Great beach proximity.", "google_maps_url": make_google_maps_url("Calangute Beach Holiday Resort", "Goa")},
            {"id": "goa_luxury_1", "name": "Taj Exotica Resort & Spa", "style": "Luxury", "price_per_night": 17500, "rating": 4.9, "distance_km": 0.1, "description": "Luxury sea-facing resort in Benaulim.", "trade_off": "Top luxury experience.", "google_maps_url": make_google_maps_url("Taj Exotica Resort", "Benaulim Goa")}
        ]
    }
}

TRANSPORT_OPTIONS = {
    ("vijayawada", "kerala"): [
        {
            "mode": "Flight",
            "name": "IndiGo Direct Flight 6E-724 (Vijayawada to Kochi)",
            "cost_per_person": 4800,
            "duration_hours": 2.5,
            "departure": "09:40 AM",
            "arrival": "12:10 PM",
            "suitability": "Fastest non-stop flight transit from Vijayawada to Kerala.",
            "comfort_tier": "Comfortable"
        },
        {
            "mode": "Flight",
            "name": "Air India Saver Morning Flight (via Bengaluru)",
            "cost_per_person": 3950,
            "duration_hours": 3.5,
            "departure": "06:15 AM",
            "arrival": "09:45 AM",
            "suitability": "Early morning connecting flight for a full day of sightseeing upon arrival.",
            "comfort_tier": "Comfortable"
        },
        {
            "mode": "Train",
            "name": "Vande Bharat Express (Vijayawada to Ernakulam)",
            "cost_per_person": 1750,
            "duration_hours": 12.0,
            "departure": "05:30 AM",
            "arrival": "05:30 PM",
            "suitability": "High-speed premium rail transit with complimentary meals & panoramic windows.",
            "comfort_tier": "Comfortable"
        },
        {
            "mode": "Train",
            "name": "Sabari Express (17230) 3AC / Sleeper",
            "cost_per_person": 650,
            "duration_hours": 16.0,
            "departure": "10:20 PM",
            "arrival": "02:20 PM (Next Day)",
            "suitability": "Direct overnight train from Vijayawada to Ernakulam/Kochi.",
            "comfort_tier": "Standard"
        },
        {
            "mode": "Train",
            "name": "Kerala Express (12626) Superfast",
            "cost_per_person": 780,
            "duration_hours": 15.0,
            "departure": "08:10 PM",
            "arrival": "11:10 AM (Next Day)",
            "suitability": "Popular superfast express linking AP and Kerala.",
            "comfort_tier": "Standard"
        },
        {
            "mode": "Bus",
            "name": "Kallada / IntrCity AC Multi-Axle Sleeper",
            "cost_per_person": 1600,
            "duration_hours": 15.5,
            "departure": "05:00 PM",
            "arrival": "08:30 AM (Next Day)",
            "suitability": "Luxury AC sleeper bus with Wi-Fi, charging points & live tracking.",
            "comfort_tier": "Standard"
        },
        {
            "mode": "Bus",
            "name": "KSRTC Swift Deluxe AC Semi-Sleeper",
            "cost_per_person": 1100,
            "duration_hours": 16.0,
            "departure": "04:30 PM",
            "arrival": "08:30 AM (Next Day)",
            "suitability": "Reliable state intercity bus service with comfortable reclining seats.",
            "comfort_tier": "Standard"
        },
        {
            "mode": "Car",
            "name": "Private Outstation Chauffeur SUV (Ertiga / Innova)",
            "cost_per_person": 3400,
            "duration_hours": 14.0,
            "departure": "Flexi / On-Demand",
            "arrival": "Doorstep Pickup & Drop",
            "suitability": "Door-to-door private cab transfer with flexible scenic stopovers.",
            "comfort_tier": "Luxury"
        },
        {
            "mode": "Car",
            "name": "Self-Drive SUV Rental (Zoomcar / Revv)",
            "cost_per_person": 2200,
            "duration_hours": 14.5,
            "departure": "Flexi / Self-Drive",
            "arrival": "Self-Drive Highway Transit",
            "suitability": "Complete freedom and flexibility to drive at your own pace.",
            "comfort_tier": "Comfortable"
        }
    ],
    ("vijayawada", "hyderabad"): [
        {
            "mode": "Flight",
            "name": "IndiGo Flight 6E-7281 (Vijayawada to Hyderabad)",
            "cost_per_person": 3200,
            "duration_hours": 1.0,
            "departure": "09:30 AM",
            "arrival": "10:30 AM",
            "suitability": "Fastest 1-hour flight transit.",
            "comfort_tier": "Comfortable"
        },
        {
            "mode": "Train",
            "name": "Vande Bharat Express (20833)",
            "cost_per_person": 950,
            "duration_hours": 4.0,
            "departure": "03:20 PM",
            "arrival": "07:20 PM",
            "suitability": "Premium high-speed rail with meal service.",
            "comfort_tier": "Comfortable"
        },
        {
            "mode": "Train",
            "name": "Satavahana Express (12713)",
            "cost_per_person": 350,
            "duration_hours": 5.5,
            "departure": "06:10 AM",
            "arrival": "11:40 AM",
            "suitability": "Popular morning express train.",
            "comfort_tier": "Standard"
        },
        {
            "mode": "Bus",
            "name": "APSRTC Amaravati AC Multi-Axle",
            "cost_per_person": 650,
            "duration_hours": 5.0,
            "departure": "02:00 PM",
            "arrival": "07:00 PM",
            "suitability": "Frequent hourly luxury buses.",
            "comfort_tier": "Standard"
        },
        {
            "mode": "Bus",
            "name": "Orange Tours AC Sleeper Bus",
            "cost_per_person": 850,
            "duration_hours": 5.5,
            "departure": "11:00 PM",
            "arrival": "04:30 AM (Next Day)",
            "suitability": "Overnight AC sleeper bus.",
            "comfort_tier": "Standard"
        },
        {
            "mode": "Car",
            "name": "Private Highway Cab (Sedan / SUV)",
            "cost_per_person": 1800,
            "duration_hours": 4.5,
            "departure": "Flexi / On-Demand",
            "arrival": "Doorstep Pickup & Drop",
            "suitability": "Fastest highway drive via NH65.",
            "comfort_tier": "Luxury"
        }
    ]
}

def get_destination_data(destination: str) -> dict:
    """Returns static destination details if available, or dynamically creates realistic data."""
    dest_clean = destination.lower().strip()
    if dest_clean in DESTINATIONS:
        return DESTINATIONS[dest_clean]
        
    # Check partial match (e.g., 'kochi' or 'munnar' -> 'kerala')
    for key, val in DESTINATIONS.items():
        if key in dest_clean or dest_clean in key:
            return val
            
    # Dynamic fallback generator for any unspecified destination
    title = destination.strip().title()
    return {
        "name": title,
        "state": title,
        "description": f"Top-rated travel destination {title}, renowned for rich heritage, local culture, scenic attractions, and authentic regional cuisine.",
        "weather_templates": {
            "summer": {"temp": "28-36°C", "condition": "Warm & Sunny", "rain_chance": 15, "suitability": "Good for sightseeing"},
            "monsoon": {"temp": "22-28°C", "condition": "Light to Moderate Rain", "rain_chance": 60, "suitability": "Indoor activities"},
            "winter": {"temp": "16-26°C", "condition": "Pleasant & Clear", "rain_chance": 5, "suitability": "Ideal weather"}
        },
        "food": [
            {
                "name": f"Authentic {title} Special Thali",
                "type": "Vegetarian",
                "description": f"Traditional platter featuring local seasonal vegetables, lentils, breads, and desserts of {title}.",
                "rating": 4.8,
                "price_estimate": 250,
                "places": [f"Central Diner {title}", f"Heritage Restaurant"],
                "google_maps_url": make_google_maps_url(f"Famous Food Restaurant", title)
            },
            {
                "name": f"Signature Regional Curry & Bread",
                "type": "Non-Vegetarian",
                "description": f"Flavorful slow-cooked curry with aromatic local spices.",
                "rating": 4.7,
                "price_estimate": 320,
                "places": [f"{title} Food Court"],
                "google_maps_url": make_google_maps_url(f"Popular Restaurant", title)
            },
            {
                "name": f"Famous Local Street Snacks & Tea",
                "type": "Vegetarian",
                "description": f"Fresh hot savory snacks served with spiced tea.",
                "rating": 4.9,
                "price_estimate": 90,
                "places": [f"Market Street Stalls {title}"],
                "google_maps_url": make_google_maps_url(f"Famous Market", title)
            }
        ],
        "attractions": [
            {
                "id": f"{dest_clean}_attr_1",
                "name": f"Historic Central Fortress & Palace",
                "category": "Historical",
                "is_nearby": False,
                "rating": 4.7,
                "entry_fee": 50,
                "duration_hours": 2.5,
                "opening_hours": "09:00 AM - 05:30 PM",
                "closed_on": "None",
                "description": f"Iconic historic landmark showcasing architectural marvels and heritage galleries of {title}.",
                "outdoor": True,
                "google_maps_url": make_google_maps_url(f"Historic Fort Palace", title)
            },
            {
                "id": f"{dest_clean}_attr_2",
                "name": f"{title} Botanical Gardens & Lake Park",
                "category": "Nature",
                "is_nearby": False,
                "rating": 4.6,
                "entry_fee": 30,
                "duration_hours": 2,
                "opening_hours": "06:00 AM - 07:00 PM",
                "closed_on": "None",
                "description": f"Serene natural park with blooming flora, tranquil walking paths, and boating facilities in {title}.",
                "outdoor": True,
                "google_maps_url": make_google_maps_url(f"Botanical Gardens Lake Park", title)
            },
            {
                "id": f"{dest_clean}_attr_3",
                "name": f"{title} State Heritage Museum",
                "category": "Museums",
                "is_nearby": False,
                "rating": 4.5,
                "entry_fee": 80,
                "duration_hours": 2,
                "opening_hours": "10:00 AM - 05:00 PM",
                "closed_on": "Monday",
                "description": f"Fascinating museum displaying ancient artifacts, royal armor, sculpture, and vintage photo archives.",
                "outdoor": False,
                "google_maps_url": make_google_maps_url(f"State Heritage Museum", title)
            },
            {
                "id": f"{dest_clean}_attr_4",
                "name": f"Grand Bazaar & Handicraft Street",
                "category": "Shopping",
                "is_nearby": False,
                "rating": 4.4,
                "entry_fee": 0,
                "duration_hours": 2.5,
                "opening_hours": "10:30 AM - 09:00 PM",
                "closed_on": "None",
                "description": f"Bustling traditional market famous for local textiles, handloom goods, spices, and souvenirs.",
                "outdoor": True,
                "google_maps_url": make_google_maps_url(f"Main Market Street", title)
            },
            # Nearby / Surrounding Attractions (Apart from main city center)
            {
                "id": f"{dest_clean}_nearby_1",
                "name": f"Nearby Scenic Waterfalls & Nature Reserve ({title} Outskirts)",
                "category": "Nearby Excursion",
                "is_nearby": True,
                "distance": "15 km from center",
                "rating": 4.8,
                "entry_fee": 20,
                "duration_hours": 3,
                "opening_hours": "07:00 AM - 06:00 PM",
                "closed_on": "None",
                "description": f"Breathtaking nearby natural spot featuring lush forest trails, cascading streams, and fresh air just outside {title}.",
                "outdoor": True,
                "google_maps_url": make_google_maps_url(f"Waterfalls Nature Reserve near", title)
            },
            {
                "id": f"{dest_clean}_nearby_2",
                "name": f"Nearby Ancient Rock Temple & Hilltop Viewpoint ({title} Suburbs)",
                "category": "Nearby Excursion",
                "is_nearby": True,
                "distance": "18 km from center",
                "rating": 4.7,
                "entry_fee": 25,
                "duration_hours": 2.5,
                "opening_hours": "06:00 AM - 06:00 PM",
                "closed_on": "None",
                "description": f"Historic rock-cut cave shrine and scenic hill viewpoint located in countryside near {title}.",
                "outdoor": True,
                "google_maps_url": make_google_maps_url(f"Ancient Temple hill near", title)
            },
            {
                "id": f"{dest_clean}_nearby_3",
                "name": f"Nearby Handicraft Village & Organic Farm",
                "category": "Nearby Excursion",
                "is_nearby": True,
                "distance": "12 km from center",
                "rating": 4.6,
                "entry_fee": 0,
                "duration_hours": 2,
                "opening_hours": "09:00 AM - 07:00 PM",
                "closed_on": "None",
                "description": f"Authentic nearby artisan village where local craftsmen demonstrate traditional pottery, weaving, and regional farm dining.",
                "outdoor": True,
                "google_maps_url": make_google_maps_url(f"Handicraft Village near", title)
            }
        ],
        "hotels": [
            {
                "id": f"{dest_clean}_budget_1",
                "name": f"{title} Backpacker Lodge",
                "style": "Budget",
                "price_per_night": 1100,
                "rating": 4.1,
                "distance_km": 2.2,
                "description": "Clean economic rooms near central transport hub with free Wi-Fi.",
                "trade_off": "Budget friendly base.",
                "google_maps_url": make_google_maps_url(f"Budget Lodge", title)
            },
            {
                "id": f"{dest_clean}_standard_1",
                "name": f"{title} Grand Residency",
                "style": "Standard",
                "price_per_night": 3200,
                "rating": 4.4,
                "distance_km": 1.1,
                "description": "Comfortable mid-range hotel with modern amenities and complimentary breakfast.",
                "trade_off": "Balanced price and comfort.",
                "google_maps_url": make_google_maps_url(f"Grand Hotel", title)
            },
            {
                "id": f"{dest_clean}_luxury_1",
                "name": f"The Royal Palace Resort {title}",
                "style": "Luxury",
                "price_per_night": 12500,
                "rating": 4.8,
                "distance_km": 0.4,
                "description": "Luxury 5-star resort featuring swimming pool, wellness spa, and gourmet dining.",
                "trade_off": "Top luxury pampering.",
                "google_maps_url": make_google_maps_url(f"Royal Palace Resort", title)
            }
        ]
    }

def search_hotels(destination: str, style: str = "Standard") -> list:
    """Finds hotels for a destination matching style tier with Google Maps URLs."""
    dest_data = get_destination_data(destination)
    all_hotels = dest_data.get("hotels", [])
    
    # Ensure google_maps_url exists on all hotel entries
    for h in all_hotels:
        if "google_maps_url" not in h:
            h["google_maps_url"] = make_google_maps_url(h["name"], destination)
            
    if style == "No preference":
        return all_hotels
        
    matched = [h for h in all_hotels if h.get("style", "").lower() == style.lower()]
    if not matched:
        return all_hotels
    return matched

def search_transport(start: str, end: str, style: str = "Balanced") -> list:
    """Finds comprehensive transport options (Train, Bus, Flight, Cab, Self-Drive). Returns sorted options based on user style."""
    s_clean = start.lower().strip()
    e_clean = end.lower().strip()
    
    options = TRANSPORT_OPTIONS.get((s_clean, e_clean))
    if not options:
        options = TRANSPORT_OPTIONS.get((e_clean, s_clean))
        
    if not options or len(options) < 4:
        # Dynamic realistic multi-modal transport choices for any origin and destination
        options = [
            {
                "mode": "Flight",
                "name": f"IndiGo Direct Non-Stop Flight ({start} to {end})",
                "cost_per_person": 4200,
                "duration_hours": 1.5,
                "departure": "11:30 AM",
                "arrival": "01:00 PM",
                "suitability": "Fastest non-stop flight transit, ideal to maximize time at destination.",
                "comfort_tier": "Comfortable"
            },
            {
                "mode": "Flight",
                "name": f"Air India / Akasa Saver Morning Flight",
                "cost_per_person": 3450,
                "duration_hours": 1.5,
                "departure": "06:15 AM",
                "arrival": "07:45 AM",
                "suitability": "Early morning flight for a full day of sightseeing upon arrival.",
                "comfort_tier": "Comfortable"
            },
            {
                "mode": "Train",
                "name": f"Vande Bharat Express ({start} to {end})",
                "cost_per_person": 1450,
                "duration_hours": 5.5,
                "departure": "06:00 AM",
                "arrival": "11:30 AM",
                "suitability": "High-speed premium rail transit with complimentary meals & panoramic views.",
                "comfort_tier": "Comfortable"
            },
            {
                "mode": "Train",
                "name": f"Superfast AC 3-Tier / Sleeper Express",
                "cost_per_person": 580,
                "duration_hours": 7.5,
                "departure": "09:30 PM",
                "arrival": "05:00 AM (Next Day)",
                "suitability": "Economical overnight train journey, ideal for budget travelers.",
                "comfort_tier": "Standard"
            },
            {
                "mode": "Train",
                "name": f"Jan Shatabdi Day Express (Chair Car)",
                "cost_per_person": 380,
                "duration_hours": 6.5,
                "departure": "07:15 AM",
                "arrival": "01:45 PM",
                "suitability": "Budget-friendly daytime express train with scenic countryside views.",
                "comfort_tier": "Standard"
            },
            {
                "mode": "Bus",
                "name": f"IntrCity Volvo AC Multi-Axle Sleeper",
                "cost_per_person": 1200,
                "duration_hours": 7.0,
                "departure": "10:30 PM",
                "arrival": "05:30 AM (Next Day)",
                "suitability": "Luxury sleeper berths with Wi-Fi, charging points & live GPS tracking.",
                "comfort_tier": "Standard"
            },
            {
                "mode": "Bus",
                "name": f"State Express Super Deluxe AC Seater",
                "cost_per_person": 750,
                "duration_hours": 7.5,
                "departure": "02:00 PM",
                "arrival": "09:30 PM",
                "suitability": "Frequent daytime intercity service with comfortable reclining seats.",
                "comfort_tier": "Standard"
            },
            {
                "mode": "Car",
                "name": f"Private Chauffeur Sedan / SUV Outstation Cab",
                "cost_per_person": 2800,
                "duration_hours": 6.0,
                "departure": "Flexi / On-Demand",
                "arrival": "Doorstep Pickup & Drop",
                "suitability": "Door-to-door private cab transfer with flexible stopovers on route.",
                "comfort_tier": "Luxury"
            },
            {
                "mode": "Car",
                "name": f"Self-Drive SUV Rental (Zoomcar / Revv)",
                "cost_per_person": 1950,
                "duration_hours": 6.5,
                "departure": "Flexi / Self-Drive",
                "arrival": "Self-Drive Highway Transit",
                "suitability": "Complete freedom and flexibility to drive at your own pace with unlimited km.",
                "comfort_tier": "Comfortable"
            }
        ]
        
    if style == "Cheapest":
        return sorted(options, key=lambda x: x["cost_per_person"])
    elif style == "Fastest":
        return sorted(options, key=lambda x: x["duration_hours"])
    elif style == "Comfortable":
        return sorted(options, key=lambda x: 0 if x["mode"] in ["Flight", "Car"] else 1)
    else:
        return options

def get_attractions(destination: str, interests: list = None) -> list:
    """Finds attractions for a destination matching user interests PLUS nearby excursions with Google Maps URLs."""
    dest_data = get_destination_data(destination)
    all_attractions = dest_data.get("attractions", [])
    
    # Ensure google_maps_url and is_nearby flag exist on all attractions
    for attr in all_attractions:
        if "google_maps_url" not in attr:
            attr["google_maps_url"] = make_google_maps_url(attr["name"], destination)
        if "is_nearby" not in attr:
            attr["is_nearby"] = (attr.get("category") == "Nearby Excursion")
            
    if not interests:
        return all_attractions
        
    matched = []
    interest_lower = [i.lower() for i in interests]
    
    # 1. Main attractions matching user interests
    for attr in all_attractions:
        if not attr.get("is_nearby") and attr.get("category", "").lower() in interest_lower:
            matched.append(attr)
            
    # 2. Main attractions with high ratings
    for attr in all_attractions:
        if not attr.get("is_nearby") and attr not in matched and attr.get("rating", 0) >= 4.5:
            matched.append(attr)
            
    # 3. Always append nearby & surrounding excursions
    for attr in all_attractions:
        if attr.get("is_nearby") and attr not in matched:
            matched.append(attr)
            
    if not matched:
        return all_attractions
    return matched
