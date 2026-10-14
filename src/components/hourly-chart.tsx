import { useState } from 'react';
import { Lightbulb, TrendingUp } from 'lucide-react';
import { estimate, formatHour, type Inputs } from '@/lib/crowd';

export function HourlyChart({ inputs }: { inputs: Inputs }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const hours = Array.from({ length: 24 }, (_, hour) => ({ hour, index: estimate({ ...inputs, hour }).index }));
  const x = (hour: number) => 40 + hour * 23;
  const y = (index: number) => 158 - index * 1.3;
  const points = hours.map(({ hour, index }) => `${x(hour)},${y(index)}`).join(' ');
  const selected = hours[inputs.hour];
  const active = hovered === null ? undefined : hours[hovered];
  const quietest = hours.filter(({ hour }) => hour >= 6 && hour <= 21).reduce((a, b) => a.index <= b.index ? a : b);
  return <section className="panel" aria-label="Hourly crowd outlook">
    <div className="panel-heading"><h2 className="panel-title"><TrendingUp /> Hourly crowd outlook</h2><div className="chart-legend"><span><i />Low</span><span><i />Moderate</span><span><i />High</span></div></div>
    <p className="panel-subtitle">{inputs.area} · {inputs.day.toLowerCase()} · same weather & event conditions</p>
    <div className="chart-wrap">
      <svg viewBox="0 0 605 192" className="hour-chart" role="img" aria-label={`Estimated hourly crowd index for ${inputs.area}. Selected hour ${formatHour(inputs.hour)}: ${selected?.index} out of 100.`} onMouseLeave={() => setHovered(null)}>
        <defs><linearGradient id="chart-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" className="chart-fill-start" /><stop offset="100%" className="chart-fill-end" /></linearGradient></defs>
        {[0, 25, 50, 75, 100].map(value => <g key={value}><line x1="40" x2="569" y1={y(value)} y2={y(value)} className="chart-grid" /><text x="29" y={y(value) + 3} textAnchor="end" className="chart-axis">{value}</text></g>)}
        <polygon points={`40,158 ${points} 569,158`} className="chart-area" /><polyline points={points} className="chart-line" />
        {selected && <><line x1={x(inputs.hour)} x2={x(inputs.hour)} y1="22" y2="158" className="chart-selected" /><circle cx={x(inputs.hour)} cy={y(selected.index)} r="5" className="chart-dot" /></>}
        {[0, 4, 8, 12, 16, 20, 23].map(hour => <text x={x(hour)} y="181" textAnchor="middle" className="chart-axis" key={hour}>{hour === 0 ? '12 AM' : hour === 12 ? '12 PM' : `${hour % 12} ${hour < 12 ? 'AM' : 'PM'}`}</text>)}
        {hours.map(({ hour, index }) => <rect key={hour} x={x(hour) - 11} y="18" width="23" height="144" className="chart-hit" onMouseEnter={() => setHovered(hour)} onTouchStart={() => setHovered(hour)}><title>{`${formatHour(hour)}: ${index}/100 · ${estimate({ ...inputs, hour }).level}`}</title></rect>)}
        {active && <g pointerEvents="none"><rect x={Math.min(470, Math.max(40, x(active.hour) - 52))} y="0" width="105" height="23" rx="4" className="chart-tooltip" /><text x={Math.min(470, Math.max(40, x(active.hour) - 52)) + 52.5} y="15" textAnchor="middle" className="chart-tooltip-text">{formatHour(active.hour)} · {active.index}</text></g>}
      </svg>
    </div>
    <div className="chart-footer"><Lightbulb size={13} /> Quieter daytime option: {formatHour(quietest.hour)} · estimated index {quietest.index}/100</div>
  </section>;
}