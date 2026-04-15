import { useState } from "react";
import { NavBar } from "@/components/NavBar";
import { useCart } from "@/contexts/CartContext";

const REGIONS = ["All", "Introductory", "Africa", "Americas", "Asia & Pacific", "MENA", "Europe"];

const BOOKS = [
  {
    id: "book_world",
    title: "A Day in the Life Of: World",
    shortTitle: "World",
    country: "World",
    region: "Introductory",
    ageRange: "Ages 4–8",
    learningFocus: "Cultural awareness; Geography; SEL; Global citizenship",
    description: "Explore a child's day across the world in this warm, inclusive introduction to global cultures. Young readers follow universal routines—morning rituals, school life, meals, and family traditions—while discovering how children everywhere share similarities and celebrate differences. This book builds empathy, curiosity, and early global awareness, making it the perfect starting point for the entire series.",
    seoKeywords: "children's book world; global kids series; multicultural book; learn about world cultures for kids",
    tags: "World; Introductory; Kids Book; Global Learning",
    slug: "/books/a-day-in-the-life-of/world",
    coverUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663477175297/hALGxxsbLQvPquoS.png",
    status: "Ready",
    price: 8.99,
  },
  {
    id: "book_ethiopia",
    title: "A Day in the Life Of: Ethiopia",
    shortTitle: "Ethiopia",
    country: "Ethiopia",
    region: "Africa",
    ageRange: "Ages 4–8",
    learningFocus: "Cultural awareness; Geography; SEL; Daily life",
    description: "Spend a day with a child in Ethiopia and explore morning routines, school life, traditional foods, and vibrant cultural celebrations. Young readers discover how Ethiopian children balance family, learning, and play while connecting with the rich history and landscapes of the country.",
    seoKeywords: "children's book ethiopia; ethiopia for kids; african culture book; multicultural kids series",
    tags: "Ethiopia; Africa; Kids Book; Global Learning",
    slug: "/books/a-day-in-the-life-of/ethiopia",
    coverUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663477175297/VYiUDGOpwrUiytve.png",
    status: "Ready",
    price: 8.99,
  },
  {
    id: "book_ghana",
    title: "A Day in the Life Of: Ghana",
    shortTitle: "Ghana",
    country: "Ghana",
    region: "Africa",
    ageRange: "Ages 4–8",
    learningFocus: "Cultural awareness; Geography; SEL; Daily life",
    description: "Follow a Ghanaian child through a day filled with music, community, school, and family traditions. Children learn about Ghana's colorful festivals, foods, and the importance of togetherness.",
    seoKeywords: "children's book ghana; ghana for kids; african children's stories; multicultural learning",
    tags: "Ghana; Africa; Kids Book; Global Learning",
    slug: "/books/a-day-in-the-life-of/ghana",
    coverUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663477175297/zizkpyfDcHnPWcyu.png",
    status: "Ready",
    price: 8.99,
  },
  {
    id: "book_kenya",
    title: "A Day in the Life Of: Kenya",
    shortTitle: "Kenya",
    country: "Kenya",
    region: "Africa",
    ageRange: "Ages 4–8",
    learningFocus: "Cultural awareness; Geography; SEL; Daily life",
    description: "Join a Kenyan child for a day of school, family time, and outdoor adventures across Kenya's diverse landscapes. Readers discover traditions, foods, and the spirit of community that shape daily life.",
    seoKeywords: "children's book kenya; kenya for kids; african culture for children; global kids series",
    tags: "Kenya; Africa; Kids Book; Global Learning",
    slug: "/books/a-day-in-the-life-of/kenya",
    coverUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663477175297/TOSmYulzGvcQMCSx.png",
    status: "Ready",
    price: 8.99,
  },
  {
    id: "book_nigeria",
    title: "A Day in the Life Of: Nigeria",
    shortTitle: "Nigeria",
    country: "Nigeria",
    region: "Africa",
    ageRange: "Ages 4–8",
    learningFocus: "Cultural awareness; Geography; SEL; Daily life",
    description: "Experience a lively day in Nigeria through the eyes of a child exploring school, family traditions, music, and community celebrations. Readers learn about Nigeria's cultural diversity and the joyful routines that shape everyday life.",
    seoKeywords: "children's book nigeria; nigeria for kids; african children's book; multicultural learning",
    tags: "Nigeria; Africa; Kids Book; Global Learning",
    slug: "/books/a-day-in-the-life-of/nigeria",
    coverUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663477175297/VeLMXjNVSVgVBdXQ.png",
    status: "Coming Soon",
    price: 8.99,
  },
  {
    id: "book_senegal",
    title: "A Day in the Life Of: Senegal",
    shortTitle: "Senegal",
    country: "Senegal",
    region: "Africa",
    ageRange: "Ages 4–8",
    learningFocus: "Cultural awareness; Geography; SEL; Daily life",
    description: "Spend a day with a child in Senegal and explore warm greetings, school activities, family meals, and cultural traditions. Readers discover the importance of community, respect, and joy in Senegalese daily life.",
    seoKeywords: "children's book senegal; senegal for kids; african culture book; global citizenship for children",
    tags: "Senegal; Africa; Kids Book; Global Learning",
    slug: "/books/a-day-in-the-life-of/senegal",
    coverUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663477175297/PIFZlyTrRpTRzvvo.png",
    status: "Ready",
    price: 8.99,
  },
  {
    id: "book_south_africa",
    title: "A Day in the Life Of: South Africa",
    shortTitle: "South Africa",
    country: "South Africa",
    region: "Africa",
    ageRange: "Ages 4–8",
    learningFocus: "Cultural awareness; Geography; SEL; Daily life",
    description: "Follow a South African child through a day filled with school, sports, family traditions, and the country's rich cultural diversity. Readers explore foods, languages, and celebrations that make South Africa unique.",
    seoKeywords: "children's book south africa; south africa for kids; african multicultural book; global learning",
    tags: "South Africa; Africa; Kids Book; Global Learning",
    slug: "/books/a-day-in-the-life-of/south-africa",
    coverUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663477175297/lHKwniwdehexGTrO.png",
    status: "Ready",
    price: 8.99,
  },
  {
    id: "book_argentina",
    title: "A Day in the Life Of: Argentina",
    shortTitle: "Argentina",
    country: "Argentina",
    region: "Americas",
    ageRange: "Ages 4–8",
    learningFocus: "Cultural awareness; Geography; SEL; Daily life",
    description: "Spend a day with an Argentinian child exploring school, family meals, traditions, and the country's vibrant blend of European and Latin American influences. Readers discover the rhythms of daily life shaped by community, culture, and celebration.",
    seoKeywords: "children's book argentina; argentina for kids; south america kids book; multicultural learning",
    tags: "Argentina; Americas; Kids Book; Global Learning",
    slug: "/books/a-day-in-the-life-of/argentina",
    coverUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663477175297/AhvDHRUzjhnbbqOP.png",
    status: "Ready",
    price: 8.99,
  },
  {
    id: "book_brazil",
    title: "A Day in the Life Of: Brazil",
    shortTitle: "Brazil",
    country: "Brazil",
    region: "Americas",
    ageRange: "Ages 4–8",
    learningFocus: "Cultural awareness; Geography; SEL; Daily life",
    description: "Follow a Brazilian child through a day of school, music, food, and celebrations. Readers explore Brazil's rich cultural diversity, natural beauty, and joyful community spirit.",
    seoKeywords: "children's book brazil; brazil for kids; south america children's stories; multicultural learning",
    tags: "Brazil; Americas; Kids Book; Global Learning",
    slug: "/books/a-day-in-the-life-of/brazil",
    coverUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663477175297/EJuoJzmIddfSYVIW.png",
    status: "Coming Soon",
    price: 8.99,
  },
  {
    id: "book_canada",
    title: "A Day in the Life Of: Canada",
    shortTitle: "Canada",
    country: "Canada",
    region: "Americas",
    ageRange: "Ages 4–8",
    learningFocus: "Cultural awareness; Geography; SEL; Daily life",
    description: "Spend a day with a Canadian child exploring school, outdoor adventures, family routines, and cultural traditions. Readers discover the warmth, diversity, and natural beauty that shape daily life in Canada.",
    seoKeywords: "children's book canada; canada for kids; north america kids book; global learning",
    tags: "Canada; Americas; Kids Book; Global Learning",
    slug: "/books/a-day-in-the-life-of/canada",
    coverUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663477175297/qlkjnnePdlJXVSAe.png",
    status: "Ready",
    price: 8.99,
  },
  {
    id: "book_chile",
    title: "A Day in the Life Of: Chile",
    shortTitle: "Chile",
    country: "Chile",
    region: "Americas",
    ageRange: "Ages 4–8",
    learningFocus: "Cultural awareness; Geography; SEL; Daily life",
    description: "Join a Chilean child for a day of school, family meals, traditions, and outdoor exploration across Chile's diverse landscapes. Readers discover the routines and cultural richness of Chilean life.",
    seoKeywords: "children's book chile; chile for kids; south america culture book; global learning",
    tags: "Chile; Americas; Kids Book; Global Learning",
    slug: "/books/a-day-in-the-life-of/chile",
    coverUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663477175297/cipcgmvMIDFPrwss.png",
    status: "Ready",
    price: 8.99,
  },
  {
    id: "book_colombia",
    title: "A Day in the Life Of: Colombia",
    shortTitle: "Colombia",
    country: "Colombia",
    region: "Americas",
    ageRange: "Ages 4–8",
    learningFocus: "Cultural awareness; Geography; SEL; Daily life",
    description: "Follow a Colombian child through a day of school, music, food, and family traditions. Readers explore Colombia's vibrant culture, natural beauty, and joyful community life.",
    seoKeywords: "children's book colombia; colombia for kids; south america kids culture; multicultural learning",
    tags: "Colombia; Americas; Kids Book; Global Learning",
    slug: "/books/a-day-in-the-life-of/colombia",
    coverUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663477175297/RVeUsHxdSlennYuN.png",
    status: "Ready",
    price: 8.99,
  },
  {
    id: "book_jamaica",
    title: "A Day in the Life Of: Jamaica",
    shortTitle: "Jamaica",
    country: "Jamaica",
    region: "Americas",
    ageRange: "Ages 4–8",
    learningFocus: "Cultural awareness; Geography; SEL; Daily life",
    description: "Spend a day with a Jamaican child exploring school, music, food, and island traditions. Readers discover the warmth, creativity, and community spirit that shape Jamaican daily life.",
    seoKeywords: "children's book jamaica; jamaica for kids; caribbean kids book; multicultural learning",
    tags: "Jamaica; Americas; Kids Book; Global Learning",
    slug: "/books/a-day-in-the-life-of/jamaica",
    coverUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663477175297/xOKtmeSQWPuFpTly.png",
    status: "Coming Soon",
    price: 8.99,
  },
  {
    id: "book_mexico",
    title: "A Day in the Life Of: Mexico",
    shortTitle: "Mexico",
    country: "Mexico",
    region: "Americas",
    ageRange: "Ages 4–8",
    learningFocus: "Cultural awareness; Geography; SEL; Daily life",
    description: "Join a Mexican child for a day of school, family gatherings, foods, and cultural celebrations. Readers explore Mexico's rich traditions, colors, and community‑centered routines.",
    seoKeywords: "children's book mexico; mexico for kids; latin america kids book; multicultural learning",
    tags: "Mexico; Americas; Kids Book; Global Learning",
    slug: "/books/a-day-in-the-life-of/mexico",
    coverUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663477175297/GhlPWpRiWRnfpQyL.png",
    status: "Coming Soon",
    price: 8.99,
  },
  {
    id: "book_peru",
    title: "A Day in the Life Of: Peru",
    shortTitle: "Peru",
    country: "Peru",
    region: "Americas",
    ageRange: "Ages 4–8",
    learningFocus: "Cultural awareness; Geography; SEL; Daily life",
    description: "Follow a Peruvian child through a day of school, family traditions, foods, and celebrations. Readers discover Peru's cultural diversity and the routines shaped by its history and landscapes.",
    seoKeywords: "children's book peru; peru for kids; south america children's culture; global learning",
    tags: "Peru; Americas; Kids Book; Global Learning",
    slug: "/books/a-day-in-the-life-of/peru",
    coverUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663477175297/NshCGifBnOFNHLYK.png",
    status: "Ready",
    price: 8.99,
  },
  {
    id: "book_united_states",
    title: "A Day in the Life Of: United States",
    shortTitle: "United States",
    country: "United States",
    region: "Americas",
    ageRange: "Ages 4–8",
    learningFocus: "Cultural awareness; Geography; SEL; Daily life",
    description: "Spend a day with a child in the United States exploring school, family routines, foods, and cultural traditions. Readers discover the diversity and everyday rhythms that shape American life.",
    seoKeywords: "children's book united states; usa for kids; north america kids culture; global learning",
    tags: "United States; Americas; Kids Book; Global Learning",
    slug: "/books/a-day-in-the-life-of/united-states",
    coverUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663477175297/eeHhzYYVXaJqpZKL.png",
    status: "Ready",
    price: 8.99,
  },
  {
    id: "book_venezuela",
    title: "A Day in the Life Of: Venezuela",
    shortTitle: "Venezuela",
    country: "Venezuela",
    region: "Americas",
    ageRange: "Ages 4–8",
    learningFocus: "Cultural awareness; Geography; SEL; Daily life",
    description: "Join a Venezuelan child for a day of school, family traditions, foods, and celebrations. Readers explore the warmth, resilience, and cultural richness of Venezuelan daily life.",
    seoKeywords: "children's book venezuela; venezuela for kids; south america kids stories; multicultural learning",
    tags: "Venezuela; Americas; Kids Book; Global Learning",
    slug: "/books/a-day-in-the-life-of/venezuela",
    coverUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663477175297/xpjWYNMNflKVUsJr.png",
    status: "Ready",
    price: 8.99,
  },
  {
    id: "book_australia",
    title: "A Day in the Life Of: Australia",
    shortTitle: "Australia",
    country: "Australia",
    region: "Asia & Pacific",
    ageRange: "Ages 4–8",
    learningFocus: "Cultural awareness; Geography; SEL; Daily life",
    description: "Spend a day with an Australian child exploring school, outdoor adventures, family routines, and cultural traditions. Readers discover the unique blend of nature, community, and creativity that shapes daily life in Australia.",
    seoKeywords: "children's book australia; australia for kids; oceania kids book; multicultural learning",
    tags: "Australia; Asia & Pacific; Kids Book; Global Learning",
    slug: "/books/a-day-in-the-life-of/australia",
    coverUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663477175297/coDpTqphALeWtLOl.png",
    status: "Ready",
    price: 8.99,
  },
  {
    id: "book_china",
    title: "A Day in the Life Of: China",
    shortTitle: "China",
    country: "China",
    region: "Asia & Pacific",
    ageRange: "Ages 4–8",
    learningFocus: "Cultural awareness; Geography; SEL; Daily life",
    description: "Follow a Chinese child through a day of school, family meals, traditions, and celebrations. Readers explore China's rich cultural heritage and the routines that shape everyday life.",
    seoKeywords: "children's book china; china for kids; asian culture for children; global learning",
    tags: "China; Asia & Pacific; Kids Book; Global Learning",
    slug: "/books/a-day-in-the-life-of/china",
    coverUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663477175297/rCdVuHdOgkLzBBUm.png",
    status: "Ready",
    price: 8.99,
  },
  {
    id: "book_india",
    title: "A Day in the Life Of: India",
    shortTitle: "India",
    country: "India",
    region: "Asia & Pacific",
    ageRange: "Ages 4–8",
    learningFocus: "Cultural awareness; Geography; SEL; Daily life",
    description: "Join an Indian child for a day of school, family traditions, foods, and celebrations. Readers discover India's cultural diversity and the rhythms of daily routines shaped by community and heritage.",
    seoKeywords: "children's book india; india for kids; asian children's stories; multicultural learning",
    tags: "India; Asia & Pacific; Kids Book; Global Learning",
    slug: "/books/a-day-in-the-life-of/india",
    coverUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663477175297/kaeBjXwvFuRhwjEj.png",
    status: "Coming Soon",
    price: 8.99,
  },
  {
    id: "book_indonesia",
    title: "A Day in the Life Of: Indonesia",
    shortTitle: "Indonesia",
    country: "Indonesia",
    region: "Asia & Pacific",
    ageRange: "Ages 4–8",
    learningFocus: "Cultural awareness; Geography; SEL; Daily life",
    description: "Spend a day with an Indonesian child exploring school, foods, traditions, and island life. Readers discover Indonesia's cultural richness and the routines shaped by community and nature.",
    seoKeywords: "children's book indonesia; indonesia for kids; southeast asia kids book; multicultural learning",
    tags: "Indonesia; Asia & Pacific; Kids Book; Global Learning",
    slug: "/books/a-day-in-the-life-of/indonesia",
    coverUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663477175297/NoWynWXGOSzyGybt.png",
    status: "Ready",
    price: 8.99,
  },
  {
    id: "book_japan",
    title: "A Day in the Life Of: Japan",
    shortTitle: "Japan",
    country: "Japan",
    region: "Asia & Pacific",
    ageRange: "Ages 4–8",
    learningFocus: "Cultural awareness; Geography; SEL; Daily life",
    description: "Follow a Japanese child through a day of school, traditions, foods, and cultural celebrations. Readers explore Japan's blend of modern life and deep cultural heritage.",
    seoKeywords: "children's book japan; japan for kids; asian culture book; global learning",
    tags: "Japan; Asia & Pacific; Kids Book; Global Learning",
    slug: "/books/a-day-in-the-life-of/japan",
    coverUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663477175297/DlwkptpvFtdKGcnr.png",
    status: "Ready",
    price: 8.99,
  },
  {
    id: "book_new_zealand",
    title: "A Day in the Life Of: New Zealand",
    shortTitle: "New Zealand",
    country: "New Zealand",
    region: "Asia & Pacific",
    ageRange: "Ages 4–8",
    learningFocus: "Cultural awareness; Geography; SEL; Daily life",
    description: "Join a New Zealand child for a day of school, outdoor exploration, family routines, and cultural traditions. Readers discover the natural beauty and community spirit that shape daily life.",
    seoKeywords: "children's book new zealand; new zealand for kids; oceania children's stories; multicultural learning",
    tags: "New Zealand; Asia & Pacific; Kids Book; Global Learning",
    slug: "/books/a-day-in-the-life-of/new-zealand",
    coverUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663477175297/LQwXdwVefKUhLzAC.png",
    status: "Ready",
    price: 8.99,
  },
  {
    id: "book_philippines",
    title: "A Day in the Life Of: Philippines",
    shortTitle: "Philippines",
    country: "Philippines",
    region: "Asia & Pacific",
    ageRange: "Ages 4–8",
    learningFocus: "Cultural awareness; Geography; SEL; Daily life",
    description: "Spend a day with a Filipino child exploring school, family gatherings, foods, and cultural celebrations. Readers discover the warmth, resilience, and traditions that shape daily life in the Philippines.",
    seoKeywords: "children's book philippines; philippines for kids; southeast asia kids culture; global learning",
    tags: "Philippines; Asia & Pacific; Kids Book; Global Learning",
    slug: "/books/a-day-in-the-life-of/philippines",
    coverUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663477175297/RcSGjCYKNwrrvlbm.png",
    status: "Coming Soon",
    price: 8.99,
  },
  {
    id: "book_south_korea",
    title: "A Day in the Life Of: South Korea",
    shortTitle: "South Korea",
    country: "South Korea",
    region: "Asia & Pacific",
    ageRange: "Ages 4–8",
    learningFocus: "Cultural awareness; Geography; SEL; Daily life",
    description: "Follow a South Korean child through a day of school, foods, traditions, and celebrations. Readers explore the blend of modern life and cultural heritage that shapes daily routines.",
    seoKeywords: "children's book south korea; korea for kids; asian kids culture; multicultural learning",
    tags: "South Korea; Asia & Pacific; Kids Book; Global Learning",
    slug: "/books/a-day-in-the-life-of/south-korea",
    coverUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663477175297/WFIUgjFgIxyqsqpZ.png",
    status: "Ready",
    price: 8.99,
  },
  {
    id: "book_thailand",
    title: "A Day in the Life Of: Thailand",
    shortTitle: "Thailand",
    country: "Thailand",
    region: "Asia & Pacific",
    ageRange: "Ages 4–8",
    learningFocus: "Cultural awareness; Geography; SEL; Daily life",
    description: "Join a Thai child for a day of school, foods, traditions, and cultural celebrations. Readers discover Thailand's warmth, creativity, and community‑centered routines.",
    seoKeywords: "children's book thailand; thailand for kids; southeast asia children's stories; global learning",
    tags: "Thailand; Asia & Pacific; Kids Book; Global Learning",
    slug: "/books/a-day-in-the-life-of/thailand",
    coverUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663477175297/BFOgwTSPnvlXJCSX.png",
    status: "Ready",
    price: 8.99,
  },
  {
    id: "book_egypt",
    title: "A Day in the Life Of: Egypt",
    shortTitle: "Egypt",
    country: "Egypt",
    region: "MENA",
    ageRange: "Ages 4–8",
    learningFocus: "Cultural awareness; Geography; SEL; Daily life",
    description: "Spend a day with an Egyptian child exploring school, family traditions, foods, and the country's blend of ancient history and modern life. Readers discover the rhythms of daily routines shaped by culture, community, and celebration.",
    seoKeywords: "children's book egypt; egypt for kids; mena kids book; multicultural learning",
    tags: "Egypt; MENA; Kids Book; Global Learning",
    slug: "/books/a-day-in-the-life-of/egypt",
    coverUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663477175297/RCjnWKsrcHnNnQAb.png",
    status: "Ready",
    price: 8.99,
  },
  {
    id: "book_saudi_arabia",
    title: "A Day in the Life Of: Saudi Arabia",
    shortTitle: "Saudi Arabia",
    country: "Saudi Arabia",
    region: "MENA",
    ageRange: "Ages 4–8",
    learningFocus: "Cultural awareness; Geography; SEL; Daily life",
    description: "Follow a Saudi child through a day of school, family gatherings, foods, and cultural traditions. Readers explore the routines and celebrations that shape daily life in Saudi Arabia.",
    seoKeywords: "children's book saudi arabia; saudi for kids; middle east kids book; global learning",
    tags: "Saudi Arabia; MENA; Kids Book; Global Learning",
    slug: "/books/a-day-in-the-life-of/saudi-arabia",
    coverUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663477175297/xAPGwuZRKEIeawMt.png",
    status: "Ready",
    price: 8.99,
  },
  {
    id: "book_uae",
    title: "A Day in the Life Of: United Arab Emirates",
    shortTitle: "United Arab Emirates",
    country: "United Arab Emirates",
    region: "MENA",
    ageRange: "Ages 4–8",
    learningFocus: "Cultural awareness; Geography; SEL; Daily life",
    description: "Join a child in the UAE for a day of school, family life, foods, and cultural celebrations. Readers discover the blend of tradition and modernity that shapes daily routines in the Emirates.",
    seoKeywords: "children's book uae; uae for kids; middle east children's stories; multicultural learning",
    tags: "United Arab Emirates; MENA; Kids Book; Global Learning",
    slug: "/books/a-day-in-the-life-of/united-arab-emirates",
    coverUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663477175297/cmIlfyWjDVlILARM.png",
    status: "Ready",
    price: 8.99,
  },
  {
    id: "book_greece",
    title: "A Day in the Life Of: Greece",
    shortTitle: "Greece",
    country: "Greece",
    region: "Europe",
    ageRange: "Ages 4–8",
    learningFocus: "Cultural awareness; Geography; SEL; Daily life",
    description: "Spend a day with a Greek child exploring school, foods, family traditions, and cultural celebrations. Readers discover Greece's blend of ancient history and modern life through the rhythms of everyday routines.",
    seoKeywords: "children's book greece; greece for kids; europe kids culture; multicultural learning",
    tags: "Greece; Europe; Kids Book; Global Learning",
    slug: "/books/a-day-in-the-life-of/greece",
    coverUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663477175297/nfchKvmRlXcvwowV.png",
    status: "Ready",
    price: 8.99,
  },
  {
    id: "book_italy",
    title: "A Day in the Life Of: Italy",
    shortTitle: "Italy",
    country: "Italy",
    region: "Europe",
    ageRange: "Ages 4–8",
    learningFocus: "Cultural awareness; Geography; SEL; Daily life",
    description: "Follow an Italian child through a day of school, foods, family gatherings, and cultural traditions. Readers explore Italy's warmth, creativity, and community‑centered routines.",
    seoKeywords: "children's book italy; italy for kids; europe children's stories; global learning",
    tags: "Italy; Europe; Kids Book; Global Learning",
    slug: "/books/a-day-in-the-life-of/italy",
    coverUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663477175297/uwpmPRFBBxWnRehD.png",
    status: "Ready",
    price: 8.99,
  },
  {
    id: "book_cuba",
    title: "A Day in the Life Of: Cuba",
    shortTitle: "Cuba",
    country: "Cuba",
    region: "Americas",
    ageRange: "Ages 4–8",
    learningFocus: "Cultural awareness; Geography; SEL; Daily life",
    description: "Spend a day with a Cuban child exploring school, family traditions, music, and the vibrant culture that shapes daily life. Readers discover the warmth, creativity, and community spirit of Cuba.",
    seoKeywords: "children's book cuba; cuba for kids; caribbean culture book; multicultural kids series",
    tags: "Cuba; Americas; Kids Book; Global Learning",
    slug: "/books/a-day-in-the-life-of/cuba",
    coverUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663477175297/JUaJzAmcWrVvBJZP.png",
    status: "Ready",
    price: 8.99,
  },
  {
    id: "book_dominican_republic",
    title: "A Day in the Life Of: Dominican Republic",
    shortTitle: "Dominican Republic",
    country: "Dominican Republic",
    region: "Americas",
    ageRange: "Ages 4–8",
    learningFocus: "Cultural awareness; Geography; SEL; Daily life",
    description: "Join a Dominican child for a day of school, family gatherings, foods, and cultural celebrations. Readers discover the music, traditions, and community spirit that shape daily life in the Dominican Republic.",
    seoKeywords: "children's book dominican republic; dominican republic for kids; caribbean kids book; multicultural learning",
    tags: "Dominican Republic; Americas; Kids Book; Global Learning",
    slug: "/books/a-day-in-the-life-of/dominican-republic",
    coverUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663477175297/ypvCrHyijEdZMVnz.png",
    status: "Ready",
    price: 8.99,
  },
  {
    id: "book_ecuador",
    title: "A Day in the Life Of: Ecuador",
    shortTitle: "Ecuador",
    country: "Ecuador",
    region: "Americas",
    ageRange: "Ages 4–8",
    learningFocus: "Cultural awareness; Geography; SEL; Daily life",
    description: "Follow an Ecuadorian child through a day of school, family traditions, foods, and cultural celebrations. Readers discover Ecuador's stunning landscapes and the routines shaped by its diverse communities.",
    seoKeywords: "children's book ecuador; ecuador for kids; latin america kids book; multicultural learning",
    tags: "Ecuador; Americas; Kids Book; Global Learning",
    slug: "/books/a-day-in-the-life-of/ecuador",
    coverUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663477175297/tatmBUNhMLgQaOHv.png",
    status: "Ready",
    price: 8.99,
  },
  {
    id: "book_haiti",
    title: "A Day in the Life Of: Haiti",
    shortTitle: "Haiti",
    country: "Haiti",
    region: "Americas",
    ageRange: "Ages 4–8",
    learningFocus: "Cultural awareness; Geography; SEL; Daily life",
    description: "Spend a day with a Haitian child exploring school, family traditions, foods, and the vibrant culture that defines daily life. Readers discover Haiti's rich history, creativity, and community spirit.",
    seoKeywords: "children's book haiti; haiti for kids; caribbean culture book; multicultural kids series",
    tags: "Haiti; Americas; Kids Book; Global Learning",
    slug: "/books/a-day-in-the-life-of/haiti",
    coverUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663477175297/ufQZOFWENurhgIBG.png",
    status: "Ready",
    price: 8.99,
  },
  {
    id: "book_morocco",
    title: "A Day in the Life Of: Morocco",
    shortTitle: "Morocco",
    country: "Morocco",
    region: "MENA",
    ageRange: "Ages 4–8",
    learningFocus: "Cultural awareness; Geography; SEL; Daily life",
    description: "Join a Moroccan child for a day of school, family meals, souks, and cultural traditions. Readers discover Morocco's colorful blend of Berber, Arab, and Mediterranean influences.",
    seoKeywords: "children's book morocco; morocco for kids; north africa kids book; multicultural learning",
    tags: "Morocco; MENA; Kids Book; Global Learning",
    slug: "/books/a-day-in-the-life-of/morocco",
    coverUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663477175297/EUKvdjRSylDZcJuZ.png",
    status: "Ready",
    price: 8.99,
  },
  {
    id: "book_puerto_rico",
    title: "A Day in the Life Of: Puerto Rico",
    shortTitle: "Puerto Rico",
    country: "Puerto Rico",
    region: "Americas",
    ageRange: "Ages 4–8",
    learningFocus: "Cultural awareness; Geography; SEL; Daily life",
    description: "Spend a day with a Puerto Rican child exploring school, family traditions, music, and the island's vibrant culture. Readers discover the warmth, creativity, and pride that shape daily life in Puerto Rico.",
    seoKeywords: "children's book puerto rico; puerto rico for kids; caribbean kids book; multicultural learning",
    tags: "Puerto Rico; Americas; Kids Book; Global Learning",
    slug: "/books/a-day-in-the-life-of/puerto-rico",
    coverUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663477175297/wKmTpUywTmkJyYoC.png",
    status: "Ready",
    price: 8.99,
  },
  {
    id: "book_vietnam",
    title: "A Day in the Life Of: Vietnam",
    shortTitle: "Vietnam",
    country: "Vietnam",
    region: "Asia & Pacific",
    ageRange: "Ages 4–8",
    learningFocus: "Cultural awareness; Geography; SEL; Daily life",
    description: "Follow a Vietnamese child through a day of school, family traditions, foods, and cultural celebrations. Readers discover Vietnam's rich history, natural beauty, and the community spirit that shapes daily life.",
    seoKeywords: "children's book vietnam; vietnam for kids; asia kids book; multicultural learning",
    tags: "Vietnam; Asia & Pacific; Kids Book; Global Learning",
    slug: "/books/a-day-in-the-life-of/vietnam",
    coverUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663477175297/PLhhmWaOfxoYRMXO.png",
    status: "Ready",
    price: 8.99,
  },
];

