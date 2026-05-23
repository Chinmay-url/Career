import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, ShieldCheck, UploadCloud } from "lucide-react";
import Panel from "../../components/ui/Panel";
import { resumeApi } from "../../lib/api";
import { saveAnalysisResult } from "../../lib/analysisStorage";

const MIN_RESUME_SIZE_KB = 50;
const MAX_RESUME_SIZE_MB = 10;
const BYTES_PER_KB = 1024;
const BYTES_PER_MB = 1024 * 1024;

function formatFileSize(bytes) {
  return `${(bytes / BYTES_PER_MB).toFixed(2)} MB`;
}

export default function ResumeUploadPage() {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileError, setFileError] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  function handleResumeChange(event) {
    const file = event.target.files?.[0];
    setSelectedFile(null);
    setFileError("");

    if (!file) {
      return;
    }

    const fileSizeMb = file.size / BYTES_PER_MB;
    const fileSizeKb = file.size / BYTES_PER_KB;

    if (fileSizeKb < MIN_RESUME_SIZE_KB || fileSizeMb > MAX_RESUME_SIZE_MB) {
      setFileError(`Resume must be between ${MIN_RESUME_SIZE_KB} KB and ${MAX_RESUME_SIZE_MB} MB. Selected file is ${formatFileSize(file.size)}.`);
      event.target.value = "";
      return;
    }

    setSelectedFile(file);
  }

  async function handleUpload() {
    if (!selectedFile) {
      setFileError(`Choose a valid PDF resume between ${MIN_RESUME_SIZE_KB} KB and ${MAX_RESUME_SIZE_MB} MB first.`);
      return;
    }

    setFileError("");
    setIsUploading(true);

    try {
      const { data } = await resumeApi.upload(selectedFile);
      saveAnalysisResult(data);
      navigate("/skills");
    } catch (error) {
      setFileError(error?.response?.data?.detail ?? "Resume parsing failed. Please try another PDF.");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <Panel title="Upload Resume">
        <label className="focus-within:outline-accent flex min-h-80 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-accent/40 bg-accent/5 px-6 text-center transition hover:border-accent hover:bg-accent/10">
          <span className="grid h-16 w-16 place-items-center rounded-lg border border-accent/30 bg-accent/10">
            <UploadCloud className="text-accent" size={34} />
          </span>
          <span className="mt-4 text-lg font-semibold text-white">Drop resume or browse files</span>
          <span className="mt-2 max-w-md text-sm text-slate-400">Supports PDF files. File size must be between 50 KB and 10 MB.</span>
          <input className="sr-only" type="file" accept=".pdf" onChange={handleResumeChange} />
        </label>
        {fileError && (
          <p className="mt-4 rounded-lg border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-red-200">
            {fileError}
          </p>
        )}
        {selectedFile && (
          <>
            <div className="mt-4 flex items-center gap-3 rounded-lg border border-accent/40 bg-accent/10 px-4 py-3 text-sm text-teal-100">
              <ShieldCheck size={18} />
              <span>Selected {selectedFile.name} ({formatFileSize(selectedFile.size)})</span>
            </div>
            <button
              className="focus-ring mt-4 w-full rounded-lg bg-accent px-4 py-3 text-sm font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
              onClick={handleUpload}
              disabled={isUploading}
            >
              {isUploading ? "Uploading and parsing..." : "Analyze Resume"}
            </button>
          </>
        )}
      </Panel>

      <Panel title="Parsing Pipeline">
        {["Extract text", "Detect skills", "Rank proficiency", "Generate career graph"].map((item, index) => (
          <div key={item} className="flex gap-4 border-b border-white/10 py-4 last:border-0">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/10 text-sm font-semibold text-accent">{index + 1}</span>
            <div>
              <h3 className="font-semibold text-white">{item}</h3>
              <p className="text-sm text-slate-400">Mapped to resume parsing and recommendation requirements.</p>
            </div>
          </div>
        ))}
        <div className="mt-5 flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
          <FileText size={18} className="text-accent" />
          API contract: `POST /api/resume/upload`
        </div>
      </Panel>
    </div>
  );
}
