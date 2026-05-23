import { useRef, useState } from "react";

/**
 * Drag-and-drop PDF upload box.
 * Props:
 *   onFile(file) — called when a valid PDF is selected
 *   loading — bool, shows spinner when true
 */
export default function UploadBox({ onFile, loading = false }) {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file?.name.endsWith(".pdf")) onFile(file);
    else alert("Please drop a PDF file.");
  }

  function handleChange(e) {
    const file = e.target.files[0];
    if (file) onFile(file);
  }

  return (
    <div
      onClick={() => !loading && inputRef.current.click()}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      style={{
        border: `2px dashed ${dragOver ? "#534AB7" : "#ccc"}`,
        borderRadius: 12,
        padding: "3rem",
        textAlign: "center",
        cursor: loading ? "default" : "pointer",
        background: dragOver ? "#EEEDFE" : "#fafafa",
        transition: "all 0.2s",
      }}
    >
      {loading ? (
        <>
          <div style={spinner} />
          <p style={{ color: "#888", marginTop: 12 }}>Parsing resume with Groq LLM…</p>
        </>
      ) : (
        <>
          <div style={{ fontSize: "3rem" }}>📄</div>
          <p style={{ marginTop: 8, fontWeight: 500 }}>Drop your PDF resume here or click to upload</p>
          <p style={{ fontSize: 12, color: "#888", marginTop: 6 }}>
            Parsed by Groq LLM · Matched against 879 O*NET IT careers
          </p>
        </>
      )}
      <input
        ref={inputRef}
        type="file"
        accept=".pdf"
        style={{ display: "none" }}
        onChange={handleChange}
      />
    </div>
  );
}

const spinner = {
  width: 40, height: 40,
  border: "4px solid #eee",
  borderTopColor: "#534AB7",
  borderRadius: "50%",
  animation: "spin 0.8s linear infinite",
  margin: "0 auto",
};
