import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Panel from "../../components/ui/Panel";
import { marketTrendData } from "../../lib/mockData";

export default function MarketTrendsPage() {
  return (
    <Panel title="Market Trend Analysis">
      <div className="h-[28rem]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={marketTrendData}>
            <defs>
              <linearGradient id="aiDemand" x1="0" x2="0" y1="0" y2="1">
                <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.45} />
                <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0.04} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#283245" strokeDasharray="3 3" />
            <XAxis dataKey="month" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip contentStyle={{ background: "#111827", border: "1px solid #283245" }} />
            <Area type="monotone" dataKey="ai" stroke="#2dd4bf" fill="url(#aiDemand)" strokeWidth={3} />
            <Area type="monotone" dataKey="data" stroke="#38bdf8" fill="#38bdf820" strokeWidth={3} />
            <Area type="monotone" dataKey="frontend" stroke="#a78bfa" fill="#a78bfa18" strokeWidth={3} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Panel>
  );
}
