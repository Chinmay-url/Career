/** Resume upload and parsing API calls. */
import api from "./api";

/**
 * Upload a PDF resume file.
 * @param {File} file
 * @returns {Promise<{id, parsed_profile, recommendations}>}
 */
export async function uploadResume(file) {
  const form = new FormData();
  form.append("file", file);
  const res = await api.post("/api/resume/upload", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}
