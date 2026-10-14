import { useId } from 'react';
import { Lightbulb, TrendingUp } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { estimate, formatHour, type Inputs } from '@/lib/crowd';

export function HourlyChart({ inputs }: { inputs: Inputs }) {
  const gradient = useId().replace(/:/g, '');
  const hours = Array.from({ length: 24 }, (_, hour) => ({ hour, index: estimate({ ...inputs, hour }).index }));
  const quietest = hours.filter(({ hour }) => hour >= 6 && hour <= 21).reduce((a, b) => a.index <= b.index ? a : b);
  return <section className="panel" aria-label="Hourly crowd outlook">
    <div className="panel-heading"><h2 className="panel-title"><TrendingUp /> Hourly crowd forecast</h2><span className="sample-tag">DEMO · 24 HOURS</span></div>
    <p className="panel-subtitle">{inputs.area} · {inputs.day.toLowerCase()} · same weather & event conditions</p>
    <div className="chart-wrap" role="img" aria-label={`Simulated hourly index for ${inputs.area}. Selected hour ${formatHour(inputs.hour)}: ${estimate(inputs).index} out of 100.`}>
      <ResponsiveContainer width="100%" height="100%"><AreaChart data={hours} margin={{ top: 15, right: 12, left: -22, bottom: 0 }}>
        <defs><linearGradient id={gradient} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" className="chart-fill-start" /><stop offset="100%" className="chart-fill-end" /></linearGradient></defs>
        <CartesianGrid vertical={false} className="rechart-grid" strokeDasharray="3 5" />
        <XAxis dataKey="hour" type="number" domain={[0, 23]} ticks={[0, 4, 8, 12, 16, 20, 23]} tickFormatter={hour => String(hour).padStart(2, '0') + ':00'} tickLine={false} axisLine={false} className="rechart-axis" />
        <YAxis domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} tickLine={false} axisLine={false} className="rechart-axis" />
        <Tooltip content={({ active, payload }) => { const point = payload?.[0]?.payload as { hour: number; index: number } | undefined; return active && point ? <div className="forecast-tooltip"><strong>{formatHour(point.hour)}</strong><span>{point.index}/100 · {estimate({ ...inputs, hour: point.hour }).level}</span></div> : null; }} />
        <ReferenceLine x={inputs.hour} className="rechart-reference" strokeDasharray="4 4" />
        <Area dataKey="index" type="monotone" stroke="var(--primary)" fill={`url(#${gradient})`} strokeWidth={2.5} isAnimationActive={false} activeDot={{ r: 5 }} />
      </AreaChart></ResponsiveContainer>
    </div>
    <div className="chart-footer"><Lightbulb size={14} /> Quieter daytime option: {formatHour(quietest.hour)} · {quietest.index}/100 <span className="chart-foot-end">Hourly estimates · smoothed display</span></div>
  </section>;
}