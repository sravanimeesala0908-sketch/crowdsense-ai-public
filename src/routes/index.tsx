import { createFileRoute, Link } from '@tanstack/react-router';
import { useState } from 'react';
import { ArrowRight, ArrowUpRight, Activity, Bus, CalendarDays, Clock3, Cloud, CloudRain, History, Info, MapPin, PartyPopper, ShieldCheck, SlidersHorizontal, Sparkles, Sun, Users, Waves, TrainFront, ShoppingBag, Store, Trees, FlaskConical, RotateCcw, Zap, Layers, BrainCircuit, ChevronRight } from 'lucide-react';
import cityArt from '@/assets/smart-city.jpg';
import { CrowdSenseShell } from '@/components/crowdsense-shell';
import { HourlyChart } from '@/components/hourly-chart';
import { ScenarioAnalytics } from '@/components/scenario-analytics';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { areas, estimate, formatHour, initialInputs, type Inputs, type Prediction } from '@/lib/crowd';

export const Route = createFileRoute('/')({
  head: () => ({ meta: [
    { title: 'CrowdSense AI — Smart-City Crowd Analytics Demo' },
    { name: 'description', content: 'Explore simulated crowd density with explainable predictions, hourly forecasts, location comparisons and weekly activity maps. A transparent college data science project.' },
    { property: 'og:title', content: 'CrowdSense AI — Anticipate the crowd' },
    { property: 'og:description', content: 'An interactive smart-city analytics demonstration. Simulated estimates, transparent rules, no live sensor or trained-model claims.' },
    { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' },
  ] }), component: Index,
});
const areaIcons = { 'Bus Station': Bus, 'Railway Station': TrainFront, 'Shopping Mall': ShoppingBag, Market: Store, 'Public Park': Trees, Beach: Waves };
const factorLabels = { base: 'Area baseline', time: 'Time of day', day: 'Day type', weather: 'Weather', event: 'Nearby event' };

function Index() {
  const [inputs, setInputs] = useState<Inputs>(initialInputs);
  const [prediction, setPrediction] = useState<Prediction>({ id: 0, inputs: initialInputs, result: estimate(initialInputs) });
  const [history, setHistory] = useState<Prediction[]>([]);
  const [count, setCount] = useState(0);
  const update = <K extends keyof Inputs>(key: K, value: Inputs[K]) => setInputs(previous => ({ ...previous, [key]: value }));
  const predict = (scenario: Inputs = inputs) => {
    const next = { id: count + 1, inputs: { ...scenario }, result: estimate(scenario) };
    setInputs({ ...scenario }); setPrediction(next); setHistory(previous => [next, ...previous].slice(0, 4)); setCount(previous => previous + 1);
  };
  const { result, inputs: committed } = prediction;
  const changed = JSON.stringify(inputs) !== JSON.stringify(committed);
  const busiest = areas.map(area => ({ area, ...estimate({ ...committed, area }) })).reduce((a, b) => a.index >= b.index ? a : b);
  const hourly = Array.from({ length: 24 }, (_, hour) => ({ hour, ...estimate({ ...committed, hour }) }));
  const peak = hourly.reduce((a, b) => a.index >= b.index ? a : b);
  return <CrowdSenseShell><main className="main-content">
    <section className="intro">
      <img src={cityArt} width={1536} height={1024} className="city-art" alt="Illustrative smart city with an illuminated railway station, urban park and transit routes at night" />
      <div className="hero-grid" aria-hidden="true" />
      <div className="intro-copy"><div className="eyebrow"><span className="eyebrow-dot" /> SMART CITY. SMARTER PLANNING.</div><h1>CrowdSense <span className="heading-highlight">AI</span></h1><p className="hero-subtitle">Anticipate the crowd.<br />Reimagine your next move.</p><p className="intro-description">Exploring crowd density in public spaces through<br className="desktop-break" /> explainable, simulated intelligence.</p><div className="hero-actions"><Button asChild variant="predict" className="hero-cta"><a href="#prediction"><Sparkles /> Explore predictions <ArrowUpRight /></a></Button><Link to="/about" className="hero-method">Behind the estimate <ArrowRight size={15} /></Link></div><div className="demo-label"><FlaskConical size={13} /> Demo estimates — not live sensor data</div></div>
      <div className="hero-caption"><span className="eyebrow-dot" /> CONCEPT CITY VISUALIZATION <span>01 / URBAN INTELLIGENCE</span></div>
    </section>
    <div className="section-kicker"><span><Activity size={14} /> SCENARIO OVERVIEW</span><span>SIMULATED DATA · NOT LIVE</span></div>
    <section className="overview-stats" aria-label="Demo scenario KPIs">
      <div className="stat"><div className="stat-top"><span>Current crowd index</span><Activity /></div><strong>{result.index}<small>/ 100</small></strong><div className="stat-bottom"><span className={`mini-level ${result.level.toLowerCase()}`}>{result.level} crowd</span><span>Demo estimate</span></div></div>
      <div className="stat"><div className="stat-top"><span>Busiest location</span><Users /></div><strong className="stat-location">{busiest.area}</strong><div className="stat-bottom"><span>{busiest.index}/100 index</span><span>Demo comparison</span></div></div>
      <div className="stat"><div className="stat-top"><span>Peak hour</span><Clock3 /></div><strong>{formatHour(peak.hour)}</strong><div className="stat-bottom"><span>{committed.area}</span><span>First tied peak</span></div></div>
      <div className="stat"><div className="stat-top"><span>Locations monitored</span><MapPin /></div><strong>06<small>public areas</small></strong><div className="stat-bottom"><span>Sample locations</span><span>No live monitoring</span></div></div>
    </section>
    <div className="section-kicker" id="prediction"><span><BrainCircuit size={14} /> PREDICTION STUDIO</span><span>CONTEXT IN. INSIGHT OUT.</span></div>
    <div className="dashboard-grid">
      <section className="panel"><div className="panel-heading"><h2 className="panel-title"><SlidersHorizontal /> Plan your visit</h2><span className="sample-tag">01 / INPUTS</span></div><p className="panel-subtitle">A place. A moment. A clearer picture.</p>
        <form className="form-body" onSubmit={event => { event.preventDefault(); predict(); }}>
          <label className="field-label" htmlFor="area"><MapPin /> Public area</label><select id="area" className="select-input" value={inputs.area} onChange={event => { const area = areas.find(item => item === event.target.value); if (area) update('area', area); }}>{areas.map(area => <option key={area}>{area}</option>)}</select>
          <div className="form-row"><div><label className="field-label" htmlFor="hour"><Clock3 /> Time of visit</label><select id="hour" className="select-input" value={inputs.hour} onChange={event => update('hour', Number(event.target.value))}>{Array.from({ length: 24 }, (_, hour) => <option key={hour} value={hour}>{formatHour(hour)}</option>)}</select></div><div><span className="field-label" id="day-label"><CalendarDays /> Day type</span><div className="segment-control" role="group" aria-labelledby="day-label">{(['Weekday', 'Weekend'] as const).map(day => <Button type="button" variant="ghost" key={day} className={`segment ${inputs.day === day ? 'selected' : ''}`} aria-pressed={inputs.day === day} onClick={() => update('day', day)}>{day}</Button>)}</div></div></div>
          <div className="weather-field"><span className="field-label" id="weather-label"><Cloud /> Weather conditions</span><div className="weather-control" role="group" aria-labelledby="weather-label">{([{ name: 'Sunny', icon: Sun }, { name: 'Cloudy', icon: Cloud }, { name: 'Rainy', icon: CloudRain }] as const).map(({ name, icon: Icon }) => <Button type="button" variant="ghost" className={`weather ${inputs.weather === name ? 'selected' : ''}`} aria-pressed={inputs.weather === name} key={name} onClick={() => update('weather', name)}><Icon size={15} />{name}</Button>)}</div></div>
          <div className="event-row"><div><label htmlFor="special-event" className="field-label"><PartyPopper /> Special event nearby</label><p>Festivals, concerts, or local gatherings</p></div><Switch id="special-event" checked={inputs.event} onCheckedChange={value => update('event', value)} /></div>
          <Button variant="predict" type="submit"><Sparkles size={17} /> Predict Crowd <ArrowRight size={17} /></Button><div className="form-footnote"><ShieldCheck size={12} /> No personal data. No live tracking.</div>
        </form>
      </section>
      <section className={`panel result-panel level-${result.level.toLowerCase()}`} aria-label="Crowd prediction result"><div className="panel-heading"><h2 className="panel-title"><Zap /> Your crowd estimate</h2><span className="result-tag">{prediction.id === 0 ? 'SAMPLE ESTIMATE' : `DEMO ESTIMATE #${prediction.id}`}</span></div><p className={`panel-subtitle ${changed ? 'pending-input' : ''}`}>{changed ? 'Inputs changed — select Predict Crowd to update.' : 'Simulated insight for your selected scenario.'}</p>
        <div className="result-main" aria-live="polite"><div className="gauge" key={prediction.id}><svg viewBox="0 0 160 160" aria-hidden="true"><circle cx="80" cy="80" r="63" className="gauge-track" strokeDasharray="297 396" /><circle cx="80" cy="80" r="63" className="gauge-progress" strokeDasharray={`${result.index * 2.97} 396`} /></svg><div className="gauge-label"><strong>{result.index}<span className="sr-only"> out of 100</span></strong><span>CROWD INDEX</span></div></div><div className="result-details"><span className="level-badge"><span className="dot" /> {result.level} crowd</span><h3>{committed.area}</h3><p>{formatHour(committed.hour)} · {committed.day}<br />{committed.weather} weather · {committed.event ? 'Special event' : 'No special event'}</p></div></div>
        <div className="factor-block"><div className="factor-heading"><span>WHAT SHAPES THIS ESTIMATE</span><span>POINTS</span></div><div className="factor-list">{Object.entries(result.factors).map(([key, value]) => <div className="factor" key={key}><span>{factorLabels[key as keyof typeof factorLabels]}</span><strong className={value > 0 ? 'factor-positive' : value < 0 ? 'factor-negative' : ''}>{value > 0 ? '+' : ''}{value}</strong></div>)}</div><p className="factor-note">Sum of factors, bounded to 0–100 · illustrative weights</p></div>
        <div className="advisory"><ShieldCheck /><div><strong>YOUR VISIT, BETTER PLANNED</strong><p>{result.advisory}</p></div></div>
        <div className="scale"><div className="scale-bars"><span /><span /><span /></div><div className="scale-labels"><span>Low · 0–34</span><span>Moderate · 35–64</span><span>High · 65–100</span></div></div><div className="result-footer"><Info size={12} /> An activity index — not a headcount or safety assessment.</div>
      </section>
    </div>
    <div className="section-kicker analytics-kicker"><span><Layers size={14} /> PATTERNS & PERSPECTIVES</span><span>ALL VIEWS USE THE SAME RULES</span></div>
    <div className="lower-grid"><HourlyChart inputs={committed} /><section className="panel"><div className="panel-heading"><h2 className="panel-title"><History /> Recent predictions</h2>{history.length > 0 && <Button variant="ghost" size="icon" title="Clear recent predictions" aria-label="Clear recent predictions" onClick={() => setHistory([])}><RotateCcw size={14} /></Button>}</div><p className="panel-subtitle">Your latest scenario explorations.</p>{history.length === 0 ? <div className="empty-history"><History size={28} /><strong>A fresh perspective awaits.</strong><span>No predictions in this session yet.</span></div> : <div className="history-list">{history.map(item => { const Icon = areaIcons[item.inputs.area]; return <div className="history-item" key={item.id}><span className="history-icon"><Icon size={16} /></span><div className="min-w-0"><strong>{item.inputs.area}</strong><p>{formatHour(item.inputs.hour)} · {item.inputs.day} · {item.result.index}/100</p></div><span className={`history-level ${item.result.level.toLowerCase()}`}>{item.result.level}</span></div>; })}</div>}<div className="history-note">Session only · resets on refresh</div></section></div>
    <ScenarioAnalytics inputs={committed} onPredict={predict} />
    <section className="how-section"><div className="section-title-row"><div><div className="eyebrow">TRANSPARENCY BY DESIGN</div><h2>Intelligence you can explain.</h2></div><Button variant="link" asChild><Link to="/about">The full method <ArrowUpRight /></Link></Button></div><div className="how-grid">{[{ n: '01', icon: SlidersHorizontal, title: 'Set the context', text: 'Choose a public area, time, day, weather and nearby event.' }, { n: '02', icon: BrainCircuit, title: 'Apply the rules', text: 'An illustrative heuristic adds contextual adjustments to an area baseline.' }, { n: '03', icon: Activity, title: 'Explore the outlook', text: 'Compare a 0–100 index across hours and places to explore quieter options.' }].map(({ n, icon: Icon, title, text }) => <div className="how-step" key={n}><div className="step-top"><Icon /><span>{n}</span></div><h3>{title}</h3><p>{text}</p></div>)}</div></section>
    <section className="use-section"><div className="section-title-row"><div><div className="eyebrow">POSSIBILITIES, NOT PROMISES</div><h2>Small insights. Wider possibilities.</h2></div><span className="section-meta">CONCEPTUAL USE CASES</span></div><div className="use-grid">{[{ icon: TrainFront, title: 'Transport hubs', text: 'Explore commute-hour patterns and less-busy departure windows.' }, { icon: ShoppingBag, title: 'Retail & malls', text: 'Compare weekday shopping with weekend activity.' }, { icon: Trees, title: 'Parks & recreation', text: 'See how weather and time may shape outdoor visits.' }, { icon: ShieldCheck, title: 'Public-space planning', text: 'Discuss crowd-aware planning. Real safety decisions need verified data.' }].map(({ icon: Icon, title, text }) => <article className="use-card" key={title}><Icon /><h3>{title}</h3><p>{text}</p></article>)}</div></section>
    <section className="disclaimer"><Info /><div><h2>A demonstration, not a live prediction system.</h2><p>“AI” is the project name: this demo uses hand-defined rules, not a trained model. No sensors, live feeds, location tracking or accuracy claims. Weekly patterns repeat by day type; charts do not reflect actual opening hours or measured footfall. Actual crowds may differ. Check local guidance before travelling.</p></div><Link to="/about">Method & limitations <ChevronRight size={15} /></Link></section>
  </main></CrowdSenseShell>;
}
