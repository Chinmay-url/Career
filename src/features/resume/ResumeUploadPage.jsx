import { FileText, UploadCloud } from "lucide-react";
import Panel from "../../components/ui/Panel";

export default function ResumeUploadPage() {
  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <Panel title="Upload Resume">
        <label className="focus-within:outline-accent flex min-h-80 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-line bg-panel px-6 text-center">
          <UploadCloud className="text-accent" size={44} />
          <span className="mt-4 text-lg font-semibold text-white">Drop resume or browse files</span>
          <span className="mt-2 max-w-md text-sm text-slate-400">Supports PDF, DOCX, and TXT. The backend endpoint should return parsed skills, experience signals, and education entities.</span>
          <input className="sr-only" type="file" accept=".pdf,.doc,.docx,.txt" />
        </label>
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
