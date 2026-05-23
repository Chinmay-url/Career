export const metrics = [
  { label: "Career Matches", value: "14", change: "+4 this week", tone: "accent" },
  { label: "Parsed Skills", value: "28", change: "8 advanced", tone: "sky" },
  { label: "Skill Gaps", value: "6", change: "2 high priority", tone: "warning" },
  { label: "Roadmap Progress", value: "42%", change: "3 modules done", tone: "violet" },
];

export const skillRadar = [
  { skill: "React", current: 88, target: 86 },
  { skill: "Python", current: 74, target: 82 },
  { skill: "ML", current: 48, target: 76 },
  { skill: "SQL", current: 70, target: 78 },
  { skill: "Cloud", current: 40, target: 72 },
  { skill: "DSA", current: 62, target: 75 },
];

export const marketTrendData = [
  { month: "Jan", ai: 62, data: 54, frontend: 46 },
  { month: "Feb", ai: 66, data: 58, frontend: 49 },
  { month: "Mar", ai: 71, data: 61, frontend: 52 },
  { month: "Apr", ai: 78, data: 65, frontend: 50 },
  { month: "May", ai: 86, data: 72, frontend: 56 },
  { month: "Jun", ai: 91, data: 76, frontend: 59 },
];

export const recommendations = [
  {
    title: "AI Product Engineer",
    match: 94,
    salary: "$118k - $162k",
    demand: "Very high",
    skills: ["React", "Python", "LLM APIs", "Product Analytics"],
  },
  {
    title: "Data Scientist",
    match: 87,
    salary: "$104k - $148k",
    demand: "High",
    skills: ["Python", "SQL", "ML", "Statistics"],
  },
  {
    title: "Frontend Platform Engineer",
    match: 82,
    salary: "$112k - $154k",
    demand: "High",
    skills: ["React", "Design Systems", "Testing", "Performance"],
  },
];

export const parsedSkills = [
  { name: "React", level: "Advanced", confidence: 96 },
  { name: "JavaScript", level: "Advanced", confidence: 94 },
  { name: "Python", level: "Intermediate", confidence: 82 },
  { name: "SQL", level: "Intermediate", confidence: 78 },
  { name: "Machine Learning", level: "Foundational", confidence: 63 },
  { name: "Cloud Deployment", level: "Foundational", confidence: 57 },
];

export const skillGaps = [
  { skill: "MLOps", current: 32, target: 75, priority: "High" },
  { skill: "Vector Databases", current: 28, target: 70, priority: "High" },
  { skill: "System Design", current: 52, target: 82, priority: "Medium" },
  { skill: "A/B Testing", current: 45, target: 68, priority: "Medium" },
];

export const roadmap = [
  { step: "Resume Parsing", title: "Polish AI profile extraction", status: "Done" },
  { step: "Skill Gap", title: "Complete MLOps fundamentals", status: "In Progress" },
  { step: "Portfolio", title: "Ship one LLM-powered case study", status: "Next" },
  { step: "Interview", title: "Practice product engineering system design", status: "Planned" },
];
