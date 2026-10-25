export interface PlaceInfo {
  name: string;
  category: string;
  image: string;
  description: string;
  nearbyPlaces: string[];
}

export interface RegionData {
  id: string;
  name: string;
  type: 'State' | 'Union Territory';
  capital: string;
  bestSeason: string;
  goodPeriod?: string;
  bestMonths: string[];
  description: string;
  coverImage: string;
  places: PlaceInfo[];
}

export interface MonthlyStrategy {
  month: string;
  states: string[];
  description: string;
  icon: string;
  seasonTag: string;
}

export const MONTHLY_TRAVEL_STRATEGY: MonthlyStrategy[] = [
  {
    month: 'January',
    states: ['Rajasthan', 'Gujarat'],
    description: 'Pleasant winter weather ideal for desert safaris, fort exploration, and Rann Utsav in Kutch.',
    icon: '🏜️',
    seasonTag: 'Winter Royalty & Desert Festivals'
  },
  {
    month: 'February',
    states: ['Kerala', 'Tamil Nadu'],
    description: 'Cool coastal breeze, lush tea plantations in Munnar, backwaters, and grand Dravidian temple architecture.',
    icon: '🌴',
    seasonTag: 'Backwaters & Heritage Coast'
  },
  {
    month: 'March',
    states: ['Assam', 'Meghalaya', 'Arunachal Pradesh', 'Sikkim', 'Manipur', 'Mizoram', 'Nagaland', 'Tripura'],
    description: 'Spring blossom in Northeast India, living root bridges, Kaziranga rhinos, and crisp mountain skies.',
    icon: '🌿',
    seasonTag: 'Northeast Spring & Wildlife'
  },
  {
    month: 'April',
    states: ['Jammu & Kashmir', 'Himachal Pradesh'],
    description: 'Tulip festivals in Srinagar, valley blooms in Shimla & Manali, and clear alpine mountain vistas.',
    icon: '🌷',
    seasonTag: 'Valley Blooms & Cool Escapes'
  },
  {
    month: 'May',
    states: ['Ladakh', 'Uttarakhand'],
    description: 'Passes open in high Himalayas, Pangong Lake trips, and cool summer retreats in Mussoorie, Nainital & Rishikesh.',
    icon: '🏔️',
    seasonTag: 'High Mountain Passes & Pilgrimage'
  },
  {
    month: 'June',
    states: ['Himachal Pradesh', 'Sikkim'],
    description: 'High-altitude treks in Spiti Valley, Gangtok, and escaping the summer heat in pristine Himalayan ridges.',
    icon: '⛰️',
    seasonTag: 'High Altitude Escapes'
  },
  {
    month: 'July',
    states: ['Maharashtra', 'Goa', 'Karnataka'],
    description: 'Monsoon Magic! Gushing waterfalls at Dudhsagar, mist-covered Western Ghats in Lonavala, Coorg, & Hampi.',
    icon: '🌧️',
    seasonTag: 'Monsoon Ghats & Waterfalls'
  },
  {
    month: 'August',
    states: ['Kerala', 'Karnataka', 'Meghalaya'],
    description: 'Cherrapunji & Dawki rain magic, Snake Boat races in Alleppey, and coffee estate freshness in Chikmagalur.',
    icon: '🚣',
    seasonTag: 'Rainforest Mist & Boat Races'
  },
  {
    month: 'September',
    states: ['Assam', 'Meghalaya', 'Kerala', 'Sikkim'],
    description: 'Post-monsoon freshness, clear green landscapes, roaring waterfalls, and serene tea garden walks.',
    icon: '🌄',
    seasonTag: 'Post-Monsoon Verdant Vistas'
  },
  {
    month: 'October',
    states: ['Rajasthan', 'Gujarat', 'Uttar Pradesh'],
    description: 'Festival season kickoff (Durga Puja, Diwali preparations), pleasant weather in Jaipur, Agra, and Dwarka.',
    icon: '🪔',
    seasonTag: 'Festive Culture & Golden Triangle'
  },
  {
    month: 'November',
    states: ['Goa', 'Rajasthan', 'Madhya Pradesh'],
    description: 'Pushkar Camel Fair in Rajasthan, Khajuraho & Ujjain spiritual circuits, and sunny beaches in Goa.',
    icon: '🏰',
    seasonTag: 'Beach Sunsets & Heritage Fairs'
  },
  {
    month: 'December',
    states: ['Goa', 'Kerala', 'Andaman & Nicobar', 'Rajasthan'],
    description: 'Peak winter holiday season! Beach parties in Goa, Havelock scuba diving, and campfire desert nights in Jaisalmer.',
    icon: '🎉',
    seasonTag: 'Winter Carnival & Island Sunshine'
  }
];

