import { createFileRoute, Link } from '@tanstack/react-router';
import { useState } from 'react';
import { ArrowRight, Bus, CalendarDays, Clock3, Cloud, CloudRain, History, Info, MapPin, PartyPopper, ShieldCheck, SlidersHorizontal, Sparkles, Sun, Users, Waves, TrainFront, ShoppingBag, Store, Trees, FlaskConical, RotateCcw } from 'lucide-react';
import cityArt from '@/assets/crowd-city.jpg';
import { CrowdSenseShell } from '@/components/crowdsense-shell';
import { HourlyChart } from '@/components/hourly-chart';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { areas, estimate, formatHour, initialInputs, type Inputs, type Prediction } from '@/lib/crowd';

export const Route = createFileRoute('/')({
  head: () => ({ meta: [
    { title: 'CrowdSense — Crowd Prediction in Public Areas' },
    { name: 'description', content: 'Explore crowd patterns in public areas with an interactive, transparent data science demonstration.' },
    { property: 'og:title', content: 'CrowdSense — A clearer picture of public spaces' },
    { property: 'og:description', content: 'Plan a quieter visit with illustrative crowd estimates, hourly outlooks, and an explainable method.' },
    { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' },
  ] }),
  component: Index,
});
const areaIcons = { 'Bus Station': Bus, 'Railway Station': TrainFront, 'Shopping Mall': ShoppingBag, Market: Store, 'Public Park': Trees, Beach: Waves };

function Index() {
  const [inputs, setInputs] = useState<Inputs>(initialInputs);
  const [prediction, setPrediction] = useState<Prediction>({ id: 0, inputs: initialInputs, result: estimate(initialInputs) });
  const [history, setHistory] = useState<Prediction[]>([]);
  const [count, setCount] = useState(0);
  const update = <K extends keyof Inputs>(key: K, value: Inputs[K]) => setInputs(previous => ({ ...previous, [key]: value }));
  const predict = () => {
    const next = { id: count + 1, inputs: { ...inputs }, result: estimate(inputs) };
    setPrediction(next); setHistory(previous => [next, ...previous].slice(0, 4)); setCount(previous => previous + 1);
  };
  const { result, inputs: committed } = prediction;
  const changed = JSON.stringify(inputs) !== JSON.stringify(committed);
  return <CrowdSenseShell><main className="main-content">
    <section className="intro">
      <div className="intro-copy"><div className="eyebrow"><span className="eyebrow-dot" /> PEOPLE. PLACES. PATTERNS.</div><h1>Crowd Prediction<br /><span className="heading-highlight">in Public Areas.</span></h1><p className="intro-description">A little foresight. A better visit.<br />Explore crowd patterns and find the right time to head out.</p><div className="demo-label"><Info size={12} /> Demo estimates — not live sensor data</div></div>
      <img src={cityArt} width={1536} height={1024} className="city-art" alt="An illustrated public space with a railway station, shopping mall, park and bus station" />
    </section>
    <section className="overview-stats" aria-label="Project overview"><div className="stat"><span className="stat-icon"><MapPin size={21} /></span><div><strong>6 public areas</strong><p>From daily commutes to weekend escapes</p></div></div><div className="stat"><span className="stat-icon"><Clock3 size={21} /></span><div><strong>24-hour outlook</strong><p>See how crowd patterns change over a day</p></div></div><div className="stat"><span className="stat-icon"><FlaskConical size={21} /></span><div><strong>Explainable estimates</strong><p>Simple inputs. Transparent reasoning.</p></div></div></section>
    <div className="dashboard-grid">
      <section className="panel"><div className="panel-heading"><h2 className="panel-title"><SlidersHorizontal /> Plan your visit</h2></div><p className="panel-subtitle">Choose a place and a few details. Let’s look ahead.</p>
        <form className="form-body" onSubmit={event => { event.preventDefault(); predict(); }}>
          <label className="field-label" htmlFor="area"><MapPin /> Public area</label><select id="area" className="select-input" value={inputs.area} onChange={event => { const area = areas.find(item => item === event.target.value); if (area) update('area', area); }}>{areas.map(area => <option key={area}>{area}</option>)}</select>
          <div className="form-row"><div><label className="field-label" htmlFor="hour"><Clock3 /> Time of visit</label><select id="hour" className="select-input" value={inputs.hour} onChange={event => update('hour', Number(event.target.value))}>{Array.from({ length: 24 }, (_, hour) => <option key={hour} value={hour}>{formatHour(hour)}</option>)}</select></div><div><span className="field-label" id="day-label"><CalendarDays /> Day type</span><div className="segment-control" role="group" aria-labelledby="day-label">{(['Weekday', 'Weekend'] as const).map(day => <Button type="button" variant="ghost" key={day} className={`segment ${inputs.day === day ? 'selected' : ''}`} aria-pressed={inputs.day === day} onClick={() => update('day', day)}>{day}</Button>)}</div></div></div>
          <div className="weather-field"><span className="field-label" id="weather-label"><Cloud /> Weather conditions</span><div className="weather-control" role="group" aria-labelledby="weather-label">{([{ name: 'Sunny', icon: Sun }, { name: 'Cloudy', icon: Cloud }, { name: 'Rainy', icon: CloudRain }] as const).map(({ name, icon: Icon }) => <Button type="button" variant="ghost" className={`weather ${inputs.weather === name ? 'selected' : ''}`} aria-pressed={inputs.weather === name} key={name} onClick={() => update('weather', name)}><Icon size={15} />{name}</Button>)}</div></div>
          <div className="event-row"><div><label htmlFor="special-event" className="field-label"><PartyPopper /> Special event nearby</label><p>Festivals, concerts, or local gatherings</p></div><Switch id="special-event" checked={inputs.event} onCheckedChange={value => update('event', value)} /></div>
          <Button variant="predict" type="submit"><Sparkles size={16} /> Predict Crowd <ArrowRight size={16} /></Button><div className="form-footnote"><ShieldCheck size={11} /> No personal data. Just an illustrative estimate.</div>
        </form>
      </section>
      <section className={`panel level-${result.level.toLowerCase()}`} aria-label="Crowd prediction result"><div className="panel-heading"><h2 className="panel-title"><Users /> Your crowd estimate</h2><span className="result-tag">{prediction.id === 0 ? 'EXAMPLE ESTIMATE' : `ESTIMATE #${prediction.id}`}</span></div><p className="panel-subtitle">{changed ? 'Inputs changed — select Predict Crowd to update.' : 'A snapshot of what your visit could look like.'}</p>
        <div className="result-main" aria-live="polite"><div className="gauge"><svg viewBox="0 0 160 160" aria-hidden="true"><circle cx="80" cy="80" r="63" className="gauge-track" strokeDasharray="297 396" /><circle cx="80" cy="80" r="63" className="gauge-progress" strokeDasharray={`${result.index * 2.97} 396`} /></svg><div className="gauge-label"><strong>{result.index}<span className="sr-only"> out of 100</span></strong><span>CROWD INDEX / 100</span></div></div><div className="result-details"><span className="level-badge"><span className="dot" /> {result.level} crowd</span><h3>{committed.area}</h3><p>{formatHour(committed.hour)} · {committed.day}<br />{committed.weather} weather · {committed.event ? 'Special event' : 'No special event'}</p></div></div>
        <div className="advisory"><ShieldCheck /><div><strong>A little planning goes a long way</strong><p>{result.advisory}</p></div></div>
        <div className="scale"><div className="scale-bars"><span /><span /><span /></div><div className="scale-labels"><span>Low · 0–34</span><span>Moderate · 35–64</span><span>High · 65–100</span></div></div><div className="result-footer"><Info size={12} /> Relative activity index, not a headcount or safety assessment.</div>
      </section>
    </div>
    <div className="lower-grid"><HourlyChart inputs={committed} /><section className="panel"><div className="panel-heading"><h2 className="panel-title"><History /> Recent predictions</h2>{history.length > 0 && <Button variant="ghost" size="icon" title="Clear recent predictions" aria-label="Clear recent predictions" onClick={() => setHistory([])}><RotateCcw size={14} /></Button>}</div><p className="panel-subtitle">Your latest explorations, all in one place.</p>{history.length === 0 ? <div className="empty-history"><History size={25} /> Your next exploration starts here.<br />No predictions in this session yet.</div> : <div className="history-list">{history.map(item => { const Icon = areaIcons[item.inputs.area]; return <div className="history-item" key={item.id}><span className="history-icon"><Icon size={15} /></span><div className="min-w-0"><strong>{item.inputs.area}</strong><p>{formatHour(item.inputs.hour)} · {item.inputs.day} · {item.result.index}/100</p></div><span className={`history-level ${item.result.level.toLowerCase()}`}>{item.result.level}</span></div>; })}</div>}<div className="history-note">Session only · resets when you refresh</div></section></div>
    <section className="method-strip"><FlaskConical size={24} /><div><h2>A small project. A thoughtful purpose.</h2><p>CrowdSense combines area, time, day, weather, and events using an illustrative heuristic.<br />An exploration of how data science can support more comfortable, better-planned trips — not a trained ML model.</p></div><Link to="/about">Explore the method <ArrowRight size={13} /></Link></section>
  </main></CrowdSenseShell>;
}
