const ANALYSIS_KEY = "career_resume_analysis";

export function saveAnalysisResult(result) {
  localStorage.setItem(ANALYSIS_KEY, JSON.stringify(result));
}

export function getAnalysisResult() {
  const value = localStorage.getItem(ANALYSIS_KEY);
  return value ? JSON.parse(value) : null;
}

export function clearAnalysisResult() {
  localStorage.removeItem(ANALYSIS_KEY);
}

export function getParsedSkillsFromAnalysis() {
  const analysis = getAnalysisResult();
  const skills = analysis?.parsed_profile?.skills ?? [];

  return skills.map((skill, index) => ({
    name: skill,
    level: index < 3 ? "Strong" : "Detected",
    confidence: Math.max(68, 96 - index * 4),
  }));
}

export function getRecommendationsFromAnalysis() {
  const analysis = getAnalysisResult();
  const recommendations = analysis?.recommendations ?? [];

  return recommendations.map((role) => ({
    title: role.title,
    match: role.match_score ?? role.match ?? 0,
    salary: role.salary_range ?? "Salary data pending",
    demand: role.market_demand ? `${role.market_demand} openings` : "Demand data pending",
    skills: role.required_skills ?? role.matched_skills ?? [],
    skillGap: role.skill_gap ?? [],
    matchedSkills: role.matched_skills ?? [],
    description: role.description ?? "",
  }));
}

export function getPrimaryRecommendation() {
  return getRecommendationsFromAnalysis()[0] ?? null;
}
