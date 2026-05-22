/** Career recommendation and skill gap API calls. */
import api from "./api";

/**
 * Get career recommendations from skills/interests.
 * @param {string[]} skills
 * @param {string[]} interests
 * @param {number} topN
 */
export async function getRecommendations(skills, interests = [], topN = 5) {
  const res = await api.post("/api/recommendations/", {
    skills,
    interests,
    top_n: topN,
  });
  return res.data.recommendations;
}

/**
 * Get full dashboard data (recommendations + skill gap + charts).
 */
export async function getDashboard(skills, interests = [], targetRole = "") {
  const res = await api.post("/api/dashboard/", {
    skills,
    interests,
    target_role: targetRole,
  });
  return res.data;
}

/**
 * Analyze skill gap for a target role.
 */
export async function getSkillGap(skills, targetRole) {
  const res = await api.post("/api/profile/skill-gap", {
    skills,
    target_role: targetRole,
  });
  return res.data;
}

/**
 * Get learning resources for skill gaps.
 */
export async function getLearningPath(skillGaps, targetRole) {
  const res = await api.post("/api/profile/learning-path", {
    skill_gaps: skillGaps,
    target_role: targetRole,
  });
  return res.data;
}

/**
 * Get AI career advice from Groq LLM.
 */
export async function getCareerAdvice(targetRole, currentSkills, skillGap) {
  const res = await api.post("/api/career-advice", {
    target_role: targetRole,
    current_skills: currentSkills,
    skill_gap: skillGap,
  });
  return res.data.advice;
}
