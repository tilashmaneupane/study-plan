import React, { useState, useEffect, useMemo } from 'react';
import { 
  Shield, 
  Globe, 
  BookOpen, 
  Calendar, 
  Terminal, 
  Plus, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  ExternalLink,
  Award, 
  Zap,
  Atom,
  Binary,
  Code2,
  Cpu,
  Sigma,
  AlertTriangle,
  Edit3,
  Save,
  X,
  Lock,
  Layout,
  Code,
  CalendarDays
} from 'lucide-react';

const App = () => {
  // --- State & Constants ---
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Persistence for Logs
  const [logs, setLogs] = useState(() => {
    const saved = localStorage.getItem('tilashma_logs_v2');
    return saved ? JSON.parse(saved) : [];
  });

  // Persistence for Editable Roadmap
  const [milestones, setMilestones] = useState(() => {
    const saved = localStorage.getItem('tilashma_roadmap');
    return saved ? JSON.parse(saved) : [
      { id: 1, title: 'Week 1: Foundations (Baisakh 7-13)', main: 'Past Paper Analysis', sub: 'C Loops & Physics Units', status: 'In Progress' },
      { id: 2, title: 'Week 2: Advanced (Baisakh 14-20)', main: 'Numerical Blitz', sub: 'C Arrays & Matrix Algebra', status: 'Not Started' },
      { id: 3, title: 'Final Week: Revision (Baisakh 21-26)', main: 'Mock Boards', sub: 'Digital Logic Circuits', status: 'Not Started' },
      { id: 4, title: 'EXAM DAY', main: 'Baisakh 27, 2083', sub: 'Board Center Appearance', status: 'Target' },
    ];
  });

  // Persistence for Cyber & Web Tracks
  const [cyberTrack, setCyberTrack] = useState(() => {
    const saved = localStorage.getItem('tilashma_cyber');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: 'Linux Fundamentals', platform: 'TryHackMe', status: 'Done' },
      { id: 2, name: 'Network Services', platform: 'TryHackMe', status: 'In Progress' },
      { id: 3, name: 'Security+ Domain 1', platform: 'Self Study', status: 'Not Started' }
    ];
  });

  const [webTrack, setWebTrack] = useState(() => {
    const saved = localStorage.getItem('tilashma_web');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: 'Basic HTML/CSS', platform: 'freeCodeCamp', status: 'Done' },
      { id: 2, name: 'JS Algorithms', platform: 'freeCodeCamp', status: 'In Progress' },
      { id: 3, name: 'React Dashboard Project', platform: 'Portfolio', status: 'Not Started' }
    ];
  });

  const [isEditingRoadmap, setIsEditingRoadmap] = useState(false);
  const [habits, setHabits] = useState({ exercise: false, class7am: false });
  
  // Board Exam Date: 27 Baisakh 2083 BS = May 10, 2026 AD
  const targetDate = new Date('2026-05-10'); 
  const nepaliExamDate = "27 Baisakh 2083";
  const nepaliToday = "7 Baisakh 2083";
  const englishToday = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  const subjects = [
    { id: 'physics', name: 'Physics', icon: Atom, color: 'text-purple-400', target: 30, type: 'study' },
    { id: 'maths', name: 'Maths I', icon: Sigma, color: 'text-blue-400', target: 35, type: 'study' },
    { id: 'c-prog', name: 'C Programming', icon: Code2, color: 'text-lime-400', target: 40, type: 'study' },
    { id: 'iit', name: 'IIT', icon: Globe, color: 'text-cyan-400', target: 25, type: 'study' },
    { id: 'digital-logic', name: 'Digital Logic', icon: Cpu, color: 'text-orange-400', target: 30, type: 'study' },
    { id: 'cyber', name: 'Cyber Security', icon: Lock, color: 'text-rose-400', target: 20, type: 'coding' },
    { id: 'web', name: 'Web Development', icon: Layout, color: 'text-emerald-400', target: 15, type: 'coding' },
  ];

  useEffect(() => {
    localStorage.setItem('tilashma_logs_v2', JSON.stringify(logs));
    localStorage.setItem('tilashma_roadmap', JSON.stringify(milestones));
    localStorage.setItem('tilashma_cyber', JSON.stringify(cyberTrack));
    localStorage.setItem('tilashma_web', JSON.stringify(webTrack));
  }, [logs, milestones, cyberTrack, webTrack]);

  // --- Calculations ---
  const countdown = useMemo(() => {
    const diff = targetDate - new Date();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }, []);

  const subjectStats = useMemo(() => {
    return subjects.map(sub => {
      const hours = logs
        .filter(log => log.subjectId === sub.id)
        .reduce((acc, log) => acc + (Number(log.hours) || 0), 0);
      return { ...sub, current: hours };
    });
  }, [logs]);

  const splitStats = useMemo(() => {
    const studyHrs = logs.filter(l => {
      const sub = subjects.find(s => s.id === l.subjectId);
      return sub?.type === 'study';
    }).reduce((a, b) => a + Number(b.hours), 0);
    
    const codingHrs = logs.filter(l => {
      const sub = subjects.find(s => s.id === l.subjectId);
      return sub?.type === 'coding';
    }).reduce((a, b) => a + Number(b.hours), 0);
    
    const total = studyHrs + codingHrs || 1;
    return {
      study: studyHrs,
      coding: codingHrs,
      studyRatio: (studyHrs / total) * 100,
      codingRatio: (codingHrs / total) * 100,
      isBalanced: (studyHrs / total) >= 0.6 
    };
  }, [logs]);

  // --- Handlers ---
  const handleUpdateMilestone = (id, field, value) => {
    setMilestones(prev => prev.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  const toggleStatus = (track, setTrack, id) => {
    const statusCycle = ['Not Started', 'In Progress', 'Done'];
    setTrack(prev => prev.map(item => {
      if (item.id === id) {
        const nextIdx = (statusCycle.indexOf(item.status) + 1) % statusCycle.length;
        return { ...item, status: statusCycle[nextIdx] };
      }
      return item;
    }));
  };

  // --- Components ---
  const ProgressBar = ({ label, current, total, color, icon: Icon }) => (
    <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <Icon size={18} className={color} />
          <span className="text-sm font-medium text-slate-300">{label}</span>
        </div>
        <span className="text-xs text-slate-400">{current} / {total} Hrs</span>
      </div>
      <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
        <div 
          className={`h-full transition-all duration-500 ${color.replace('text-', 'bg-')}`} 
          style={{ width: `${Math.min(100, (current/total)*100)}%` }}
        />
      </div>
    </div>
  );

  const Dashboard = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Unified Calendar Card */}
        <div className="bg-gradient-to-br from-rose-600 to-rose-800 p-5 rounded-2xl shadow-xl border border-rose-500/30 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <h3 className="text-white font-bold flex items-center gap-2">
                <CalendarDays size={18} /> Board Exam
              </h3>
              <div className="flex flex-col">
                <span className="text-[10px] text-rose-100 font-bold uppercase tracking-widest">{nepaliExamDate}</span>
                <span className="text-[10px] text-rose-200/80 font-mono">10 May 2026</span>
              </div>
            </div>
            <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm">
              <AlertTriangle className="text-white animate-pulse" size={18} />
            </div>
          </div>
          <div className="mt-4 flex items-end justify-between">
            <div>
              <span className="text-5xl font-black text-white leading-none">{countdown}</span>
              <span className="ml-2 text-xs font-bold text-rose-100 uppercase">Days Left</span>
            </div>
            <div className="text-right">
              <span className="text-[9px] text-rose-200 uppercase block font-bold">Today</span>
              <span className="text-xs text-white font-mono">{nepaliToday}</span>
            </div>
          </div>
        </div>

        {/* Study vs Coding Split */}
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <h3 className="text-slate-400 font-bold text-xs uppercase tracking-tight">Daily Focus Balance</h3>
            <div className="flex gap-1">
               <BookOpen size={14} className="text-blue-400" />
               <Code size={14} className="text-emerald-400" />
            </div>
          </div>
          <div className="space-y-3 mt-2">
            <div className="flex justify-between text-[10px] uppercase font-black">
              <span className="text-blue-400">Academic {splitStats.studyRatio.toFixed(0)}%</span>
              <span className="text-emerald-400">Coding {splitStats.codingRatio.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-slate-900 h-4 rounded-full flex overflow-hidden border border-slate-700 p-0.5">
              <div className="bg-blue-500 h-full rounded-full transition-all duration-700" style={{ width: `${splitStats.studyRatio}%` }} />
              <div className="bg-emerald-500 h-full rounded-full transition-all duration-700" style={{ width: `${splitStats.codingRatio}%` }} />
            </div>
            <div className="flex items-center justify-center gap-2">
               <div className={`w-1.5 h-1.5 rounded-full ${splitStats.isBalanced ? "bg-emerald-400" : "bg-amber-400"}`} />
               <p className="text-[10px] text-slate-400 font-medium">
                 {splitStats.isBalanced ? "Exam Prep Priority: Locked" : "Need more Academic Focus"}
               </p>
            </div>
          </div>
        </div>

        {/* Habits */}
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
          <h3 className="text-slate-400 font-bold text-xs uppercase tracking-tight mb-3">5:30 AM Sprint Routine</h3>
          <div className="space-y-2">
            <button 
              onClick={() => setHabits(h => ({...h, exercise: !h.exercise}))}
              className={`w-full flex items-center justify-between p-2.5 rounded-xl border transition-all ${habits.exercise ? 'border-lime-500/50 bg-lime-500/10 text-lime-400 shadow-lg shadow-lime-500/5' : 'border-slate-700 text-slate-500 text-xs hover:border-slate-600'}`}
            >
              <span className="font-medium">Daily Exercise</span>
              {habits.exercise ? <CheckCircle2 size={16}/> : <div className="w-4 h-4 rounded-full border-2 border-slate-700" />}
            </button>
            <button 
              onClick={() => setHabits(h => ({...h, class7am: !h.class7am}))}
              className={`w-full flex items-center justify-between p-2.5 rounded-xl border transition-all ${habits.class7am ? 'border-blue-500/50 bg-blue-500/10 text-blue-400 shadow-lg shadow-blue-500/5' : 'border-slate-700 text-slate-500 text-xs hover:border-slate-600'}`}
            >
              <span className="font-medium">7 AM Class Ready</span>
              {habits.class7am ? <CheckCircle2 size={16}/> : <div className="w-4 h-4 rounded-full border-2 border-slate-700" />}
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">Academic Subject Mastery</h3>
        <span className="text-[10px] text-slate-500 font-mono uppercase">Target: Board Distinction</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {subjectStats.filter(s => s.type === 'study').map(sub => (
          <ProgressBar key={sub.id} {...sub} label={sub.name} />
        ))}
      </div>
    </div>
  );

  const InterestSection = ({ title, track, setTrack, icon: Icon, colorClass, hoursId }) => (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-xl bg-slate-800 border border-slate-700 ${colorClass}`}>
            <Icon size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">{title}</h2>
            <p className="text-slate-400 text-sm">Skills & Portfolio Growth</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs text-slate-500">Total Logged</span>
          <p className={`text-xl font-mono font-bold ${colorClass}`}>
            {logs.filter(l => l.subjectId === hoursId).reduce((a, b) => a + Number(b.hours), 0)} Hrs
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {track.map(item => (
          <div 
            key={item.id} 
            onClick={() => toggleStatus(track, setTrack, item.id)}
            className="group bg-slate-800/50 border border-slate-700 p-4 rounded-2xl flex items-center justify-between cursor-pointer hover:border-slate-500 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className={`w-2 h-2 rounded-full ${item.status === 'Done' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : item.status === 'In Progress' ? 'bg-amber-500' : 'bg-slate-600'}`} />
              <div>
                <h4 className="text-slate-200 font-medium">{item.name}</h4>
                <p className="text-xs text-slate-500">{item.platform}</p>
              </div>
            </div>
            <span className={`text-[10px] px-2 py-1 rounded-full ${item.status === 'Done' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : item.status === 'In Progress' ? 'bg-amber-500/10 text-amber-400' : 'bg-slate-900 text-slate-500'}`}>
              {item.status}
            </span>
          </div>
        ))}
        <button className="flex items-center justify-center gap-2 p-3 border border-dashed border-slate-700 rounded-2xl text-slate-500 hover:text-slate-300 hover:border-slate-500 transition-all text-xs font-bold uppercase tracking-widest">
          <Plus size={14} /> Add Milestone
        </button>
      </div>
    </div>
  );

  const Roadmap = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-end mb-2">
        <div>
          <h2 className="text-2xl font-bold text-white">Study Plan Roadmap</h2>
          <p className="text-slate-400 text-sm">Sprint toward Baisakh 27</p>
        </div>
        <button 
          onClick={() => setIsEditingRoadmap(!isEditingRoadmap)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase transition-all ${isEditingRoadmap ? 'bg-lime-600 text-white shadow-lg shadow-lime-600/20' : 'bg-slate-800 text-slate-300 border border-slate-700'}`}
        >
          {isEditingRoadmap ? <><Save size={14}/> Save Changes</> : <><Edit3 size={14}/> Edit Plan</>}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {milestones.map(m => (
          <div key={m.id} className={`bg-slate-800/80 border rounded-xl p-4 flex flex-col md:flex-row md:items-center gap-4 transition-colors ${m.status === 'Target' ? 'border-rose-500/50 bg-rose-500/5' : 'border-slate-700'}`}>
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center font-black border shrink-0 ${m.status === 'Target' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'}`}>
              {m.id === 4 ? '🏁' : `S${m.id}`}
            </div>
            <div className="flex-1 space-y-1">
              {isEditingRoadmap ? (
                <div className="space-y-2">
                  <input 
                    className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-white text-sm"
                    value={m.title}
                    onChange={(e) => handleUpdateMilestone(m.id, 'title', e.target.value)}
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input className="w-full bg-slate-900 border border-slate-700 rounded p-1 text-white text-[10px]" value={m.main} onChange={(e) => handleUpdateMilestone(m.id, 'main', e.target.value)} />
                    <input className="w-full bg-slate-900 border border-slate-700 rounded p-1 text-white text-[10px]" value={m.sub} onChange={(e) => handleUpdateMilestone(m.id, 'sub', e.target.value)} />
                  </div>
                </div>
              ) : (
                <>
                  <h4 className="text-slate-200 font-bold">{m.title}</h4>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/20 font-bold uppercase tracking-tight">📘 {m.main}</span>
                    <span className="text-[10px] bg-slate-700/50 text-slate-400 px-2 py-0.5 rounded border border-slate-600 font-bold uppercase tracking-tight">📙 {m.sub}</span>
                  </div>
                </>
              )}
            </div>
            <div className="shrink-0">
              {isEditingRoadmap ? (
                <select className="bg-slate-900 text-[10px] text-slate-300 border border-slate-700 rounded p-1.5" value={m.status} onChange={(e) => handleUpdateMilestone(m.id, 'status', e.target.value)}>
                  <option>Not Started</option><option>In Progress</option><option>Done</option><option>Target</option>
                </select>
              ) : (
                <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase ${m.status === 'In Progress' ? 'bg-amber-500/20 text-amber-400' : m.status === 'Done' ? 'bg-lime-500/20 text-lime-400' : 'bg-slate-700 text-slate-500'}`}>
                  {m.status}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const DailyLog = () => {
    const [formData, setFormData] = useState({ hours: '', subjectId: 'physics', notes: '' });

    const addLog = (e) => {
      e.preventDefault();
      const subject = subjects.find(s => s.id === formData.subjectId);
      const newLog = { ...formData, subjectName: subject.name, id: Date.now(), date: new Date().toLocaleDateString() };
      setLogs([newLog, ...logs]);
      setFormData({ hours: '', subjectId: 'physics', notes: '' });
    };

    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <form onSubmit={addLog} className="bg-slate-800 p-6 rounded-2xl border border-slate-700 sticky top-4">
            <h3 className="text-sm font-black text-white mb-4 uppercase tracking-widest flex items-center gap-2"><Plus size={18} className="text-rose-400" /> New Log Entry</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Subject / Track</label>
                <select value={formData.subjectId} onChange={e => setFormData({...formData, subjectId: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white text-sm focus:outline-none">
                  {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Hours</label>
                <input type="number" step="0.5" value={formData.hours} onChange={e => setFormData({...formData, hours: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white text-sm focus:border-rose-500 outline-none" placeholder="e.g. 2.5" />
              </div>
              <button type="submit" className="w-full bg-rose-600 hover:bg-rose-500 text-white font-black uppercase py-3 rounded-xl transition-all text-xs shadow-lg shadow-rose-600/20">Save Entry</button>
            </div>
          </form>
        </div>
        <div className="lg:col-span-2 space-y-3">
          {logs.length === 0 ? <div className="text-center py-12 text-slate-600 italic text-sm">No activity logged for the Baisakh sprint yet.</div> : logs.map(log => (
            <div key={log.id} className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 flex justify-between items-center animate-in slide-in-from-bottom-2 duration-300">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono text-slate-500 uppercase">{log.date}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-black uppercase ${subjects.find(s => s.id === log.subjectId)?.color.replace('text-', 'bg-').replace('-400', '-500/20')} ${subjects.find(s => s.id === log.subjectId)?.color}`}>{log.subjectName}</span>
                </div>
                <div className="text-xl font-black text-white">{log.hours} <span className="text-[10px] font-bold text-slate-500 uppercase">Hrs Session</span></div>
              </div>
              <button onClick={() => setLogs(logs.filter(l => l.id !== log.id))} className="text-slate-700 hover:text-rose-400 p-2 transition-colors font-bold">×</button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans p-4 md:p-8 pb-24">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-rose-600 rounded-2xl shadow-[0_0_20px_rgba(225,29,72,0.3)]">
              <Terminal size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-white uppercase leading-none">Study Plan</h1>
              <p className="text-[10px] text-slate-500 font-bold uppercase mt-1 tracking-widest">Tilashma Neupane • Baisakh 27</p>
            </div>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 px-3 py-1.5 rounded-xl flex items-center gap-3">
             <div className="text-right border-r border-slate-700 pr-3">
               <div className="text-[9px] text-rose-500 font-black uppercase tracking-tighter">Nepali (BS)</div>
               <div className="text-xs text-white font-bold">{nepaliToday}</div>
             </div>
             <div className="text-right">
               <div className="text-[9px] text-slate-500 font-black uppercase tracking-tighter">English (AD)</div>
               <div className="text-xs text-slate-300 font-mono">{englishToday}</div>
             </div>
          </div>
        </header>

        <nav className="flex gap-2 p-1.5 bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-800 mb-8 overflow-x-auto no-scrollbar">
          {[
            { id: 'dashboard', label: 'Overview', icon: Zap },
            { id: 'daily', label: 'Logs', icon: Calendar },
            { id: 'roadmap', label: 'Plan', icon: TrendingUp },
            { id: 'cyber', label: 'Cyber', icon: Shield },
            { id: 'web', label: 'Web', icon: Globe },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase transition-all whitespace-nowrap ${
                activeTab === tab.id 
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/20' 
                  : 'text-slate-500 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </nav>

        <main className="min-h-[400px]">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'daily' && <DailyLog />}
          {activeTab === 'roadmap' && <Roadmap />}
          {activeTab === 'cyber' && <InterestSection title="Cyber Security" track={cyberTrack} setTrack={setCyberTrack} icon={Shield} colorClass="text-rose-400" hoursId="cyber" />}
          {activeTab === 'web' && <InterestSection title="Web Development" track={webTrack} setTrack={setWebTrack} icon={Globe} colorClass="text-emerald-400" hoursId="web" />}
        </main>

        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 p-3 rounded-2xl shadow-2xl md:hidden">
           <p className="text-[9px] text-center font-bold text-slate-400 uppercase tracking-widest">
             "Baisakh 27 Sprint: {countdown} Days to Go"
           </p>
        </div>
      </div>
    </div>
  );
};

export default App;