import { useState } from 'react';
import { BarChart3, CalendarDays, Bus, TrainFront, ShoppingBag, Store, Trees, Waves } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { areas, estimate, formatHour, type Inputs } from '@/lib/crowd';

const icons = { 'Bus Station': Bus, 'Railway Station': TrainFront, 'Shopping Mall': ShoppingBag, Market: Store, 'Public Park': Trees, Beach: Waves };
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const heatHours = [6, 8, 10, 12, 14, 16, 18, 20, 22];

export function ScenarioAnalytics({ inputs, onPredict }: { inputs: Inputs; onPredict: (inputs: Inputs) => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  return <div className="analytics-grid">
    <section className="panel comparison-panel" aria-label="Location comparison">
      <div className="panel-heading"><h2 className="panel-title"><BarChart3 /> Location comparison</h2><span className="sample-tag">DEMO</span></div>
      <p className="panel-subtitle">Same time & conditions · {formatHour(inputs.hour)} · {inputs.day}</p>
      <div className="comparison-list">{areas.map(area => {
        const result = estimate({ ...inputs, area }); const Icon = icons[area];
        return <Button variant="ghost" className={`comparison-row ${area === inputs.area ? 'is-active' : ''}`} key={area} onClick={() => onPredict({ ...inputs, area })} aria-label={`Predict ${area}`}>
          <Icon /><span className="comparison-name">{area}<span className={`mini-level ${result.level.toLowerCase()}`}>{result.level}</span></span>
          <svg viewBox="0 0 100 6" className={`comparison-bar level-${result.level.toLowerCase()}`} aria-hidden="true"><rect width="100" height="6" rx="3" className="bar-track" /><rect width={result.index} height="6" rx="3" className="bar-value" /></svg><strong>{result.index}</strong>
        </Button>;
      })}</div>
    </section>
    <section className="panel heatmap-panel" aria-label="Weekly crowd heatmap">
      <div className="panel-heading"><h2 className="panel-title"><CalendarDays /> Weekly activity map</h2><span className="sample-tag">SIMULATED</span></div>
      <p className="panel-subtitle">{inputs.area} · illustrative day-type patterns</p>
      <div className="heatmap-scroll"><div className="heatmap-grid"><span />{heatHours.map(hour => <span className="heat-hour" key={hour}>{String(hour).padStart(2, '0')}</span>)}
        {days.map((day, i) => <div className="heatmap-row" key={day}><span className="heat-day">{day}</span>{heatHours.map(hour => {
          const scenario: Inputs = { ...inputs, hour, day: i < 5 ? 'Weekday' : 'Weekend' }; const result = estimate(scenario); const key = `${day}-${hour}`;
          return <Button variant="ghost" className={`heat-cell heat-${result.level.toLowerCase()} ${selected === key ? 'heat-selected' : ''}`} key={hour} title={`${day} ${formatHour(hour)}: ${result.index}/100 · ${result.level}`} aria-label={`${day} ${formatHour(hour)}, ${result.index} out of 100, ${result.level}`} onClick={() => { setSelected(key); onPredict(scenario); }}>{result.index}</Button>;
        })}</div>)}
      </div></div>
      <div className="heatmap-foot"><span>Hours · 24-hour clock</span><div className="chart-legend"><span><i />Low</span><span><i />Moderate</span><span><i />High</span></div></div>
      <p className="heatmap-note">Weekdays share one rule; weekends share another. Weather & event settings stay fixed.</p>
    </section>
  </div>;
}