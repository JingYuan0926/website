import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://uulzrfppmwwoyxiumkjc.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1bHpyZnBwbXd3b3l4aXVta2pjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzI4NzcyOCwiZXhwIjoyMDg4ODYzNzI4fQ.eH64gC4DpGuR_MLgwB9AzM9NiA3JEZnCnxe9C92GcUc"
);

// Titles for each member (skip Han and Marianne - they already have titles)
const titles = {
  "Yudhishthra S Sugumaran": "Builder",
  "Fares Abida": "Bizdev & Growth",
  "Matthew Sim": "Frontend Developer",
  "Sophia Dominique Dizon": "Community Manager",
  "Dominique Dymke": "Product Designer",
  "Wan Muhammad Aqil": "Smart Contract Developer",
  "Abd Azharee Wahid": "Content Creator",
  "Tan Wei Hup": "Full-Stack Developer",
  "twentifo24": "Backend Engineer",
  "Semi": "DevRel",
  "Benjamin Tan": "Blockchain Developer",
  "Chii Yuen": "Growth Lead",
  "Ines Yong": "Community Lead",
  "Nic Fury": "Protocol Engineer",
  "Jack": "Frontend Engineer",
  "Joe Wong": "DeFi Researcher",
  "Wong Jun Shen": "Smart Contract Engineer",
  "Lai Kai Yong": "Full-Stack Developer",
  "Lai Cheong Kian": "Business Development",
  "Sean Hoe": "Product Manager",
  "Marcus Tan": "Rust Developer",
  "Ricnish Raj": "Data Analyst",
  "Ong Ee Shen": "Mobile Developer",
  "Nizar Syahmi": "UI/UX Designer",
  "Kate Lam": "Marketing Strategist",
  "Muhammad Hazlami": "NFT Artist",
  "Muhammad Najmuddin": "Backend Developer",
  "Nazreen": "DevOps Engineer",
  "Marc J": "Content Strategist",
  "Muhammad Haziq": "Blockchain Researcher",
  "DahriChan": "Community Builder",
  "Tran Xuan Duc": "Protocol Developer",
  "Tan Hao Xiang": "Frontend Developer",
  "BreeAnne Yek": "Technical Writer",
  "Yong Chin Bing": "Security Researcher",
};

// Fetch all members
const { data: members, error } = await supabase.from("members").select("*");
if (error) { console.error(error.message); process.exit(1); }

let updated = 0;
for (const member of members) {
  const updates = { is_spotlight: true };

  // Add title if not Han or Marianne and title is empty
  if (titles[member.name] && !member.title) {
    updates.title = titles[member.name];
  }

  const { error: err } = await supabase
    .from("members")
    .update(updates)
    .eq("id", member.id);

  if (err) {
    console.error(`Failed to update ${member.name}:`, err.message);
  } else {
    updated++;
  }
}

console.log(`Updated ${updated} members with titles and featured status.`);
