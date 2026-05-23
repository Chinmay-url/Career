import { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

/** Bar chart for job market trend data. */
export default function TrendChart({ labels = [], values = [], label = "Open Positions" }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !labels.length) return;
    if (chartRef.current) chartRef.current.destroy();

    const ctx = canvasRef.current.getContext("2d");
    chartRef.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels,
        datasets: [{
          label,
          data: values,
          backgroundColor: "#534AB7",
          borderRadius: 6,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { callback: (v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v },
          },
        },
      },
    });

    return () => { if (chartRef.current) chartRef.current.destroy(); };
  }, [labels, values, label]);

  return (
    <div style={{ height: 250, position: "relative" }}>
      <canvas ref={canvasRef} />
    </div>
  );
}
