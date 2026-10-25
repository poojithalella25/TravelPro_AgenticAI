import re

# Local Knowledge Base of Destination Guides, Transit Advice, and Travel Tips
KNOWLEDGE_BASE = {
    "hyderabad": [
        {
            "topic": "Safety and Rules",
            "content": "Hyderabad is generally safe for travelers. Dress modestly when visiting religious sites like Mecca Masjid or Birla Mandir. Do not carry leather items inside temple inner sanctums. Police patrol (She Teams) are active for women safety."
        },
        {
            "topic": "Local Transit Hacks",
            "content": "Use the Hyderabad Metro for fast travel between Secunderabad, Ameerpet, and HITEC City to avoid peak-hour road traffic. For old city areas like Charminar, auto-rickshaws are convenient but negotiate pricing beforehand, or use ride-hailing apps like Ola/Uber/Rapido."
        },
        {
            "topic": "Hidden Gems & Food Culture",
            "content": "For authentic Irani Chai, head to Nimrah Cafe right next to Charminar. Try Mozamjahi Market for famous local ice creams. Visit the Qutb Shahi Tombs nearby Golconda for a quieter historical experience than the main fort."
        },
        {
            "topic": "Ticketing and Timing Advice",
            "content": "Golconda Fort sound & light show runs in the evening (6:30 PM - 8:00 PM). Booking online via the ASI website is highly recommended to skip long ticket counter lines at Golconda Fort and Salar Jung Museum."
        }
    ],
    "goa": [
        {
            "topic": "Safety and Rules",
            "content": "Swimming in the ocean during monsoon (June to September) is strictly prohibited due to strong currents. Do not litter beaches; Goa has strict laws with heavy fines for public littering and drinking on beaches."
        },
        {
            "topic": "Local Transit Hacks",
            "content": "Public transport is sparse. Renting a scooter/bike (around ₹350-500/day) is the most popular way to explore Goa. Remember to wear a helmet (both rider and pillion) as Goan traffic police are very strict. Taxis can be expensive as they do not run on meters."
        },
        {
            "topic": "Hidden Gems & Food Culture",
            "content": "Visit Fontainhas (the Latin Quarter in Panaji) early morning for empty colorful lanes and traditional Portuguese bakeries like Confeitaria 31 de Janeiro. Try Bebinca dessert at Viva Panjim."
        },
        {
            "topic": "Ticketing and Timing Advice",
            "content": "For Dudhsagar Waterfalls, jeep safaris must be booked early in the morning at the Collem border. Private vehicles are not allowed into the national park area containing the falls."
        }
    ],
    "chennai": [
        {
            "topic": "Safety and Rules",
            "content": "Temples in Chennai enforce strict dress codes (no shorts or sleeveless tops). Remove footwear outside temples. Keep hydrated as Chennai is humid year-round."
        },
        {
            "topic": "Local Transit Hacks",
            "content": "Chennai Suburban Railway and MRTS are excellent for avoiding road traffic when traveling to beach destinations or Mylapore. Auto-rickshaws are notorious for high fares; always use Ola/Uber for transparent pricing."
        },
        {
            "topic": "Hidden Gems & Food Culture",
            "content": "Try filter coffee at Ratna Cafe in Triplicane along with their famous sambar. Visit the Theosophical Society gardens in Adyar for a peaceful walk under a 450-year-old banyan tree."
        }
    ]
}

def retrieve_context(destination: str, query: str = "") -> str:
    """
    RAG Retriever. Retrieves matching guide articles for the destination.
    Uses basic keyword keyword scoring.
    """
    dest_key = destination.lower().strip()
    if dest_key not in KNOWLEDGE_BASE:
        return f"No specific local guide documents found for {destination}. Defaulting to general Indian travel safety guidelines: drink bottled water, keep digital copies of documents, and use official taxis."

    articles = KNOWLEDGE_BASE[dest_key]
    if not query:
        # Return all articles summarized
        return "\n\n".join([f"### {a['topic']}\n{a['content']}" for a in articles])

    # Simple keyword match
    keywords = re.findall(r'\w+', query.lower())
    matched_articles = []
    for art in articles:
        score = 0
        art_text = (art["topic"] + " " + art["content"]).lower()
        for kw in keywords:
            if kw in art_text:
                score += 1
        if score > 0:
            matched_articles.append((score, art))

    if not matched_articles:
        # Return first two articles as fallback
        matched_articles = [(0, art) for art in articles[:2]]

    # Sort by score descending
    matched_articles.sort(key=lambda x: x[0], reverse=True)
    
    context_chunks = []
    for _, art in matched_articles:
        context_chunks.append(f"Source Topic: {art['topic']}\nContext: {art['content']}")

    return "\n\n".join(context_chunks)
