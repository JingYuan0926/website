import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://uulzrfppmwwoyxiumkjc.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1bHpyZnBwbXd3b3l4aXVta2pjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzI4NzcyOCwiZXhwIjoyMDg4ODYzNzI4fQ.eH64gC4DpGuR_MLgwB9AzM9NiA3JEZnCnxe9C92GcUc"
);

const members = [
  { name: "Han", twitter_handle: "W_Han_01", avatar_url: "https://unavatar.io/twitter/W_Han_01" },
  { name: "Yudhishthra S Sugumaran", twitter_handle: "0xYudhishthra", avatar_url: "https://unavatar.io/twitter/0xYudhishthra" },
  { name: "Marianne", twitter_handle: "tuakdotsol", avatar_url: "https://unavatar.io/twitter/tuakdotsol" },
  { name: "Fares Abida", twitter_handle: "dumbledyor", avatar_url: "https://unavatar.io/twitter/dumbledyor" },
  { name: "Matthew Sim", twitter_handle: "rvaclassic", avatar_url: "https://unavatar.io/twitter/rvaclassic" },
  { name: "Sophia Dominique Dizon", twitter_handle: "nikkideyy", avatar_url: "https://unavatar.io/twitter/nikkideyy" },
  { name: "Dominique Dymke", twitter_handle: "deedee1337", avatar_url: "https://unavatar.io/twitter/deedee1337" },
  { name: "Wan Muhammad Aqil", twitter_handle: "wanaokii", avatar_url: "https://unavatar.io/twitter/wanaokii" },
  { name: "Abd Azharee Wahid", twitter_handle: "abangbrooch", avatar_url: "https://unavatar.io/twitter/abangbrooch" },
  { name: "Tan Wei Hup", twitter_handle: "weihup", avatar_url: "https://unavatar.io/twitter/weihup" },
  { name: "twentifo24", twitter_handle: "twentifo24", avatar_url: "https://unavatar.io/twitter/twentifo24" },
  { name: "Semi", twitter_handle: "semi_infiknight", avatar_url: "https://unavatar.io/twitter/semi_infiknight" },
  { name: "Benjamin Tan", twitter_handle: "0xBenjamintan", avatar_url: "https://unavatar.io/twitter/0xBenjamintan" },
  { name: "Chii Yuen", twitter_handle: "ChiiYuen", avatar_url: "https://unavatar.io/twitter/ChiiYuen" },
  { name: "Ines Yong", twitter_handle: "inesyongdao", avatar_url: "https://unavatar.io/twitter/inesyongdao" },
  { name: "Nic Fury", twitter_handle: "NicFury", avatar_url: "https://unavatar.io/twitter/NicFury" },
  { name: "Jack", twitter_handle: "jackfrostt1221", avatar_url: "https://unavatar.io/twitter/jackfrostt1221" },
  { name: "Joe Wong", twitter_handle: "KhunJoe5", avatar_url: "https://unavatar.io/twitter/KhunJoe5" },
  { name: "Wong Jun Shen", twitter_handle: "_Junshen18", avatar_url: "https://unavatar.io/twitter/_Junshen18" },
  { name: "Lai Kai Yong", twitter_handle: "0xvandycklai", avatar_url: "https://unavatar.io/twitter/0xvandycklai" },
  { name: "Lai Cheong Kian", twitter_handle: "LCKian88", avatar_url: "https://unavatar.io/twitter/LCKian88" },
  { name: "Sean Hoe", twitter_handle: "Sean_Hoee", avatar_url: "https://unavatar.io/twitter/Sean_Hoee" },
  { name: "Marcus Tan", twitter_handle: "marcustan1337", avatar_url: "https://unavatar.io/twitter/marcustan1337" },
  { name: "Ricnish Raj", twitter_handle: "ricnishraj", avatar_url: "https://unavatar.io/twitter/ricnishraj" },
  { name: "Ong Ee Shen", twitter_handle: "Ong_pogs", avatar_url: "https://unavatar.io/twitter/Ong_pogs" },
  { name: "Nizar Syahmi", twitter_handle: "nizarsyahmi37", avatar_url: "https://unavatar.io/twitter/nizarsyahmi37" },
  { name: "Kate Lam", twitter_handle: "eggiekate", avatar_url: "https://unavatar.io/twitter/eggiekate" },
  { name: "Muhammad Hazlami", twitter_handle: "ponderman_nft", avatar_url: "https://unavatar.io/twitter/ponderman_nft" },
  { name: "Muhammad Najmuddin", twitter_handle: "0xmuden", avatar_url: "https://unavatar.io/twitter/0xmuden" },
  { name: "Nazreen", twitter_handle: "dotslashnaz", avatar_url: "https://unavatar.io/twitter/dotslashnaz" },
  { name: "Marc J", twitter_handle: "Umamipa", avatar_url: "https://unavatar.io/twitter/Umamipa" },
  { name: "Muhammad Haziq", twitter_handle: "codedolphin2", avatar_url: "https://unavatar.io/twitter/codedolphin2" },
  { name: "DahriChan", twitter_handle: "DahriChan", avatar_url: "https://unavatar.io/twitter/DahriChan" },
  { name: "Tran Xuan Duc", twitter_handle: "Duketran1606", avatar_url: "https://unavatar.io/twitter/Duketran1606" },
  { name: "Tan Hao Xiang", twitter_handle: "haoxiang_14", avatar_url: "https://unavatar.io/twitter/haoxiang_14" },
  { name: "BreeAnne Yek", twitter_handle: "bytesbybree", avatar_url: "https://unavatar.io/twitter/bytesbybree" },
  { name: "Yong Chin Bing", twitter_handle: "chin_mage777", avatar_url: "https://unavatar.io/twitter/chin_mage777" },
];

// Add default fields and display_order
const rows = members.map((m, i) => ({
  ...m,
  title: "",
  bio: "",
  skills: [],
  github_url: "",
  linkedin_url: "",
  wallet_address: "",
  is_spotlight: false,
  display_order: i,
}));

const { data, error } = await supabase.from("members").insert(rows).select();

if (error) {
  console.error("Error inserting members:", error.message);
  process.exit(1);
}

console.log(`Successfully inserted ${data.length} members!`);
