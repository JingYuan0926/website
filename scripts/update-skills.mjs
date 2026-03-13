import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://uulzrfppmwwoyxiumkjc.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1bHpyZnBwbXd3b3l4aXVta2pjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzI4NzcyOCwiZXhwIjoyMDg4ODYzNzI4fQ.eH64gC4DpGuR_MLgwB9AzM9NiA3JEZnCnxe9C92GcUc"
);

const SKILLS = ["Rust", "Frontend", "Backend", "Design", "Content", "Growth", "Product", "Community"];

function pickRandom(arr, count) {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

const { data: members, error } = await supabase.from("members").select("*");
if (error) { console.error(error.message); process.exit(1); }

const skip = ["Han", "Marianne"];

let updated = 0;
for (const m of members) {
  if (skip.includes(m.name)) continue;

  // Random 1-4 skills
  const count = Math.floor(Math.random() * 4) + 1;
  const skills = pickRandom(SKILLS, count);

  const { error: err } = await supabase
    .from("members")
    .update({ skills })
    .eq("id", m.id);

  if (err) {
    console.error(`Failed ${m.name}:`, err.message);
  } else {
    console.log(`${m.name}: ${skills.join(", ")}`);
    updated++;
  }
}

console.log(`\nUpdated ${updated} members with random skills.`);
