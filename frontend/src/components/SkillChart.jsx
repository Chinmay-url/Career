import { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

/**
 * Renders a Chart.js chart from a backend chart data object.
 * Supports: bar, doughnut, radar
 */
export default function SkillChart({ data, height = 250 }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!data || !canvasRef.current) return;

    // Destroy previous instance
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext("2d");
    chartRef.current = new Chart(ctx, {
      type: data.type || "bar",
      data: {
        labels: data.labels || [],
        datasets: (data.datasets || []).map((ds) => ({
          ...ds,
          data: Array.isArray(ds.data) ? ds.data : String(ds.data).split(" ").map(Number),
          backgroundColor: Array.isArray(ds.backgroundColor)
            ? ds.backgroundColor
            : ds.backgroundColor,
        })),
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: data.type !== "bar" } },
        scales: data.type === "radar" || data.type === "doughnut"
          ? {}
          : { y: { beginAtZero: true } },
      },
    });

    return () => {
      if (chartRef.current) chartRef.current.destroy();
    };
  }, [data]);

  if (!data) return null;

  return (
    <div style={{ height, position: "relative" }}>
      <canvas ref={canvasRef} />
    </div>
  );
}
