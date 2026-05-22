/** Job market trends API calls. */
import api from "./api";

/**
 * Get live job market data for a role via Adzuna.
 * @param {string} role
 */
export async function getJobTrends(role) {
  const res = await api.get(`/api/trends/${encodeURIComponent(role)}`);
  return res.data;
}