const REGION_COLORS: Record<string, string> = {
  Introductory: "bg-purple-100 text-purple-800",
  Africa: "bg-amber-100 text-amber-800",
  Americas: "bg-green-100 text-green-800",
  "Asia & Pacific": "bg-blue-100 text-blue-800",
  MENA: "bg-orange-100 text-orange-800",
  Europe: "bg-indigo-100 text-indigo-800",
};

export function ChildrensBooksPage() {
  const [selectedRegion, setSelectedRegion] = useState("All");
  const [search, setSearch] = useState("");
  const { addItem } = useCart();

  const filtered = BOOKS.filter((b) => {
    const matchRegion = selectedRegion === "All" || b.region === selectedRegion;
    const matchSearch =
      search === "" ||
      b.country.toLowerCase().includes(search.toLowerCase()) ||
      b.title.toLowerCase().includes(search.toLowerCase());
    return matchRegion && matchSearch;
  });

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <NavBar />

      {/* Hero */}
      <section className="pt-24 pb-12 px-4 text-center">
        <span className="text-[#C9A86A] font-semibold text-sm uppercase tracking-widest">Children's Books</span>
        <h1 className="text-4xl md:text-5xl font-bold font-serif mt-2 mb-3">A Day in the Life Of...</h1>
        <p className="text-white/60 text-lg max-w-2xl mx-auto">
          24-page illustrated children's books celebrating authentic cultural traditions around the world. Ages 4–8. Instant PDF download.
        </p>
        <div className="mt-4 flex justify-center gap-6 text-sm text-white/50">
          <span>📚 38 Books</span>
          <span>🌍 6 Regions</span>
          <span>✏️ By Anthony Lane</span>
          <span>⚡ Instant Download</span>
        </div>
      </section>

      {/* Filters */}
      <section className="px-4 pb-6 max-w-6xl mx-auto">
        <div className="flex flex-wrap gap-2 justify-center mb-4">
          {REGIONS.map((r) => (
            <button
              key={r}
              onClick={() => setSelectedRegion(r)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                selectedRegion === r
                  ? "bg-[#C9A86A] text-black border-[#C9A86A]"
                  : "border-white/20 text-white/60 hover:border-[#C9A86A] hover:text-[#C9A86A]"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
        <div className="flex justify-center">
          <input
            type="text"
            placeholder="Search by country..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white placeholder-white/30 w-full max-w-sm focus:outline-none focus:border-[#C9A86A]"
          />
        </div>
      </section>

      {/* Book Grid */}
      <section className="px-4 pb-20 max-w-6xl mx-auto">
        <p className="text-white/40 text-sm mb-4 text-center">{filtered.length} book{filtered.length !== 1 ? "s" : ""} shown</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filtered.map((book) => (
            <div
              key={book.id}
              className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-[#C9A86A]/50 transition-all group"
            >
              {/* Cover image */}
              <div className="aspect-[3/4] relative overflow-hidden bg-gradient-to-br from-[#C9A86A]/20 to-[#1a1a1a]">
                {book.coverUrl ? (
                  <img
                    src={book.coverUrl}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
                    <div className="text-3xl mb-2">🌍</div>
                    <div className="text-[#C9A86A] text-xs font-semibold uppercase tracking-widest mb-1">Global Kids Series</div>
                    <div className="text-white font-bold text-sm leading-tight">A Day in the Life Of</div>
                    <div className="text-white/80 text-xs mt-1">{book.country}</div>
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${REGION_COLORS[book.region] || "bg-gray-100 text-gray-800"}`}>
                    {book.region}
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="p-3">
                <h3 className="text-white text-xs font-semibold leading-tight mb-1 line-clamp-2">{book.title}</h3>
                <p className="text-white/40 text-xs mb-2">{book.ageRange} · 24 pages</p>
                <div className="flex items-center justify-between">
                  <span className="text-[#C9A86A] font-bold text-sm">${book.price.toFixed(2)}</span>
                  <button
                    onClick={() =>
                      addItem({
                        productId: book.id,
                        name: book.title,
                        price: Math.round(book.price * 100),
                        image: book.coverUrl || "",
                        category: "Children's Books",
                      })
                    }
                    className="text-xs bg-[#C9A86A] text-black px-2 py-1 rounded-lg font-semibold hover:bg-[#b8975a] transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