export const INDIA_STATES_AND_UTS: RegionData[] = [
  // ==================== 28 STATES ====================
  {
    id: 'andhra-pradesh',
    name: 'Andhra Pradesh',
    type: 'State',
    capital: 'Amaravati',
    bestSeason: 'October to March',
    bestMonths: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
    description: 'Famous for the sacred Tirupati temple, pristine Araku Valley coffee hills, Vizag coastal beauty, and historic monuments of Amaravati and Srisailam.',
    coverImage: 'https://images.unsplash.com/photo-1627894483216-2138af692e32?q=80&w=1200',
    places: [
      {
        name: 'Visakhapatnam',
        category: 'Beach & Coastal',
        image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?q=80&w=600',
        description: 'Port city with picturesque RK Beach, Rushikonda water sports, and Submarine Museum.',
        nearbyPlaces: ['Araku Valley', 'Borra Caves', 'Bheemunipatnam Beach', 'Kailasagiri']
      },
      {
        name: 'Araku Valley',
        category: 'Hill Station',
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=600',
        description: 'Scenic valley tucked in the Eastern Ghats known for coffee plantations and tribal culture.',
        nearbyPlaces: ['Borra Caves', 'Katiki Waterfalls', 'Chaparai Water Cascade', 'Ananthagiri Hills']
      },
      {
        name: 'Tirupati',
        category: 'Spiritual',
        image: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?q=80&w=600',
        description: 'World-famous pilgrimage site home to Sri Venkateswara Swamy Temple on Seven Hills.',
        nearbyPlaces: ['Tirumala Hills', 'Sri Kalahasti', 'Kanipakam', 'Chandragiri Fort']
      },
      {
        name: 'Vijayawada',
        category: 'Heritage & Culture',
        image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=600',
        description: 'Commercial hub on the banks of Krishna River featuring Kanaka Durga Temple and Prakasam Barrage.',
        nearbyPlaces: ['Undavalli Caves', 'Bhavani Island', 'Amaravati', 'Kondapalli Fort']
      },
      {
        name: 'Amaravati',
        category: 'Heritage & Buddhist',
        image: 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?q=80&w=600',
        description: 'Historic city renowned for ancient Buddhist stupas and Dhyana Buddha Statue.',
        nearbyPlaces: ['Vijayawada', 'Undavalli Caves', 'Kondaveedu Fort']
      },
      {
        name: 'Srisailam',
        category: 'Spiritual & Nature',
        image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?q=80&w=600',
        description: 'Jyotirlinga shrine set deep in Nallamala forest with Srisailam Dam and ropeway.',
        nearbyPlaces: ['Akka Mahadevi Caves', 'Pathala Ganga', 'Nallamala Tiger Reserve']
      },
      {
        name: 'Rajahmundry',
        category: 'Cultural & Riverfront',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600',
        description: 'Cultural capital of AP along Godavari river, gateway to Papikondalu boat tours.',
        nearbyPlaces: ['Papikondalu Hills', 'Kadiyapulanka Flower Gardens', 'Maredumilli Eco Tourism']
      }
    ]
  },
  {
    id: 'arunachal-pradesh',
    name: 'Arunachal Pradesh',
    type: 'State',
    capital: 'Itanagar',
    bestSeason: 'October to April',
    bestMonths: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'],
    description: 'The Land of Dawn-Lit Mountains featuring snow-capped peaks, ancient Buddhist monasteries, and pristine valleys.',
    coverImage: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?q=80&w=1200',
    places: [
      {
        name: 'Tawang',
        category: 'Buddhist & Mountains',
        image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=600',
        description: 'High-altitude town hosting India’s largest Buddhist monastery and Sela Pass.',
        nearbyPlaces: ['Sela Pass', 'Madhuri Lake (Sangetsar)', 'Tawang Monastery', 'Pangang Teng Tso Lake']
      },
      {
        name: 'Ziro',
        category: 'Valleys & Music',
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=600',
        description: 'UNESCO heritage paddy landscape inhabited by Apatani tribe, host of Ziro Festival.',
        nearbyPlaces: ['Talley Valley Wildlife Sanctuary', 'Kile Pakho', 'Tarin Fish Farm']
      },
      {
        name: 'Mechuka',
        category: 'Offbeat Adventure',
        image: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?q=80&w=600',
        description: 'Enchanting valley near China border with wooden houses and Yargyap Chu river.',
        nearbyPlaces: ['Samten Yongcha Monastery', 'Gurudwara Mechuka', 'Taposthi Cave']
      },
      {
        name: 'Dirang',
        category: 'Valley & Hot Springs',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600',
        description: 'Charming valley between Bomdila and Tawang known for hot water springs and apple orchards.',
        nearbyPlaces: ['Dirang Dzong', 'Hot Water Spring', 'Sangti Valley']
      },
      {
        name: 'Bomdila',
        category: 'Hill Station',
        image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=600',
        description: 'Scenic town offering Himalayan views, apple orchards, and Bomdila Monastery.',
        nearbyPlaces: ['Bomdila View Point', 'RR Hill', 'Eagle Nest Wildlife Sanctuary']
      },
      {
        name: 'Itanagar',
        category: 'Capital & Heritage',
        image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=600',
        description: 'State capital featuring Ita Fort, Ganga Lake (Gyakar Sinyi), and State Museum.',
        nearbyPlaces: ['Ganga Lake', 'Ita Fort', 'Polo Park', 'Namdapha National Park']
      }
    ]
  },
  {
    id: 'assam',
    name: 'Assam',
    type: 'State',
    capital: 'Dispur',
    bestSeason: 'November to April',
    bestMonths: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'],
    description: 'Gateway to Northeast India, famous for Kaziranga rhinos, Brahmaputra river islands, and rolling tea gardens.',
    coverImage: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?q=80&w=1200',
    places: [
      {
        name: 'Kaziranga',
        category: 'Wildlife Safari',
        image: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?q=80&w=600',
        description: 'UNESCO World Heritage site home to two-thirds of the world’s Great One-horned Rhinoceroses.',
        nearbyPlaces: ['Kaziranga National Orchid Park', 'Kakochang Waterfall', 'Addabarie Tea Estate']
      },
      {
        name: 'Guwahati',
        category: 'Spiritual & City',
        image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?q=80&w=600',
        description: 'Brahmaputra river metropolis famous for sacred Kamakhya Temple and Umananda Island.',
        nearbyPlaces: ['Kamakhya Temple', 'Umananda Peacock Island', 'Pobitora Wildlife Sanctuary', 'Sualkuchi']
      },
      {
        name: 'Majuli',
        category: 'River Island & Culture',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600',
        description: 'World’s largest inhabited freshwater river island, hub of Neo-Vaishnavite Satra culture.',
        nearbyPlaces: ['Kamalabari Satra', 'Auniati Satra', 'Tengapania']
      },
      {
        name: 'Sivasagar',
        category: 'Historical Heritage',
        image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=600',
        description: 'Historical capital of Ahom Kingdom with Rang Ghar amphitheater and Joysagar tank.',
        nearbyPlaces: ['Rang Ghar', 'Talatal Ghar', 'Sivadol Temple', 'Charaideo Maidams']
      },
      {
        name: 'Tezpur',
        category: 'Mythology & Nature',
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=600',
        description: 'City of Eternal Romance along Brahmaputra, with Agnigarh hill and Cole Park.',
        nearbyPlaces: ['Agnigarh Hill', 'Mahabhairav Temple', 'Nameri National Park']
      }
    ]
  },
  {
    id: 'bihar',
    name: 'Bihar',
    type: 'State',
    capital: 'Patna',
    bestSeason: 'October to March',
    bestMonths: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
    description: 'Cradle of ancient empires, Buddhism, and Jainism, boasting Mahabodhi Temple and ancient Nalanda University.',
    coverImage: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?q=80&w=1200',
    places: [
      {
        name: 'Bodh Gaya',
        category: 'Spiritual & World Heritage',
        image: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?q=80&w=600',
        description: 'Most sacred Buddhist pilgrimage site where Lord Buddha attained enlightenment under Bodhi Tree.',
        nearbyPlaces: ['Mahabodhi Temple', 'Great Buddha Statue', 'Dungeshwari Cave', 'Rajgir']
      },
      {
        name: 'Nalanda',
        category: 'Ancient University',
        image: 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?q=80&w=600',
        description: 'Ruins of 5th-century ancient seat of international learning and UNESCO World Heritage site.',
        nearbyPlaces: ['Nalanda Archaeological Museum', 'Hiuen Tsang Memorial Hall', 'Pawapuri']
      },
      {
        name: 'Rajgir',
        category: 'Heritage & Springs',
        image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=600',
        description: 'Ancient capital enclosed by hills, famous for Vishwa Shanti Stupa ropeway and hot springs.',
        nearbyPlaces: ['Vishwa Shanti Stupa', 'Venu Vana', 'Griddhakuta Hill', 'Glass Bridge Rajgir']
      },
      {
        name: 'Patna',
        category: 'Capital & Heritage',
        image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?q=80&w=600',
        description: 'Ancient Pataliputra city featuring Takht Sri Patna Sahib, Golghar, and Bihar Museum.',
        nearbyPlaces: ['Takht Sri Patna Sahib', 'Golghar Granary', 'Bihar Museum', 'Mahavir Mandir']
      },
      {
        name: 'Vaishali',
        category: 'Buddhist & Jain Pilgrimage',
        image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=600',
        description: 'World’s first republic where Lord Mahavira was born and Buddha delivered his last sermon.',
        nearbyPlaces: ['Ashokan Pillar', 'Buddha Relic Stupa', 'Vishwa Shanti Stupa Vaishali']
      }
    ]
  },
  {
    id: 'chhattisgarh',
    name: 'Chhattisgarh',
    type: 'State',
    capital: 'Raipur',
    bestSeason: 'October to March',
    bestMonths: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
    description: 'The Niagara of India state, renowned for Chitrakote Falls, dense Bastar jungles, and ancient tribal heritage.',
    coverImage: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?q=80&w=1200',
    places: [
      {
        name: 'Chitrakote',
        category: 'Waterfall',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600',
        description: 'India’s widest horseshoe waterfall on Indravati River, spectacular during and after monsoons.',
        nearbyPlaces: ['Tirathgarh Falls', 'Jagdalpur', 'Tamda Ghumar Falls', 'Mendri Ghumar']
      },
      {
        name: 'Tirathgarh',
        category: 'Waterfall & Nature',
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=600',
        description: 'Cascading block waterfall splitting into multiple white foam streams inside Kanger Valley.',
        nearbyPlaces: ['Kanger Valley National Park', 'Kotumsar Cave', 'Chitrakote Falls']
      },
      {
        name: 'Jagdalpur',
        category: 'Tribal Culture & Palace',
        image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=600',
        description: 'Cultural heartbeat of Bastar region, famous for Bastar Palace and Dussehra festival.',
        nearbyPlaces: ['Bastar Palace', 'Danteshwari Temple', 'Anthropological Museum']
      },
      {
        name: 'Kanger Valley',
        category: 'National Park & Caves',
        image: 'https://images.unsplash.com/photo-1549366021-9f761d450615?q=80&w=600',
        description: 'Pristine biosphere reserve with Kotumsar limestone stalactite caves and wild flora.',
        nearbyPlaces: ['Kotumsar Cave', 'Kailash Cave', 'Tirathgarh Waterfalls']
      }
    ]
  },
  {
    id: 'goa',
    name: 'Goa',
    type: 'State',
    capital: 'Panaji',
    bestSeason: 'November to February',
    bestMonths: ['Nov', 'Dec', 'Jan', 'Feb'],
    description: 'India’s beach sunshine capital, famous for golden sands, Portuguese churches, nightlife, and Dudhsagar falls.',
    coverImage: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=1200',
    places: [
      {
        name: 'Panaji',
        category: 'Capital & Latin Quarter',
        image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=600',
        description: 'State capital featuring Fontainhas Portuguese Latin Quarter and Mandovi river cruises.',
        nearbyPlaces: ['Fontainhas', 'Miramar Beach', 'Dona Paula Viewpoint', 'Reis Magos Fort']
      },
      {
        name: 'Old Goa',
        category: 'World Heritage Churches',
        image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=600',
        description: 'UNESCO World Heritage site home to Basilica of Bom Jesus and Se Cathedral.',
        nearbyPlaces: ['Basilica of Bom Jesus', 'Se Cathedral', 'Church of St. Francis of Assisi']
      },
      {
        name: 'Baga',
        category: 'Beach & Nightlife',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600',
        description: 'Vibrant beach lined with shacks, water sports, and famous Tito’s Lane nightlife.',
        nearbyPlaces: ['Calangute Beach', 'Anjuna Beach', 'Tito’s Lane', 'Aguada Fort']
      },
      {
        name: 'Calangute',
        category: 'Popular Beach',
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=600',
        description: 'The "Queen of Beaches" in Goa, bustling with markets, eateries, and parasailing.',
        nearbyPlaces: ['Baga Beach', 'Candolim Beach', 'Aguada Fort']
      },
      {
        name: 'Palolem',
        category: 'South Goa Beach',
        image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?q=80&w=600',
        description: 'Crescent-shaped serene beach with colorful coconut palm shacks and dolphin watching.',
        nearbyPlaces: ['Agonda Beach', 'Butterfly Beach', 'Cabo de Rama Fort']
      },
      {
        name: 'Dudhsagar',
        category: 'Waterfall Trek',
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=600',
        description: 'Four-tiered 310m milky white waterfall surrounded by Bhagwan Mahavir Wildlife Sanctuary.',
        nearbyPlaces: ['Bhagwan Mahavir Sanctuary', 'Tambdi Surla Temple', 'Mollem National Park']
      }
    ]
  },
  {
    id: 'gujarat',
    name: 'Gujarat',
    type: 'State',
    capital: 'Gandhinagar',
    bestSeason: 'October to March',
    bestMonths: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
    description: 'Land of Legends featuring the White Rann of Kutch, Statue of Unity, Asiatic Lions in Gir, and sacred Dwarka.',
    coverImage: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=1200',
    places: [
      {
        name: 'Kutch',
        category: 'White Salt Desert',
        image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=600',
        description: 'Endless white salt marsh desert famous for full moon Rann Utsav and handicraft villages.',
        nearbyPlaces: ['Dhordo Tent City', 'Kala Dungar', 'Mandvi Beach', 'Dholavira Harappan Ruins']
      },
      {
        name: 'Dwarka',
        category: 'Spiritual Char Dham',
        image: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?q=80&w=600',
        description: 'Ancient kingdom of Lord Krishna home to 5-story Dwarkadhish Temple and Bet Dwarka island.',
        nearbyPlaces: ['Dwarkadhish Temple', 'Bet Dwarka', 'Nageshwar Jyotirlinga', 'Rukmini Devi Temple']
      },
      {
        name: 'Somnath',
        category: 'Spiritual Jyotirlinga',
        image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?q=80&w=600',
        description: 'First among the 12 holy Jyotirlingas, perched grandly on the shores of Arabian Sea.',
        nearbyPlaces: ['Somnath Temple', 'Bhalka Tirth', 'Triveni Sangam', 'Gir National Park']
      },
      {
        name: 'Gir',
        category: 'Wild Lion Safari',
        image: 'https://images.unsplash.com/photo-1549366021-9f761d450615?q=80&w=600',
        description: 'The sole natural habitat of pure Asiatic Lions in the world.',
        nearbyPlaces: ['Gir National Park Jeep Safari', 'Devalia Safari Park', 'Somnath Temple']
      },
      {
        name: 'Ahmedabad',
        category: 'Heritage City & Sabarmati',
        image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=600',
        description: 'India’s first UNESCO World Heritage City, Sabarmati Ashram, and Adalaj Stepwell.',
        nearbyPlaces: ['Sabarmati Ashram', 'Adalaj Stepwell', 'Kankaria Lake', 'Akshardham Gandhinagar']
      },
      {
        name: 'Statue of Unity',
        category: 'Modern Monument & Nature',
        image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=600',
        description: 'World’s tallest statue (182 meters) dedicated to Sardar Vallabhbhai Patel with viewing gallery.',
        nearbyPlaces: ['Valley of Flowers', 'Sardar Sarovar Dam', 'Glow Garden', 'Zarwani Waterfalls']
      }
    ]
  },
  {
    id: 'haryana',
    name: 'Haryana',
    type: 'State',
    capital: 'Chandigarh',
    bestSeason: 'October to March',
    bestMonths: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
    description: 'Land of Mahabharata heritage in Kurukshetra, bird sanctuaries at Sultanpur, and modern tech metropolis of Gurugram.',
    coverImage: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=1200',
    places: [
      {
        name: 'Gurugram',
        category: 'Modern Metropolis & Entertainment',
        image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=600',
        description: 'Corporate hub featuring Cyber Hub, Kingdom of Dreams, and luxury nightlife.',
        nearbyPlaces: ['DLF CyberHub', 'Sultanpur Bird Sanctuary', 'Leisure Valley Park', 'Damdama Lake']
      },
      {
        name: 'Kurukshetra',
        category: 'Spiritual & Epic Heritage',
        image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?q=80&w=600',
        description: 'Holy battleground of Mahabharata where Lord Krishna imparted the Bhagavad Gita at Jyotisar.',
        nearbyPlaces: ['Brahma Sarovar', 'Jyotisar Birthplace of Gita', 'Sheikh Chilli Tomb', 'Krishna Museum']
      },
      {
        name: 'Panipat',
        category: 'Historic Battlefields',
        image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=600',
        description: 'City of Weaver Mills and site of three historic battles that shaped Indian empire history.',
        nearbyPlaces: ['Panipat Museum', 'Kala Amb Memorial', 'Ibrahim Lodi Tomb', 'Kabuli Bagh Mosque']
      },
      {
        name: 'Sultanpur',
        category: 'Bird Sanctuary & Lake',
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=600',
        description: 'National park home to over 250 species of resident and migratory winter birds.',
        nearbyPlaces: ['Sultanpur Lake Watchtowers', 'Damdama Lake', 'Farrukhnagar Fort']
      }
    ]
  },
  {
    id: 'himachal-pradesh',
    name: 'Himachal Pradesh',
    type: 'State',
    capital: 'Shimla',
    bestSeason: 'March to June & Oct to Feb (Snow)',
    bestMonths: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    description: 'The Land of Gods boasting iconic hill retreats, Solang snow sports, rugged Spiti valleys, and Dalai Lama’s abode.',
    coverImage: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=1200',
    places: [
      {
        name: 'Manali',
        category: 'Hill Station & Snow',
        image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=600',
        description: 'Popular Himalayan gateway with Solang Valley paragliding, Atal Tunnel, and Hadimba Temple.',
        nearbyPlaces: ['Solang Valley', 'Rohtang Pass', 'Atal Tunnel', 'Hadimba Temple', 'Old Manali']
      },
      {
        name: 'Shimla',
        category: 'Colonial Capital',
        image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?q=80&w=600',
        description: 'Former British summer capital featuring Mall Road, Ridge Church, and Jakhoo Temple.',
        nearbyPlaces: ['Mall Road', 'Jakhoo Hill', 'Kufri Snow World', 'Chail Palace']
      },
      {
        name: 'Spiti',
        category: 'High Altitude Cold Desert',
        image: 'https://images.unsplash.com/photo-1593181629936-11c609b8db9b?q=80&w=600',
        description: 'Stunning high-altitude valley with Key Monastery, Chandratal Moon Lake, and Hikkim post office.',
        nearbyPlaces: ['Key Monastery', 'Chandratal Lake', 'Hikkim Highest Post Office', 'Kibber', 'Langza']
      },
      {
        name: 'Dharamshala',
        category: 'Tibetan Heritage & Cricket',
        image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=600',
        description: 'Seat of H.H. Dalai Lama in McLeod Ganj surrounded by Dhauladhar pine forests.',
        nearbyPlaces: ['McLeod Ganj', 'Dalai Lama Temple', 'Triund Trek Base', 'HPCA Cricket Stadium']
      },
      {
        name: 'Dalhousie',
        category: 'Colonial Quiet Hill Station',
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=600',
        description: 'Serene pine hill town featuring Khajjiar (Mini Switzerland of India) and Dainkund Peak.',
        nearbyPlaces: ['Khajjiar Meadow', 'Dainkund Peak', 'Kalatop Wildlife Sanctuary', 'Chamba']
      },
      {
        name: 'Kasol',
        category: 'Backpacker & River Valley',
        image: 'https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?q=80&w=600',
        description: 'Hippie hamlet on Parvati River known for cafe trails, Kheerganga trek, and Manikaran hot springs.',
        nearbyPlaces: ['Manikaran Sahib Hot Springs', 'Kheerganga Trek', 'Tosh Village', 'Malana']
      }
    ]
  },
  {
    id: 'jharkhand',
    name: 'Jharkhand',
    type: 'State',
    capital: 'Ranchi',
    bestSeason: 'October to March',
    bestMonths: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
    description: 'Land of Forests adorned with spectacular Hundru and Dassam waterfalls, holy Baidyanath Jyotirlinga, and Netarhat sunsets.',
    coverImage: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?q=80&w=1200',
    places: [
      {
        name: 'Ranchi',
        category: 'City of Waterfalls',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600',
        description: 'Capital surrounded by water bodies including Hundru Falls, Dassam Falls, and Jonha Falls.',
        nearbyPlaces: ['Hundru Waterfalls', 'Dassam Falls', 'Rock Garden Ranchi', 'P Tagor Hill']
      },
      {
        name: 'Deoghar',
        category: 'Spiritual Jyotirlinga',
        image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?q=80&w=600',
        description: 'Sacred abode of Baba Baidyanath Dham Jyotirlinga, major pilgrimage center during Shravan month.',
        nearbyPlaces: ['Baidyanath Temple', 'Trikuta Parvat Ropeway', 'Naulakha Mandir', 'Tapovan Caves']
      },
      {
        name: 'Netarhat',
        category: 'Queen of Chotanagpur',
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=600',
        description: 'Hill town famous for sunrise & sunset views over pine forests and Magnolia Point.',
        nearbyPlaces: ['Magnolia Sunset Point', 'Upper Ghaghri Waterfall', 'Lodh Falls', 'Koel View Point']
      },
      {
        name: 'Jamshedpur',
        category: 'Steel City & Parks',
        image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=600',
        description: 'Planned industrial city with scenic Jubliee Park, Dimna Lake, and Dalma Wildlife Sanctuary.',
        nearbyPlaces: ['Jubilee Park', 'Dimna Lake', 'Dalma Wildlife Sanctuary', 'Hudco Lake']
      }
    ]
  },
  {
    id: 'karnataka',
    name: 'Karnataka',
    type: 'State',
    capital: 'Bengaluru',
    bestSeason: 'October to March',
    bestMonths: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
    description: 'One State Many Worlds – featuring Vijayanagara empire ruins in Hampi, royal Mysuru palace, Coorg coffee hills, and Gokarna beaches.',
    coverImage: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?q=80&w=1200',
    places: [
      {
        name: 'Hampi',
        category: 'UNESCO World Heritage',
        image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=600',
        description: 'Epic open-air museum of boulders and ancient ruins of Vijayanagara Empire.',
        nearbyPlaces: ['Stone Chariot Virupaksha', 'Lotus Mahal', 'Vithala Temple', 'Hippie Island Anegundi']
      },
      {
        name: 'Mysuru',
        category: 'Royal Heritage',
        image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=600',
        description: 'Cultural capital famous for illuminated Mysore Palace, Chamundi Hill, and Dasara festival.',
        nearbyPlaces: ['Mysore Palace', 'Chamundi Hill', 'Brindavan Gardens', 'Seringapatam Fort']
      },
      {
        name: 'Coorg',
        category: 'Coffee Hills & Mist',
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=600',
        description: 'Scotland of India known for coffee plantations, Abbey Falls, and Golden Temple Bylakuppe.',
        nearbyPlaces: ['Abbey Falls', 'Raja’s Seat', 'Namdroling Monastery Bylakuppe', 'Dubare Elephant Camp']
      },
      {
        name: 'Gokarna',
        category: 'Beach Trek & Spiritual',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600',
        description: 'Serene beach destination with Om Beach, Kudle Beach trek, and Mahabaleshwar Temple.',
        nearbyPlaces: ['Om Beach', 'Kudle Beach', 'Half Moon Beach', 'Yana Caves']
      },
      {
        name: 'Chikmagalur',
        category: 'Coffee Cradle & Peaks',
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=600',
        description: 'Birthplace of coffee in India with Mullayanagiri peak (highest in Karnataka) and Hebbe Falls.',
        nearbyPlaces: ['Mullayanagiri Peak', 'Baba Budangiri', 'Hebbe Falls', 'Kudremukh Trek']
      },
      {
        name: 'Bengaluru',
        category: 'Silicon Valley & Gardens',
        image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?q=80&w=600',
        description: 'Garden City and tech capital featuring Lalbagh Botanical Garden, Bangalore Palace, and microbreweries.',
        nearbyPlaces: ['Bangalore Palace', 'Lalbagh Botanical Garden', 'Cubbon Park', 'Nandi Hills']
      },
      {
        name: 'Udupi',
        category: 'Coastal & Temples',
        image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?q=80&w=600',
        description: 'Temple town famous for Sri Krishna Matha, St. Mary’s Island basalt columns, and cuisine.',
        nearbyPlaces: ['St. Mary’s Island', 'Malpe Beach', 'Sri Krishna Temple', 'Kapu Lighthouse']
      }
    ]
  },
  {
    id: 'kerala',
    name: 'Kerala',
    type: 'State',
    capital: 'Thiruvananthapuram',
    bestSeason: 'September to March',
    bestMonths: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
    description: 'God’s Own Country – famous for lush tea hills in Munnar, backwater houseboats in Alleppey, and Varkala cliff beach.',
    coverImage: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=1200',
    places: [
      {
        name: 'Munnar',
        category: 'Tea Gardens & Hill Station',
        image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?q=80&w=600',
        description: 'Lush green carpet of tea estates, Anamudi peak, and Mattupetty Dam.',
        nearbyPlaces: ['Eravikulam National Park', 'Mattupetty Dam', 'Top Station', 'Tea Museum']
      },
      {
        name: 'Alleppey',
        category: 'Backwaters & Houseboat',
        image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=600',
        description: 'Venice of the East renowned for overnight luxury houseboat cruises along palm-fringed canals.',
        nearbyPlaces: ['Vembanad Lake Houseboats', 'Alappuzha Beach', 'Marari Beach', 'Pathiramanal Island']
      },
      {
        name: 'Kochi',
        category: 'Colonial Port & Art',
        image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=600',
        description: 'Historic port featuring Chinese Fishing Nets, Fort Kochi heritage buildings, and Jew Town.',
        nearbyPlaces: ['Chinese Fishing Nets', 'Fort Kochi St Francis Church', 'Mattancherry Palace', 'Marine Drive']
      },
      {
        name: 'Wayanad',
        category: 'Mist Hills & Caves',
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=600',
        description: 'Green highland district with Edakkal prehistoric petroglyph caves and Banasura Sagar Dam.',
        nearbyPlaces: ['Edakkal Caves', 'Banasura Sagar Dam', 'Chembra Peak Heart Lake', 'Kuruva Island']
      },
      {
        name: 'Varkala',
        category: 'Cliff Beach & Sunset',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600',
        description: 'Unique red cliff beach overlooking Arabian Sea, lined with trendy cafes and yoga retreats.',
        nearbyPlaces: ['Varkala Cliff Promenade', 'Papanasam Beach', 'Janardhana Swamy Temple', 'Kappil Lake']
      },
      {
        name: 'Thekkady',
        category: 'Wildlife & Spice Gardens',
        image: 'https://images.unsplash.com/photo-1549366021-9f761d450615?q=80&w=600',
        description: 'Periyar Wildlife Sanctuary home to wild elephant herds boat safaris and cardamom spice tours.',
        nearbyPlaces: ['Periyar Lake Safari', 'Elephant Junction', 'Spice Plantation Walk', 'Gavi Eco Tourism']
      }
    ]
  },
  {
    id: 'madhya-pradesh',
    name: 'Madhya Pradesh',
    type: 'State',
    capital: 'Bhopal',
    bestSeason: 'October to March',
    bestMonths: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
    description: 'The Heart of Incredible India – home to UNESCO Khajuraho erotic temples, Sanchi Stupa, Mahakaleshwar Jyotirlinga in Ujjain, and tiger reserves.',
    coverImage: 'https://images.unsplash.com/photo-1622396481328-9b1b78cdd9fd?q=80&w=1200',
    places: [
      {
        name: 'Khajuraho',
        category: 'UNESCO Erotic Temples',
        image: 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?q=80&w=600',
        description: 'World-renowned 10th-century Chandela temples decorated with intricate erotic and lifestyle stone carvings.',
        nearbyPlaces: ['Western Group of Temples', 'Kandariya Mahadeva', 'Raneh Waterfalls Canyon', 'Panna Tiger Reserve']
      },
      {
        name: 'Ujjain',
        category: 'Spiritual Jyotirlinga & Mahakal',
        image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?q=80&w=600',
        description: 'Ancient holy city along Shipra River home to Mahakaleshwar Jyotirlinga and Mahakal Lok Corridor.',
        nearbyPlaces: ['Mahakaleshwar Temple', 'Mahakal Lok', 'Ram Ghat Aarti', 'Kal Bhairav Temple']
      },
      {
        name: 'Sanchi',
        category: 'UNESCO Buddhist Stupa',
        image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=600',
        description: 'Oldest stone structure in India commissioned by Emperor Ashoka, showcasing Buddhist art Toranas.',
        nearbyPlaces: ['Great Stupa 1', 'Ashoka Pillar Ruins', 'Udayagiri Caves']
      },
      {
        name: 'Bhopal',
        category: 'City of Lakes & Bhimbetka',
        image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=600',
        description: 'Capital city with Upper Lake (Bhojtal), Taj-ul-Masajid, and UNESCO Bhimbetka rock shelters.',
        nearbyPlaces: ['Upper Lake Bhojtal', 'Bhimbetka Prehistoric Caves', 'Taj-ul-Masajid', 'Sanchi']
      },
      {
        name: 'Indore',
        category: 'Cleanest City & Street Food',
        image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=600',
        description: 'Food capital famous for Sarafa Bazaar midnight food market, Rajwada Palace, and Chappan Dukan.',
        nearbyPlaces: ['Sarafa Night Food Market', 'Rajwada Palace', 'Chappan Dukan', 'Mandu Fort']
      },
      {
        name: 'Pachmarhi',
        category: 'Queen of Satpura Hill Station',
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=600',
        description: 'Only hill station in MP featuring Bee Falls, Dhoopgarh peak, and Pandav Caves.',
        nearbyPlaces: ['Bee Falls', 'Dhoopgarh Sunset Point', 'Jata Shankar Cave', 'Pandav Caves']
      },
      {
        name: 'Jabalpur',
        category: 'Marble Rocks & Waterfalls',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600',
        description: 'Famous for Bhedaghat soaring Marble Rocks gorge on Narmada River and Dhuandhar Falls.',
        nearbyPlaces: ['Bhedaghat Boat Ride', 'Dhuandhar Falls', 'Chausath Yogini Temple', 'Kanha Tiger Reserve']
      }
    ]
  },
  {
    id: 'maharashtra',
    name: 'Maharashtra',
    type: 'State',
    capital: 'Mumbai',
    bestSeason: 'October to March',
    bestMonths: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
    description: 'Financial capital state featuring Gateway of India, Ajanta & Ellora caves, Lonavala hill views, and Nashik wine country.',
    coverImage: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?q=80&w=1200',
    places: [
      {
        name: 'Mumbai',
        category: 'Financial Metropolis & Gateway',
        image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?q=80&w=600',
        description: 'City of Dreams boasting Gateway of India, Marine Drive Queen’s Necklace, Elephanta Caves, and Bollywood.',
        nearbyPlaces: ['Gateway of India', 'Marine Drive', 'Elephanta Island Caves', 'Colaba Causeway', 'Bandra Fort']
      },
      {
        name: 'Pune',
        category: 'Cultural & Fort Capital',
        image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=600',
        description: 'Oxford of the East featuring Shaniwar Wada Maratha fort, Aga Khan Palace, and Sinhagad Fort.',
        nearbyPlaces: ['Shaniwar Wada', 'Aga Khan Palace', 'Sinhagad Fort Trek', 'Osho Ashram']
      },
      {
        name: 'Lonavala',
        category: 'Monsoon Hill Station',
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=600',
        description: 'Popular Western Ghats hill escape known for Tiger Point, Bhushi Dam, and Chikki sweets.',
        nearbyPlaces: ['Tiger’s Leap Viewpoint', 'Bhushi Dam', 'Karla & Bhaja Caves', 'Khandala']
      },
      {
        name: 'Mahabaleshwar',
        category: 'Strawberry Capital & Viewpoints',
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=600',
        description: 'Highest Western Ghats hill station famous for fresh strawberry farms, Venna Lake, and Arthur’s Seat.',
        nearbyPlaces: ['Venna Lake', 'Arthur’s Seat', 'Elephant’s Head Point', 'Panchgani', 'Pratapgad Fort']
      },
      {
        name: 'Ajanta',
        category: 'UNESCO Rock-Cut Painting Caves',
        image: 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?q=80&w=600',
        description: '30 rock-cut Buddhist cave monuments dating from 2nd century BCE with ancient fresco paintings.',
        nearbyPlaces: ['Ajanta Caves Complex', 'Viewpoint', 'Ellora Caves', 'Chhatrapati Sambhajinagar (Aurangabad)']
      },
      {
        name: 'Ellora',
        category: 'UNESCO Monolithic Temple',
        image: 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?q=80&w=600',
        description: 'Home to Kailash Temple (Cave 16), world’s largest single monolithic rock excavation.',
        nearbyPlaces: ['Kailash Monolithic Temple', 'Daulatabad Fort', 'Bibi Ka Maqbara', 'Grishneshwar Jyotirlinga']
      },
      {
        name: 'Nashik',
        category: 'Wine Capital & Trimbakeshwar',
        image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?q=80&w=600',
        description: 'Wine country with Sula Vineyards, Panchavati Godavari riverbanks, and Trimbakeshwar Jyotirlinga.',
        nearbyPlaces: ['Sula Vineyards Tour', 'Trimbakeshwar Temple', 'Panchavati Ghats', 'Pandavleni Caves']
      },
      {
        name: 'Shirdi',
        category: 'Spiritual Pilgrimage',
        image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?q=80&w=600',
        description: 'Sacred town dedicated to Sai Baba featuring Shri Sai Baba Sansthan Temple and Dwarkamai.',
        nearbyPlaces: ['Sai Baba Samadhi Temple', 'Dwarkamai', 'Chavadi', 'Shani Shingnapur']
      },
      {
        name: 'Alibaug',
        category: 'Coastal Beach & Forts',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600',
        description: 'Coastal weekend retreat featuring Kolaba Sea Fort, Nagaon Beach water sports, and Kihim.',
        nearbyPlaces: ['Kolaba Sea Fort', 'Nagaon Beach', 'Varsoli Beach', 'Kashid Beach']
      },
      {
        name: 'Panchgani',
        category: 'Tableland Hill Station',
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=600',
        description: 'Scenic hill town renowned for volcanic Table Land plateau, Mapro Garden, and strawberry farms.',
        nearbyPlaces: ['Table Land Plateau', 'Mapro Garden', 'Sydney Point', 'Parsi Point']
      },
      {
        name: 'Matheran',
        category: 'Eco Automobile-Free Hill Station',
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=600',
        description: 'Asia’s only automobile-free hill station with red-dirt trails, Panorama Point, and toy train.',
        nearbyPlaces: ['Panorama Point', 'Louisa Point', 'Echo Point', 'Charlotte Lake']
      }
    ]
  },
  {
    id: 'manipur',
    name: 'Manipur',
    type: 'State',
    capital: 'Imphal',
    bestSeason: 'October to March',
    bestMonths: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
    description: 'Jewel of India famous for Loktak Lake floating islands (Phumdis) and Keibul Lamjao National Park.',
    coverImage: 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?q=80&w=1200',
    places: [
      {
        name: 'Imphal',
        category: 'Capital & Heritage Market',
        image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=600',
        description: 'Capital city featuring Kangla Fort, Ima Keithel (world’s only all-women managed market), and Polo Ground.',
        nearbyPlaces: ['Kangla Fort', 'Ima Keithel Market', 'Manipur State Museum', 'INRA War Memorial Moirang']
      },
      {
        name: 'Loktak Lake',
        category: 'Freshwater Lake & Floating Islands',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600',
        description: 'Largest natural freshwater lake in Northeast India dotted with unique floating biomass rings (Phumdis).',
        nearbyPlaces: ['Sendra Island Resort', 'Keibul Lamjao Park', 'Moirang']
      },
      {
        name: 'Keibul Lamjao',
        category: 'Floating National Park',
        image: 'https://images.unsplash.com/photo-1549366021-9f761d450615?q=80&w=600',
        description: 'World’s only floating national park, home to endangered Sangai dancing deer.',
        nearbyPlaces: ['Sangai Deer Sanctuary Watchtower', 'Loktak Lake', 'Khongjom War Memorial']
      }
    ]
  },
  {
    id: 'meghalaya',
    name: 'Meghalaya',
    type: 'State',
    capital: 'Shillong',
    bestSeason: 'October to April',
    bestMonths: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'],
    description: 'Abode of Clouds – home to double-decker living root bridges, crystal clear Dawki river, and Cherrapunji waterfalls.',
    coverImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200',
    places: [
      {
        name: 'Shillong',
        category: 'Scotland of the East',
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=600',
        description: 'Vibrant capital featuring Umiam Lake, Elephant Falls, Shillong Peak, and rock music culture.',
        nearbyPlaces: ['Umiam Barapani Lake', 'Elephant Falls', 'Shillong Peak', 'Police Bazar Market']
      },
      {
        name: 'Cherrapunji',
        category: 'Wettest Place & Waterfalls',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600',
        description: 'Famous for Nohkalikai (India’s tallest plunge waterfall), Seven Sisters Falls, and Mawsmai Cave.',
        nearbyPlaces: ['Nohkalikai Falls', 'Seven Sisters Falls', 'Mawsmai Cave', 'Wei Sawdong Waterfall']
      },
      {
        name: 'Dawki',
        category: 'Crystal Glass River',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600',
        description: 'Border town where boats appear floating in mid-air on the transparent Umngot River.',
        nearbyPlaces: ['Umngot River Boat Ride', 'Tamabil Bangladesh Border Point', 'Jaflong']
      },
      {
        name: 'Mawlynnong',
        category: 'Cleanest Village in Asia',
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=600',
        description: 'Pristine flower-adorned eco village featuring Single Root Bridge and Sky Walk treehouse.',
        nearbyPlaces: ['Living Root Bridge Riwai', 'Sky View Treehouse', 'Balancing Rock']
      }
    ]
  },
  {
    id: 'mizoram',
    name: 'Mizoram',
    type: 'State',
    capital: 'Aizawl',
    bestSeason: 'October to March',
    bestMonths: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
    description: 'Land of Blue Mountains – steep ridges, bamboo forests, Vantawng Falls, and warm Mizo hospitality.',
    coverImage: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=1200',
    places: [
      {
        name: 'Aizawl',
        category: 'Hilltop Capital',
        image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=600',
        description: 'Picturesque capital built on steep ridges with Durtlang Hills view and Solomon’s Temple.',
        nearbyPlaces: ['Durtlang Hills', 'Solomon’s Temple', 'Bara Bazar', 'Reiek Tlang']
      },
      {
        name: 'Reiek',
        category: 'Mountain Peak & Heritage',
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=600',
        description: 'High peak offering 360° views of Aizawl valley and traditional Mizo model village.',
        nearbyPlaces: ['Reiek Peak Trek', 'Mizo Heritage Village']
      },
      {
        name: 'Champhai',
        category: 'Rice Bowl & Indo-Myanmar Border',
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=600',
        description: 'Border trade city overlooking Myanmar hills and Rih Dil heart-shaped lake nearby.',
        nearbyPlaces: ['Rih Dil Lake', 'Murlen National Park', 'Kungawrhi Puk']
      },
      {
        name: 'Vantawng Falls',
        category: 'Highest Waterfall in Mizoram',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600',
        description: 'Highest 2-tiered waterfall in Mizoram (750 ft) surrounded by thick bamboo jungles in Serchhip.',
        nearbyPlaces: ['Thenzawl', 'Tuirihiau Falls', 'Deer Park Thenzawl']
      }
    ]
  },
  {
    id: 'nagaland',
    name: 'Nagaland',
    type: 'State',
    capital: 'Kohima',
    bestSeason: 'October to May (Hornbill Festival in Dec)',
    bestMonths: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'],
    description: 'Land of Festivals – world-famous Hornbill Festival, Dzukou Valley trekking, and rich Naga tribal warrior heritage.',
    coverImage: 'https://images.unsplash.com/photo-1571536802807-30451e3955d8?q=80&w=1200',
    places: [
      {
        name: 'Kohima',
        category: 'Capital & WWII Heritage',
        image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=600',
        description: 'Capital town holding WWII Commonwealth War Cemetery, Kisama Heritage Village, and Kohima Cathedral.',
        nearbyPlaces: ['Kisama Hornbill Heritage Village', 'Kohima War Cemetery', 'Japfu Peak', 'Khonoma Green Village']
      },
      {
        name: 'Dzukou Valley',
        category: 'Valley of Flowers & Trekking',
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=600',
        description: 'Emerald-green valley of rolling hills, bamboo shrubs, and rare Dzukou lilies.',
        nearbyPlaces: ['Dzukou Valley Base Camp Viswema', 'Japfu Peak']
      },
      {
        name: 'Mokokchung',
        category: 'Ao Naga Cultural Capital',
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=600',
        description: 'Cultural hub of the Ao Naga tribe known for Ungma and Longkhum picturesque hilltop villages.',
        nearbyPlaces: ['Longkhum Village', 'Ungma Heritage Village', 'Chuchuyimlang']
      },
      {
        name: 'Mon',
        category: 'Konyak Tattooed Warriors',
        image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=600',
        description: 'Land of Konyak Nagas famous for facial tattoos, traditional Angh chief headmanship, and Longwa village.',
        nearbyPlaces: ['Longwa Indo-Myanmar Border Village', 'Shangnyu Village', 'Veda Peak']
      }
    ]
  },
  {
    id: 'odisha',
    name: 'Odisha',
    type: 'State',
    capital: 'Bhubaneswar',
    bestSeason: 'October to March',
    bestMonths: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
    description: 'Soul of Incredible India – sacred Lord Jagannath Temple in Puri, Konark Sun Temple Chariot, and Chilika migratory bird lagoon.',
    coverImage: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=1200',
    places: [
      {
        name: 'Puri',
        category: 'Spiritual Char Dham & Beach',
        image: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?q=80&w=600',
        description: 'Holy seaside city hosting Jagannath Temple Rath Yatra and Blue Flag Golden Beach.',
        nearbyPlaces: ['Jagannath Temple', 'Puri Golden Beach', 'Swargadwar', 'Raghurajpur Crafts Village']
      },
      {
        name: 'Konark',
        category: 'UNESCO Sun Temple Chariot',
        image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=600',
        description: '13th-century architectural masterpiece carved as a giant sun god stone chariot with 24 wheels.',
        nearbyPlaces: ['Sun Temple Monument', 'Chandrabhaga Beach', 'Konark Interpretive Museum']
      },
      {
        name: 'Bhubaneswar',
        category: 'Temple City & Caves',
        image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?q=80&w=600',
        description: 'State capital home to Lingaraj Temple, Mukteswar Temple, and Udayagiri-Khandagiri rock caves.',
        nearbyPlaces: ['Lingaraj Temple', 'Udayagiri & Khandagiri Caves', 'Nandankanan Zoo', 'Dhauli Peace Pagoda']
      },
      {
        name: 'Chilika',
        category: 'Irrawaddy Dolphins & Birds',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600',
        description: 'Asia’s largest brackish water lagoon famous for Irrawaddy dolphin watching and Nalabana bird sanctuary.',
        nearbyPlaces: ['Satapada Dolphin Watching Point', 'Nalabana Bird Sanctuary', 'Kalijai Temple Island']
      },
      {
        name: 'Cuttack',
        category: 'Silver City & Barabati',
        image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=600',
        description: 'Historic millennium city along Mahanadi River famous for Silver Filigree (Tarakasi) art and Barabati Fort.',
        nearbyPlaces: ['Barabati Fort', 'Mahanadi River Barrage', 'Netaji Birthplace Museum']
      }
    ]
  },
  {
    id: 'punjab',
    name: 'Punjab',
    type: 'State',
    capital: 'Chandigarh',
    bestSeason: 'October to March',
    bestMonths: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
    description: 'Land of Five Rivers – pristine Golden Temple in Amritsar, Wagah Border patriotism, rich culinary dhabas, and royal Patiala palaces.',
    coverImage: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?q=80&w=1200',
    places: [
      {
        name: 'Amritsar',
        category: 'Sacred Golden Temple & Heritage',
        image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?q=80&w=600',
        description: 'Spiritual epicenter of Sikhism home to Harmandir Sahib (Golden Temple) and Jallianwala Bagh.',
        nearbyPlaces: ['Golden Temple Harmandir Sahib', 'Jallianwala Bagh Memorial', 'Gobindgarh Fort', 'Wagah Border']
      },
      {
        name: 'Golden Temple',
        category: 'Holy Shrine',
        image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?q=80&w=600',
        description: 'Gilded shrine set in Amrit Sarovar holy water tank serving free Guru Ka Langar to thousands daily.',
        nearbyPlaces: ['Akal Takht', 'Partition Museum', 'Heritage Street Amritsar']
      },
      {
        name: 'Wagah Border',
        category: 'National Pride Ceremony',
        image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=600',
        description: 'India-Pakistan international border post famous for the electric daily sunset Beating Retreat ceremony.',
        nearbyPlaces: ['Attari Railway Station', 'Amritsar City']
      },
      {
        name: 'Patiala',
        category: 'Royal Palaces & Paranda',
        image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=600',
        description: 'Former princely state capital featuring Qila Mubarak, Sheesh Mahal, and famous Patiala Shahi turban culture.',
        nearbyPlaces: ['Qila Mubarak Fort', 'Sheesh Mahal Palace', 'Baradari Gardens']
      }
    ]
  },
  {
    id: 'rajasthan',
    name: 'Rajasthan',
    type: 'State',
    capital: 'Jaipur',
    bestSeason: 'October to March',
    bestMonths: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
    description: 'Land of Kings – royal palaces in Jaipur & Udaipur, golden Thar desert safaris in Jaisalmer, blue houses in Jodhpur, and holy Pushkar lake.',
    coverImage: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=1200',
    places: [
      {
        name: 'Jaipur',
        category: 'Pink City & Royal Forts',
        image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=600',
        description: 'State capital featuring UNESCO Amber Fort, Hawa Mahal honeycomb facade, and City Palace.',
        nearbyPlaces: ['Amber Palace & Fort', 'Hawa Mahal', 'City Palace Jaipur', 'Jantar Mantar', 'Nahargarh Fort']
      },
      {
        name: 'Jaisalmer',
        category: 'Golden City & Thar Desert',
        image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=600',
        description: 'Living yellow sandstone fort city on Thar Desert with Sam Sand Dunes camel safaris.',
        nearbyPlaces: ['Jaisalmer Living Fort', 'Patwon Ki Haveli', 'Sam Sand Dunes Camp', 'Gadisar Lake']
      },
      {
        name: 'Jodhpur',
        category: 'Blue City & Mehrangarh',
        image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=600',
        description: 'Blue-painted old city guarded by towering Mehrangarh Fort and Umaid Bhawan Palace.',
        nearbyPlaces: ['Mehrangarh Fort', 'Jaswant Thada', 'Umaid Bhawan Palace', 'Clock Tower Market']
      },
      {
        name: 'Udaipur',
        category: 'City of Lakes & Romance',
        image: 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?q=80&w=600',
        description: 'Venice of the East adorned with Lake Pichola boat rides, City Palace, and Jag Mandir.',
        nearbyPlaces: ['Lake Pichola Boat Cruise', 'City Palace Udaipur', 'Jag Mandir', 'Saheliyon Ki Bari', 'Kumbhalgarh Fort']
      },
      {
        name: 'Pushkar',
        category: 'Sacred Lake & Brahma Temple',
        image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?q=80&w=600',
        description: 'Holy lake town hosting the world’s rare Brahma Temple and annual Pushkar Camel Fair.',
        nearbyPlaces: ['Pushkar Lake Ghats', 'Brahma Temple', 'Savitri Temple Ropeway', 'Ajmer Sharif Dargah']
      },
      {
        name: 'Bikaner',
        category: 'Desert Fort & Karni Mata',
        image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=600',
        description: 'Desert fortress city featuring Junagarh Fort, camel breeding farm, and Karni Mata Rat Temple.',
        nearbyPlaces: ['Junagarh Fort', 'Karni Mata Deshnoke Temple', 'National Research Centre on Camel']
      }
    ]
  },
  {
    id: 'sikkim',
    name: 'Sikkim',
    type: 'State',
    capital: 'Gangtok',
    bestSeason: 'March to May & Oct to Dec',
    bestMonths: ['Mar', 'Apr', 'May', 'Oct', 'Nov', 'Dec'],
    description: 'Himalayan paradise dominated by H.H. Kanchenjunga peak, Tsomgo glacial lake, Nathula Indo-China pass, and Yumthang valley of flowers.',
    coverImage: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1200',
    places: [
      {
        name: 'Gangtok',
        category: 'Capital & Cable Car',
        image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=600',
        description: 'Clean mountain capital with MG Marg pedestrian boulevard, Rumtek Monastery, and ropeway.',
        nearbyPlaces: ['MG Marg Promenade', 'Rumtek Monastery', 'Gangtok Ropeway', 'Tashi Viewpoint']
      },
      {
        name: 'Pelling',
        category: 'Kanchenjunga Views & Skywalk',
        image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=600',
        description: 'West Sikkim town with India’s first Glass Skywalk, Chenrezig statue, and Pemayangtse Monastery.',
        nearbyPlaces: ['Pelling Glass Skywalk', 'Pemayangtse Monastery', 'Rabdentse Ruins', 'Khecheopalri Lake']
      },
      {
        name: 'Lachung',
        category: 'North Sikkim Base',
        image: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?q=80&w=600',
        description: 'Mountain village base for exploring snow-capped Yumthang Valley and Zero Point.',
        nearbyPlaces: ['Yumthang Valley', 'Zero Point Yume Samdong', 'Lachung Monastery']
      },
      {
        name: 'Yumthang',
        category: 'Valley of Flowers & Hot Springs',
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=600',
        description: 'High altitude sanctuary of rhododendrons, alpine pastures, and natural thermal springs.',
        nearbyPlaces: ['Rhododendron Sanctuary', 'Yumthang Hot Springs', 'Zero Point']
      },
      {
        name: 'Ravangla',
        category: 'Buddha Park & Tea Garden',
        image: 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?q=80&w=600',
        description: 'South Sikkim town featuring magnificent 130ft Tathagata Tsal Buddha statue park.',
        nearbyPlaces: ['Buddha Park Ravangla', 'Temi Tea Garden', 'Ralang Monastery']
      }
    ]
  },
  {
    id: 'tamil-nadu',
    name: 'Tamil Nadu',
    type: 'State',
    capital: 'Chennai',
    bestSeason: 'October to March',
    bestMonths: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
    description: 'Land of Temples – grand Gopurams of Madurai & Thanjavur, cool hill escapes of Ooty & Kodaikanal, sacred Rameswaram, and Kanyakumari sunset.',
    coverImage: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=1200',
    places: [
      {
        name: 'Ooty',
        category: 'Queen of Hill Stations & Toy Train',
        image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?q=80&w=600',
        description: 'Nilgiri mountain resort famous for Nilgiri Mountain Toy Train UNESCO railway and Botanical Gardens.',
        nearbyPlaces: ['Nilgiri Mountain Toy Train', 'Ooty Botanical Garden', 'Doddabetta Peak', 'Pykara Lake']
      },
      {
        name: 'Kodaikanal',
        category: 'Princess of Hill Stations',
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=600',
        description: 'Misty Palani hills town featuring star-shaped Kodai Lake, Coaker’s Walk, and Pillar Rocks.',
        nearbyPlaces: ['Kodai Lake Boating', 'Coaker’s Walk', 'Pillar Rocks', 'Poombarai Village']
      },
      {
        name: 'Chennai',
        category: 'Capital & Marina Beach',
        image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=600',
        description: 'Metropolitan cultural capital featuring Marina Beach (2nd longest urban beach), Kapaleeshwarar Temple, and Carnatic music.',
        nearbyPlaces: ['Marina Beach Promenade', 'Kapaleeshwarar Temple', 'San Thome Basilica', 'Mahabalipuram Shore Temple']
      },
      {
        name: 'Madurai',
        category: 'Ancient Temple City',
        image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=600',
        description: '2500-year-old city home to towering colorful Gopurams of Meenakshi Amman Temple.',
        nearbyPlaces: ['Meenakshi Amman Temple', 'Thirumalai Nayakkar Palace', 'Gandhi Memorial Museum']
      },
      {
        name: 'Rameswaram',
        category: 'Spiritual Char Dham & Pamban',
        image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?q=80&w=600',
        description: 'Holy island temple town connected by ocean Pamban Bridge and Dhanushkodi ghost town.',
        nearbyPlaces: ['Ramanathaswamy Temple 1000 Pillars', 'Pamban Sea Bridge', 'Dhanushkodi Tip', 'APJ Abdul Kalam Memorial']
      },
      {
        name: 'Kanyakumari',
        category: 'Tricontinental Ocean Sunset',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600',
        description: 'Southernmost tip of mainland India where Arabian Sea, Bay of Bengal, and Indian Ocean merge.',
        nearbyPlaces: ['Vivekananda Rock Memorial', 'Thiruvalluvar Statue', 'Kanyakumari Sunrise Point', 'Padmanabhapuram Palace']
      },
      {
        name: 'Thanjavur',
        category: 'UNESCO Great Living Chola Temple',
        image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=600',
        description: 'Cradle of Chola dynasty art, famous for 1000-year-old Brihadisvara Temple with giant granite Vimana.',
        nearbyPlaces: ['Brihadisvara Temple', 'Thanjavur Maratha Palace', 'Saraswathi Mahal Library']
      }
    ]
  },
  {
    id: 'telangana',
    name: 'Telangana',
    type: 'State',
    capital: 'Hyderabad',
    bestSeason: 'October to March',
    bestMonths: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
    description: 'City of Pearls & Nizam Heritage – Charminar, Golconda Fort, Ramoji Film City, Kakatiya Warangal architecture.',
    coverImage: 'https://images.unsplash.com/photo-1605007493699-af65834f8a00?q=80&w=1200',
    places: [
      {
        name: 'Hyderabad',
        category: 'Nizami Capital & Biryani',
        image: 'https://images.unsplash.com/photo-1605007493699-af65834f8a00?q=80&w=600',
        description: 'Dynamic capital famous for 1591 Charminar monument, Golconda acoustic fort, Chowmahalla Palace, and Ramoji Film City.',
        nearbyPlaces: ['Charminar & Laad Bazaar', 'Golconda Fort', 'Chowmahalla Palace', 'Ramoji Film City', 'Hussain Sagar Lake']
      },
      {
        name: 'Warangal',
        category: 'UNESCO Kakatiya Heritage',
        image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=600',
        description: 'Ancient Kakatiya capital featuring Thousand Pillar Temple, Warangal Fort Stone Toranas, and Ramappa UNESCO Temple.',
        nearbyPlaces: ['Warangal Fort Gateways', 'Thousand Pillar Temple', 'Ramappa UNESCO Temple Palampet', 'Bhadrakali Lake']
      },
      {
        name: 'Bhongir',
        category: 'Monolithic Rock Fort',
        image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=600',
        description: 'Formidable 10th-century fort built atop a single giant smooth egg-shaped granite hill.',
        nearbyPlaces: ['Bhongir Fort Trek', 'Yadadri Temple (Yadagirigutta)']
      },
      {
        name: 'Vemulawada',
        category: 'Spiritual Raja Rajeshwara',
        image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?q=80&w=600',
        description: 'Renowned temple town known as Dakshina Kashi, hosting Sri Raja Rajeshwara Swamy Temple.',
        nearbyPlaces: ['Sri Raja Rajeshwara Swamy Temple', 'Kondagattu Hanuman Temple', 'Dharmapuri']
      }
    ]
  },
  {
    id: 'tripura',
    name: 'Tripura',
    type: 'State',
    capital: 'Agartala',
    bestSeason: 'October to March',
    bestMonths: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
    description: 'Princely state of Ujjayanta Palace, Neermahal water palace in Rudrasagar Lake, and rock-carved Unakoti sculptures.',
    coverImage: 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?q=80&w=1200',
    places: [
      {
        name: 'Agartala',
        category: 'Capital & Ujjayanta Palace',
        image: 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?q=80&w=600',
        description: 'Capital city featuring grand white tile Ujjayanta Palace, Heritage Park, and Fourteen Goddess Temple.',
        nearbyPlaces: ['Ujjayanta Royal Palace', 'State Museum Agartala', 'Heritage Park', 'Fourteen Goddess Temple']
      },
      {
        name: 'Unakoti',
        category: 'Ancient Rock Relief Sculptures',
        image: 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?q=80&w=600',
        description: 'Angkor Wat of Northeast India featuring giant rock-carved Shiva carvings in a forest hill setting.',
        nearbyPlaces: ['Unakoti Rock Carvings', 'Kailashahar', 'Jampui Hills']
      },
      {
        name: 'Neermahal',
        category: 'Water Palace in Lake',
        image: 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?q=80&w=600',
        description: 'Eastern India’s only water palace constructed in the center of Rudrasagar Lake.',
        nearbyPlaces: ['Rudrasagar Lake Boating', 'Sepahijala Wildlife Sanctuary']
      }
    ]
  },
  {
    id: 'uttar-pradesh',
    name: 'Uttar Pradesh',
    type: 'State',
    capital: 'Lucknow',
    bestSeason: 'October to March',
    bestMonths: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
    description: 'Heartland of India featuring Taj Mahal in Agra, sacred Ganga Ghats in Varanasi, Ayodhya Ram Mandir, Mathura Vrindavan, and Awadhi Lucknow.',
    coverImage: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=1200',
    places: [
      {
        name: 'Agra',
        category: 'Wonder of World & Taj Mahal',
        image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=600',
        description: 'Home to the iconic white marble Taj Mahal, red sandstone Agra Fort, and Fatehpur Sikri.',
        nearbyPlaces: ['Taj Mahal Sunrise', 'Agra Fort', 'Fatehpur Sikri', 'Mehtab Bagh Sunset']
      },
      {
        name: 'Varanasi',
        category: 'World’s Oldest Living Spiritual City',
        image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?q=80&w=600',
        description: 'Spiritual heart of India with Dashashwamedh Ganga Aarti, Kashi Vishwanath Corridor, and boat rides.',
        nearbyPlaces: ['Ganga Evening Aarti', 'Kashi Vishwanath Corridor', 'Sarnath Stupa', 'Manikarnika Ghat']
      },
      {
        name: 'Ayodhya',
        category: 'Sacred Ram Janmabhoomi',
        image: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?q=80&w=600',
        description: 'Birthplace of Lord Rama featuring grand Shri Ram Janmabhoomi Mandir, Saryu Ghat Aarti, and Hanuman Garhi.',
        nearbyPlaces: ['Shri Ram Janmabhoomi Mandir', 'Hanuman Garhi', 'Saryu River Ghats', 'Kanak Bhawan']
      },
      {
        name: 'Mathura',
        category: 'Krishna Janmabhoomi',
        image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?q=80&w=600',
        description: 'Holy birthplace of Lord Krishna with Krishna Janmasthan Temple complex and Vishram Ghat.',
        nearbyPlaces: ['Shri Krishna Janmasthan', 'Vishram Ghat', 'Govardhan Hill Parikrama']
      },
      {
        name: 'Vrindavan',
        category: 'Land of Radha-Krishna Bhakti',
        image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?q=80&w=600',
        description: 'Sacred town of 5000+ temples including Banke Bihari, Prem Mandir illuminated, and ISCKON.',
        nearbyPlaces: ['Banke Bihari Temple', 'Prem Mandir Light Show', 'ISKCON Vrindavan', 'Nidhivan']
      },
      {
        name: 'Lucknow',
        category: 'City of Nawabs & Awadhi Cuisine',
        image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=600',
        description: 'Cultural capital famous for Bara Imambara labyrinth (Bhulbhulaiya), Rumi Darwaza, and Tunday Kababs.',
        nearbyPlaces: ['Bara Imambara & Bhulbhulaiya', 'Chhota Imambara', 'Rumi Darwaza', 'Hazratganj']
      },
      {
        name: 'Prayagraj',
        category: 'Triveni Sangam & Kumbh Mela',
        image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?q=80&w=600',
        description: 'Holy confluence of Ganga, Yamuna, and mythical Saraswati rivers; host of Maha Kumbh Mela.',
        nearbyPlaces: ['Triveni Sangam Boat Ride', 'Allahabad Fort Ashoka Pillar', 'Anand Bhavan']
      }
    ]
  },
  {
    id: 'uttarakhand',
    name: 'Uttarakhand',
    type: 'State',
    capital: 'Dehradun',
    bestSeason: 'March to June & Sept to Nov (Snow in Dec-Feb)',
    bestMonths: ['Mar', 'Apr', 'May', 'Jun', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'],
    description: 'Devbhoomi (Land of Gods) – Char Dham shrines Kedarnath & Badrinath, Rishikesh yoga & rafting, Nainital lake, and Auli skiing slopes.',
    coverImage: 'https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?q=80&w=1200',
    places: [
      {
        name: 'Rishikesh',
        category: 'Yoga Capital & White Water Rafting',
        image: 'https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?q=80&w=600',
        description: 'World Capital of Yoga on holy Ganga River offering Grade III rafting, bungee jumping, and Triveni Ghat Aarti.',
        nearbyPlaces: ['Laxman Jhula & Ram Jhula', 'Triveni Ghat Evening Ganga Aarti', 'Beatles Ashram', 'Shivpuri Rafting']
      },
      {
        name: 'Mussoorie',
        category: 'Queen of Hills',
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=600',
        description: 'Famous Himalayan hill station featuring Kempty Falls, Mall Road, and Gun Hill ropeway.',
        nearbyPlaces: ['Kempty Falls', 'Mall Road Mussoorie', 'Gun Hill Point', 'Lal Tibba Scenic View', 'Company Garden']
      },
      {
        name: 'Nainital',
        category: 'City of Lakes',
        image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?q=80&w=600',
        description: 'Charming lake resort built around eye-shaped Naini Lake with Mallital boating and Snow View cable car.',
        nearbyPlaces: ['Naini Lake Yacht Boating', 'Naina Devi Temple', 'Snow View Point Ropeway', 'Eco Cave Gardens']
      },
      {
        name: 'Auli',
        category: 'Skiing Resort & Cable Car',
        image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=600',
        description: 'Premier skiing destination of India surrounded by oak forests and 360° views of Nanda Devi peak.',
        nearbyPlaces: ['Auli Ski Slopes & Ropeway', 'Auli Artificial Lake', 'Gurso Bugyal Meadow', 'Joshimath']
      },
      {
        name: 'Kedarnath',
        category: 'High Altitude Sacred Shrine',
        image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?q=80&w=600',
        description: 'One of the 12 Jyotirlingas set at 11,755ft elevation amidst snow-covered peaks.',
        nearbyPlaces: ['Kedarnath Temple', 'Bhairavnath Temple', 'Gaurikund Base']
      },
      {
        name: 'Badrinath',
        category: 'Sacred Char Dham',
        image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?q=80&w=600',
        description: 'Holy colorful temple dedicated to Lord Vishnu along Alaknanda river near Mana village.',
        nearbyPlaces: ['Badrinath Temple', 'Tapt Kund Hot Spring', 'Mana First Village of India', 'Vasudhara Falls']
      },
      {
        name: 'Haridwar',
        category: 'Gateway to Gods & Har Ki Pauri',
        image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?q=80&w=600',
        description: 'Ancient holy city where Ganga enters plains; famous for Har Ki Pauri spectacular evening Aarti.',
        nearbyPlaces: ['Har Ki Pauri Ganga Aarti', 'Mansa Devi Temple Ropeway', 'Chandi Devi Temple', 'Chilla Range Wildlife']
      }
    ]
  },
  {
    id: 'west-bengal',
    name: 'West Bengal',
    type: 'State',
    capital: 'Kolkata',
    bestSeason: 'October to March',
    bestMonths: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
    description: 'Cultural Heartland – Kolkata heritage & street food, Darjeeling tea & Kanchenjunga sunrise, Kalimpong orchids, and Sundarbans Royal Bengal Tigers.',
    coverImage: 'https://images.unsplash.com/photo-1558431382-27e303142255?q=80&w=1200',
    places: [
      {
        name: 'Kolkata',
        category: 'City of Joy & Heritage',
        image: 'https://images.unsplash.com/photo-1558431382-27e303142255?q=80&w=600',
        description: 'Cultural metropolis featuring Victoria Memorial, Howrah Bridge, Dakshineswar Temple, trams, and Durga Puja.',
        nearbyPlaces: ['Victoria Memorial Hall', 'Howrah Bridge', 'Dakshineswar Kali Temple', 'Park Street', 'Indian Museum']
      },
      {
        name: 'Darjeeling',
        category: 'Queen of Hills & Champagne Tea',
        image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=600',
        description: 'Famous hill resort known for Tiger Hill golden sunrise over Kanchenjunga, Himalayan Toy Train, and tea estates.',
        nearbyPlaces: ['Tiger Hill Sunrise', 'Darjeeling Himalayan Railway Toy Train', 'Batasia Loop', 'Happy Valley Tea Estate']
      },
      {
        name: 'Kalimpong',
        category: 'Orchid Valleys & Monasteries',
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=600',
        description: 'Quiet hill retreat featuring Deolo Hill 360° viewpoint, flower nurseries, and Zang Dhok Palri Monastery.',
        nearbyPlaces: ['Deolo Hill Park', 'Durpin Monastery', 'Cactus Nursery', 'Teesta River Rafting']
      },
      {
        name: 'Sundarbans',
        category: 'UNESCO Mangrove & Royal Bengal Tiger',
        image: 'https://images.unsplash.com/photo-1549366021-9f761d450615?q=80&w=600',
        description: 'World’s largest mangrove delta forest home to swimming Royal Bengal Tigers and estuarine crocodiles.',
        nearbyPlaces: ['Sajnekhali Watch Tower', 'Sudhanyakhali Tiger Reserve Boat Safari', 'Dobanki Canopy Walk']
      }
    ]
  },

  // ==================== 8 UNION TERRITORIES ====================
  {
    id: 'andaman-nicobar',
    name: 'Andaman & Nicobar Islands',
    type: 'Union Territory',
    capital: 'Port Blair',
    bestSeason: 'November to April',
    goodPeriod: 'Nov–Apr',
    bestMonths: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'],
    description: 'Tropical paradise featuring turquoise waters, Radhanagar Beach (Asia’s finest), Havelock scuba diving, and Cellular Jail history.',
    coverImage: 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?q=80&w=1200',
    places: [
      {
        name: 'Havelock',
        category: 'Island & Scuba Paradise',
        image: 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?q=80&w=600',
        description: 'Swaraj Dweep island renowned for white sandy beaches, crystal waters, and deep sea scuba diving.',
        nearbyPlaces: ['Radhanagar Beach', 'Elephant Beach Snorkeling', 'Kalapathar Beach']
      },
      {
        name: 'Neil Island',
        category: 'Quiet Tropical Island',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600',
        description: 'Shaheed Dweep island famous for natural rock bridge, Bharatpur coral reefs, and Laxmanpur sunset.',
        nearbyPlaces: ['Natural Bridge', 'Bharatpur Beach Water Sports', 'Laxmanpur Sunset Beach']
      },
      {
        name: 'Radhanagar',
        category: 'Asia’s Best Beach',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600',
        description: 'Rated among Asia’s top pristine beaches with soft sugar white sands and turquoise waves.',
        nearbyPlaces: ['Havelock Island Pier', 'Elephant Beach']
      },
      {
        name: 'Baratang',
        category: 'Limestone Caves & Mangrove Creek',
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=600',
        description: 'Offbeat island featuring boat rides through dense mangrove creeks, limestone caves, and mud volcanoes.',
        nearbyPlaces: ['Limestone Caves Boat Tour', 'Mud Volcano', 'Parrot Island Sunset']
      }
    ]
  },
  {
    id: 'chandigarh',
    name: 'Chandigarh',
    type: 'Union Territory',
    capital: 'Chandigarh',
    bestSeason: 'October to March',
    goodPeriod: 'Oct–Mar',
    bestMonths: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
    description: 'The City Beautiful – India’s finest planned city designed by Le Corbusier featuring Rock Garden and Sukhna Lake.',
    coverImage: 'https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?q=80&w=1200',
    places: [
      {
        name: 'Rock Garden',
        category: 'Recycled Sculptures Park',
        image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=600',
        description: 'Unique open-air exhibition created by Nek Chand using industrial & urban waste materials.',
        nearbyPlaces: ['Sukhna Lake', 'Capitol Complex', 'Zakir Hussain Rose Garden']
      },
      {
        name: 'Sukhna Lake',
        category: 'Boating & Promenade',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600',
        description: 'Man-made lake at the foothills of Shivalik hills ideal for morning walks, solar boating, and sunset views.',
        nearbyPlaces: ['Rock Garden', 'Lake Promenade Walk', 'Garden of Silence']
      },
      {
        name: 'Capitol Complex',
        category: 'UNESCO Architectural Marvel',
        image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=600',
        description: 'UNESCO World Heritage modernist government plaza featuring Open Hand Monument designed by Le Corbusier.',
        nearbyPlaces: ['Open Hand Monument', 'Palais de Justice', 'Secretariat']
      }
    ]
  },
  {
    id: 'dadra-nagar-haveli-daman-diu',
    name: 'Dadra & Nagar Haveli and Daman & Diu',
    type: 'Union Territory',
    capital: 'Daman',
    bestSeason: 'October to March',
    goodPeriod: 'Oct–Mar',
    bestMonths: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
    description: 'Charming coastal Portuguese enclaves featuring fortress walls, quiet golden beaches, and Silvassa tribal gardens.',
    coverImage: 'https://images.unsplash.com/photo-1593181629936-11c609b8db9b?q=80&w=1200',
    places: [
      {
        name: 'Daman',
        category: 'Forts & Beaches',
        image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=600',
        description: 'Seaside retreat featuring Moti Daman Fort, Nani Daman Fort, and Devka Beach.',
        nearbyPlaces: ['Moti Daman Fort', 'Devka Beach Amusement', 'Jampore Beach']
      },
      {
        name: 'Diu',
        category: 'Island Fort & Cliffs',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600',
        description: 'Serene island town holding Portuguese Diu Fort, Naida Caves, and Nagoa Beach.',
        nearbyPlaces: ['Diu Fort Overlooking Ocean', 'Naida Caves Rock Formations', 'Nagoa Beach', 'St Paul Church']
      },
      {
        name: 'Silvassa',
        category: 'Tribal Greenery & Deer Park',
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=600',
        description: 'Capital of Dadra & Nagar Haveli region surrounded by Warli tribal heritage and Vanganga Lake Gardens.',
        nearbyPlaces: ['Vanganga Lake Garden', 'Dudhani End of Reservoir', 'Warli Tribal Cultural Museum']
      }
    ]
  },
  {
    id: 'delhi',
    name: 'Delhi',
    type: 'Union Territory',
    capital: 'New Delhi',
    bestSeason: 'October to March',
    goodPeriod: 'Oct–Mar',
    bestMonths: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
    description: 'National Capital Territory – centuries of imperial history with Red Fort, India Gate, Qutub Minar, and bustling Old Delhi bazaars.',
    coverImage: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=1200',
    places: [
      {
        name: 'Red Fort',
        category: 'Mughal Citadel World Heritage',
        image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=600',
        description: 'Historic red sandstone Mughal fortress where India’s Independence Day flag hoisting occurs.',
        nearbyPlaces: ['Chandni Chowk Market', 'Jama Masjid', 'Raj Ghat']
      },
      {
        name: 'India Gate',
        category: 'National Monument & Lawns',
        image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=600',
        description: 'Iconic 42m war memorial arch surrounded by Kartavya Path green lawns.',
        nearbyPlaces: ['Kartavya Path', 'National War Memorial', 'Rashtrapati Bhavan']
      },
      {
        name: 'Qutub Minar',
        category: 'UNESCO Tallest Brick Minaret',
        image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=600',
        description: '73-meter tall 12th-century victory tower surrounded by ancient Iron Pillar ruins.',
        nearbyPlaces: ['Iron Pillar of Delhi', 'Mehrauli Archaeological Park', 'Garden of Five Senses']
      },
      {
        name: 'Humayun’s Tomb',
        category: 'Mughal Garden Tomb Prototype',
        image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=600',
        description: 'First garden-tomb on Indian subcontinent, inspiration for the Taj Mahal.',
        nearbyPlaces: ['Sunder Nursery Heritage Park', 'Nizamuddin Dargah', 'Lodhi Garden']
      },
      {
        name: 'Old Delhi',
        category: 'Street Food & Chandni Chowk',
        image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=600',
        description: 'Labyrinth of narrow lanes in Chandni Chowk, Paranthe Wali Gali, and grand Jama Masjid mosque.',
        nearbyPlaces: ['Chandni Chowk Paranthe Wali Gali', 'Jama Masjid', 'Spice Market Khari Baoli']
      }
    ]
  },
  {
    id: 'jammu-kashmir',
    name: 'Jammu & Kashmir',
    type: 'Union Territory',
    capital: 'Srinagar (Summer) / Jammu (Winter)',
    bestSeason: 'April to October (Dec–Feb for Snow)',
    goodPeriod: 'Apr–Oct / Dec–Feb for snow',
    bestMonths: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Dec', 'Jan', 'Feb'],
    description: 'Paradise on Earth – Dal Lake houseboats in Srinagar, Gulmarg gondola snow slopes, Pahalgam valley streams, and Sonamarg glaciers.',
    coverImage: 'https://images.unsplash.com/photo-1566837945700-30057527ade0?q=80&w=1200',
    places: [
      {
        name: 'Srinagar',
        category: 'Dal Lake & Mughal Gardens',
        image: 'https://images.unsplash.com/photo-1566837945700-30057527ade0?q=80&w=600',
        description: 'Summer capital famous for Shikara boat rides on Dal Lake, floating vegetable market, and Shalimar Bagh.',
        nearbyPlaces: ['Dal Lake Shikara Cruise', 'Shalimar & Nishat Mughal Gardens', 'Hazratbal Shrine', 'Tulip Garden']
      },
      {
        name: 'Gulmarg',
        category: 'Snow Skiing & Gondola',
        image: 'https://images.unsplash.com/photo-1566837945700-30057527ade0?q=80&w=600',
        description: 'Meadow of Flowers home to world’s second highest Gondola cable car ride (13,780ft) and skiing slopes.',
        nearbyPlaces: ['Gulmarg Gondola Phase 1 & 2', 'Apharwat Peak', 'Golf Course Gulmarg', 'Strawberry Valley']
      },
      {
        name: 'Pahalgam',
        category: 'Valley of Shepherds & River Trek',
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=600',
        description: 'Picturesque valley along Lidder River, starting point for Amarnath Yatra and Betaab Valley.',
        nearbyPlaces: ['Betaab Valley', 'Aru Valley Trek', 'Chandanwari', 'Lidder River Rafting']
      },
      {
        name: 'Sonamarg',
        category: 'Meadow of Gold & Glaciers',
        image: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?q=80&w=600',
        description: 'Golden meadow surrounded by Thajiwas Glacier and gateway to Leh-Ladakh highway.',
        nearbyPlaces: ['Thajiwas Glacier Pony Trek', 'Zoji La Pass', 'Baltal Base']
      }
    ]
  },
  {
    id: 'ladakh',
    name: 'Ladakh',
    type: 'Union Territory',
    capital: 'Leh',
    bestSeason: 'May to September',
    goodPeriod: 'May–Sep',
    bestMonths: ['May', 'Jun', 'Jul', 'Aug', 'Sep'],
    description: 'Land of High Passes – blue waters of Pangong Tso, Nubra Valley sand dunes with Bactrian camels, Khardung La, and ancient monasteries.',
    coverImage: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?q=80&w=1200',
    places: [
      {
        name: 'Leh',
        category: 'Capital & Monasteries',
        image: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?q=80&w=600',
        description: 'High altitude mountain city featuring Leh Palace, Shanti Stupa, Magnetic Hill, and Tsemo Fort.',
        nearbyPlaces: ['Shanti Stupa Leh', 'Leh Royal Palace', 'Magnetic Hill', 'Thiksey Monastery', 'Hemis Monastery']
      },
      {
        name: 'Pangong',
        category: 'High Altitude Color-Changing Lake',
        image: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?q=80&w=600',
        description: '134km long lake at 14,270ft changing colors from azure to turquoise blue across India-China border.',
        nearbyPlaces: ['Pangong Tso Lake Camping', 'Chang La Pass', 'Spangmik Village']
      },
      {
        name: 'Nubra',
        category: 'Cold Sand Dunes & Camels',
        image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=600',
        description: 'High altitude cold desert with double-humped Bactrian camels at Hunder and Diskit Monastery giant Buddha.',
        nearbyPlaces: ['Hunder Sand Dunes Camel Safari', 'Diskit Monastery 106ft Maitreya Buddha', 'Turtuk Border Village']
      },
      {
        name: 'Tso Moriri',
        category: 'Pristine High Altitude Lake',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600',
        description: 'Secluded high-altitude brackish wetland lake in Changthang plateau home to migratory bar-headed geese.',
        nearbyPlaces: ['Korzok Village Monastery', 'Changthang Wildlife Sanctuary']
      }
    ]
  },
  {
    id: 'lakshadweep',
    name: 'Lakshadweep',
    type: 'Union Territory',
    capital: 'Kavaratti',
    bestSeason: 'October to March',
    goodPeriod: 'Oct–Mar',
    bestMonths: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
    description: 'India’s coral reef archipelago – turquoise lagoons, pristine coral reefs, glass-bottom kayaking, and secluded tropical island luxury.',
    coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200',
    places: [
      {
        name: 'Kavaratti',
        category: 'Capital & Lagoon Waters',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600',
        description: 'UT capital featuring calm blue lagoons, Marine Aquarium, Ujra Mosque, and water sports.',
        nearbyPlaces: ['Marine Aquarium Kavaratti', 'Lagoon Water Sports', 'Kavaratti Lighthouse']
      },
      {
        name: 'Agatti',
        category: 'Coral Island & Airstrip',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600',
        description: 'Gateway island with India’s most scenic airstrip surrounded by turquoise sea and glass bottom boats.',
        nearbyPlaces: ['Agatti Lagoon Scuba Diving', 'Glass Bottom Boat Ride', 'Lagoon Kayaking']
      },
      {
        name: 'Bangaram',
        category: 'Uninhabited Luxury Island',
        image: 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?q=80&w=600',
        description: 'Teardrop-shaped coral island with bioluminescent plankton night waters and pristine coral reefs.',
        nearbyPlaces: ['Thinnakara Island Walk', 'Bioluminescent Plankton Night Beach', 'Shipwreck Snorkeling']
      },
      {
        name: 'Kalpeni',
        category: 'Coral Debris Bank & Atoll',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600',
        description: 'Atoll surrounded by a gigantic storm deposit bank of coral debris and shallow coral reef walk.',
        nearbyPlaces: ['Pitti & Cheriyam Islets', 'Koomel Lagoon Promenade']
      }
    ]
  },
  {
    id: 'puducherry',
    name: 'Puducherry',
    type: 'Union Territory',
    capital: 'Puducherry',
    bestSeason: 'October to March',
    goodPeriod: 'Oct–Mar',
    bestMonths: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
    description: 'French Riviera of the East – yellow pastel colonial villas in White Town, Promenade seafront, experimental city of Auroville, and Paradise Beach.',
    coverImage: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?q=80&w=1200',
    places: [
      {
        name: 'White Town',
        category: 'French Quarter & Pastel Streets',
        image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=600',
        description: 'French colonial district with mustard-yellow heritage mansions, bougainvillea lanes, and bakeries.',
        nearbyPlaces: ['Sri Aurobindo Ashram', 'French Quarter Bicycle Tour', 'Our Lady of Angels Church']
      },
      {
        name: 'Promenade',
        category: 'Rock Beach Seafront Walk',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600',
        description: '1.5km sea-facing boulevard forbidden to motor vehicles in evenings for sunset strolls.',
        nearbyPlaces: ['French War Memorial', 'Mahatma Gandhi Statue', 'Old Lighthouse']
      },
      {
        name: 'Auroville',
        category: 'Universal Township & Matrimandir',
        image: 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?q=80&w=600',
        description: 'Experimental international township dedicated to human unity home to golden Matrimandir dome.',
        nearbyPlaces: ['Matrimandir Golden Dome Viewpoint', 'Auroville Bakery', 'Sadhana Forest']
      },
      {
        name: 'Paradise Beach',
        category: 'Island Beach & Ferry',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600',
        description: 'Isolated golden island beach accessible via Chunnambar backwater boat ride.',
        nearbyPlaces: ['Chunnambar Boat House', 'Serenity Beach Surfing']
      }
    ]
  }
];

/**
 * Returns dynamic real-world month and season information based on the current system date.
 */
export function getCurrentRealWorldMonthInfo() {
  const now = new Date();
  const currentMonthName = now.toLocaleString('default', { month: 'long' });
  const currentYear = now.getFullYear();
  
  // Calculate next month
  const nextMonthDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const nextMonthName = nextMonthDate.toLocaleString('default', { month: 'long' });

  // Strategy for current month
  const strategy = MONTHLY_TRAVEL_STRATEGY.find(s => s.month === currentMonthName) || MONTHLY_TRAVEL_STRATEGY[0];
  const nextStrategy = MONTHLY_TRAVEL_STRATEGY.find(s => s.month === nextMonthName) || MONTHLY_TRAVEL_STRATEGY[1];

  return {
    currentMonthName,
    currentYear,
    nextMonthName,
    strategy,
    nextStrategy,
    formattedDate: now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  };
}

/**
 * Given a destination string (e.g. "Maharashtra (Mumbai)", "Mumbai", or "Maharashtra"),
 * identifies the overarching State/Region and returns ALL places in that State/Region
 * EXCEPT the specific destination place selected by the user.
 */
export function getOtherPlacesInRegion(destinationInput: string): {
  regionName: string;
  selectedPlaceName: string;
  otherPlaces: PlaceInfo[];
  allPlacesInRegion: PlaceInfo[];
} {
  if (!destinationInput) {
    const fallbackRegion = INDIA_STATES_AND_UTS.find(r => r.id === 'maharashtra') || INDIA_STATES_AND_UTS[0];
    return {
      regionName: fallbackRegion.name,
      selectedPlaceName: '',
      otherPlaces: fallbackRegion.places,
      allPlacesInRegion: fallbackRegion.places
    };
  }

  const cleanInput = destinationInput.trim().toLowerCase();
  
  // Extract explicit city/place inside brackets e.g. "Maharashtra (Mumbai)" -> "Mumbai"
  let extractedSelectedPlace = '';
  const match = destinationInput.match(/\(([^)]+)\)/);
  if (match && match[1]) {
    extractedSelectedPlace = match[1].split(',')[0].trim();
  }

  let foundRegion: RegionData | undefined = undefined;

  // 1. Direct match with state name or ID
  for (const r of INDIA_STATES_AND_UTS) {
    const rName = r.name.toLowerCase();
    const rId = r.id.toLowerCase();
    
    if (cleanInput.includes(rName) || cleanInput.includes(rId) || rName.includes(cleanInput)) {
      foundRegion = r;
      break;
    }
  }

  // 2. If state match not found directly, look up which state contains a place matching input
  if (!foundRegion) {
    for (const r of INDIA_STATES_AND_UTS) {
      const pMatch = r.places.find(p => cleanInput.includes(p.name.toLowerCase()) || p.name.toLowerCase().includes(cleanInput));
      if (pMatch) {
        foundRegion = r;
        if (!extractedSelectedPlace) {
          extractedSelectedPlace = pMatch.name;
        }
        break;
      }
    }
  }

  // Fallback to Maharashtra if still unassigned
  if (!foundRegion) {
    foundRegion = INDIA_STATES_AND_UTS.find(r => r.id === 'maharashtra') || INDIA_STATES_AND_UTS[0];
  }

  // If selectedPlaceName was not found via parentheses, check if input itself is a city name
  if (!extractedSelectedPlace) {
    const cityMatch = foundRegion.places.find(p => cleanInput.includes(p.name.toLowerCase()) || p.name.toLowerCase().includes(cleanInput));
    if (cityMatch) {
      extractedSelectedPlace = cityMatch.name;
    } else {
      // If user provided just state name like "Maharashtra", default selectedPlace to capital or main city (e.g., Mumbai)
      extractedSelectedPlace = foundRegion.places[0]?.name || '';
    }
  }

  const excludeLower = extractedSelectedPlace.toLowerCase().trim();

  // Filter out the selected destination place from the region's total places
  let filteredPlaces = foundRegion.places.filter(p => {
    if (!excludeLower) return true;
    const pLower = p.name.toLowerCase().trim();
    return !pLower.includes(excludeLower) && !excludeLower.includes(pLower);
  });

  // If filtering left no places (e.g. state has only 1 place), show all places
  if (filteredPlaces.length === 0) {
    filteredPlaces = foundRegion.places;
  }

  return {
    regionName: foundRegion.name,
    selectedPlaceName: extractedSelectedPlace,
    otherPlaces: filteredPlaces,
    allPlacesInRegion: foundRegion.places
  };
}

