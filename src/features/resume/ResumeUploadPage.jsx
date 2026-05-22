import { useState } from "react";
import { FileText, UploadCloud } from "lucide-react";
import Panel from "../../components/ui/Panel";

const MIN_RESUME_SIZE_MB = 5;
const MAX_RESUME_SIZE_MB = 10;
const BYTES_PER_MB = 1024 * 1024;

function formatFileSize(bytes) {
  return `${(bytes / BYTES_PER_MB).toFixed(2)} MB`;
}

export default function ResumeUploadPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileError, setFileError] = useState("");

  function handleResumeChange(event) {
    const file = event.target.files?.[0];
    setSelectedFile(null);
    setFileError("");

    if (!file) {
      return;
    }

    const fileSizeMb = file.size / BYTES_PER_MB;

    if (fileSizeMb < MIN_RESUME_SIZE_MB || fileSizeMb > MAX_RESUME_SIZE_MB) {
      setFileError(`Resume must be between ${MIN_RESUME_SIZE_MB} MB and ${MAX_RESUME_SIZE_MB} MB. Selected file is ${formatFileSize(file.size)}.`);
      event.target.value = "";
      return;
    }

    setSelectedFile(file);
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <Panel title="Upload Resume">
        <label className="focus-within:outline-accent flex min-h-80 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-line bg-panel px-6 text-center">
          <UploadCloud className="text-accent" size={44} />
          <span className="mt-4 text-lg font-semibold text-white">Drop resume or browse files</span>
          <span className="mt-2 max-w-md text-sm text-slate-400">Supports PDF, DOCX, and TXT. File size must be between 5 MB and 10 MB.</span>
          <input className="sr-only" type="file" accept=".pdf,.doc,.docx,.txt" onChange={handleResumeChange} />
        </label>
        {fileError && (
          <p className="mt-4 rounded-lg border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-red-200">
            {fileError}
          </p>
        )}
        {selectedFile && (
          <div className="mt-4 rounded-lg border border-accent/40 bg-accent/10 px-4 py-3 text-sm text-teal-100">
            Selected {selectedFile.name} ({formatFileSize(selectedFile.size)})
          </div>
        )}
      </Panel>

      <Panel title="Parsing Pipeline">
        {["Extract text", "Detect skills", "Rank proficiency", "Generate career graph"].map((item, index) => (
          <div key={item} className="flex gap-4 border-b border-line py-4 last:border-0">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-accent/10 text-sm font-semibold text-accent">{index + 1}</span>
            <div>
              <h3 className="font-semibold text-white">{item}</h3>
              <p className="text-sm text-slate-400">Mapped to resume parsing and recommendation requirements.</p>
            </div>
          </div>
        ))}
        <div className="mt-5 flex items-center gap-3 rounded-lg border border-line bg-panel p-4 text-sm text-slate-300">
          <FileText size={18} className="text-accent" />
          API contract: `POST /api/resume/upload`
        </div>
      </Panel>
    </div>
  );
}
