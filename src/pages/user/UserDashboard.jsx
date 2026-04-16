import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView, useMotionValue, useSpring, animate } from 'framer-motion';
import {
  BrainCircuit, FileText, ClipboardList, Activity,
  ArrowRight, ShieldCheck, AlertCircle, TrendingUp,
  Cpu, HeartPulse, Zap
} from 'lucide-react';
import { authService } from '../../services/auth';
import { interactionService } from '../../services/interactionService';
import { dateFormatter } from '../../utils/dateFormatter';
import './UserDashboard.css';

/* ─── Animation Variants ────────────────────────────────────────── */
const fadeUp = {
  hidden:  { opacity: 0, y: 32 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }
  })
};

const stagger = {
  visible: { transition: { staggerChildren: 0.13 } }
};

/* ─── Animated Counter ──────────────────────────────────────────── */
const Counter = ({ to, suffix = '' }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const count  = useMotionValue(0);
  const spring = useSpring(count, { stiffness: 80, damping: 18 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (inView) {
      const ctrl = animate(count, to, { duration: 1.4, ease: 'easeOut' });
      return ctrl.stop;
    }
  }, [inView, to, count]);

  useEffect(() => spring.on('change', v => setDisplay(Math.round(v))), [spring]);

  return <span ref={ref}>{display}{suffix}</span>;
};

/* ─── Animated Progress Bar ─────────────────────────────────────── */
const ProgressBar = ({ pct, color }) => (
  <div className="ud-progress-track">
    <motion.div
      className="ud-progress-fill"
      style={{ background: color }}
      initial={{ width: 0 }}
      animate={{ width: `${pct}%` }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
    />
  </div>
);

/* ─── Stat Card ─────────────────────────────────────────────────── */
const StatCard = ({ icon: Icon, label, value, suffix, pct, color, delay }) => (
  <motion.div
    className="ud-stat-card"
    variants={fadeUp}
    custom={delay}
    whileHover={{ y: -4, boxShadow: `0 16px 48px ${color}30` }}
    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
  >
    <div className="ud-stat-icon" style={{ background: `${color}18`, color }}>
      <Icon size={22} />
    </div>
    <div className="ud-stat-info">
      <p className="ud-stat-label">{label}</p>
      <h3 className="ud-stat-value" style={{ color }}>
        <Counter to={value} suffix={suffix} />
      </h3>
    </div>
    <ProgressBar pct={pct} color={color} />
  </motion.div>
);

/* ─── Tool Card ─────────────────────────────────────────────────── */
const ToolCard = ({ icon: Icon, title, desc, action, color, delay, onClick }) => (
  <motion.div
    className="ud-tool-card"
    variants={fadeUp}
    custom={delay}
    whileHover={{ y: -6, boxShadow: `0 20px 60px ${color}25` }}
    whileTap={{ scale: 0.97 }}
    transition={{ type: 'spring', stiffness: 220, damping: 20 }}
    onClick={onClick}
    style={{ cursor: 'pointer', '--card-color': color }}
  >
    <div className="ud-tool-icon" style={{ background: `${color}15`, color, border: `1px solid ${color}30` }}>
      <Icon size={26} />
    </div>
    <h3 className="ud-tool-title">{title}</h3>
    <p className="ud-tool-desc">{desc}</p>
    <div style={{ marginTop: '16px' }}>
      <button className="ent-btn ent-btn-primary" style={{ width: '100%', display: 'flex', justifyContent: 'space-between', padding: '12px 20px', height: 'auto', borderRadius: '10px' }}>
        <span>{action}</span>
        <motion.span animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}>
          <ArrowRight size={18} />
        </motion.span>
      </button>
    </div>
    <div className="ud-tool-glow" style={{ background: `radial-gradient(circle at 70% 70%, ${color}18, transparent 70%)` }} />
  </motion.div>
);

/* ─── Main Component ─────────────────────────────────────────────── */
const UserDashboard = ({ onNavigate }) => {
  const [recentAlerts, setRecentAlerts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = authService.getCurrentUser();
    setCurrentUser(user);
    try {
      const alerts = interactionService.getRecentAlerts(3);
      setRecentAlerts((alerts || []).map(p => ({
        id: p.id,
        animal: `${p.details?.animalType || 'Animal'} #${p.id.slice(-4).toUpperCase()}`,
        issue: 'Analysis Pending',
        timeAgo: dateFormatter.formatTimeAgo(p.date)
      })));
    } catch (e) {
      console.warn('Alerts load skipped:', e.message);
    }
  }, []);

  return (
    <motion.div
      className="dashboard-container ud-wrapper"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >

      {/* ── Hero ───────────────────────────────────────────────── */}
      <motion.div className="ud-hero" initial="hidden" animate="visible" variants={stagger}>

        <motion.div className="ud-hero-badge" variants={fadeUp} custom={0}>
          <span className="ud-pulse-dot" />
          AI System Online
        </motion.div>

        <motion.h1 className="ud-hero-title" variants={fadeUp} custom={1}>
          Livestock Intelligence{' '}
          <span className="ud-gradient-text">Hub</span>
        </motion.h1>

        <motion.p className="ud-hero-sub" variants={fadeUp} custom={2}>
          Welcome back, <strong>{currentUser?.name || 'Farmer'}</strong>. Monitor vitals, predict health anomalies, and receive AI-driven advisory across your farm.
        </motion.p>

        {/* Stat Pills */}
        <motion.div className="ud-pills" variants={fadeUp} custom={3}>
          {[
            { icon: ShieldCheck, label: 'System Healthy', color: '#22c55e' },
            { icon: Cpu,         label: '3 AI Models Active', color: '#3b82f6' },
            { icon: Activity,    label: 'Live Monitoring', color: '#a855f7' },
            { icon: AlertCircle, label: `${recentAlerts.length} Alerts`, color: recentAlerts.length > 0 ? '#eab308' : '#9ca3af' },
          ].map(({ icon: Icon, label, color }) => (
            <motion.div
              key={label}
              className="ud-pill"
              whileHover={{ scale: 1.08, y: -2 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Icon size={15} style={{ color }} />
              <span>{label}</span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* ── Stats Row ─────────────────────────────────────────── */}
      <motion.div
        className="ud-stats-row"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        variants={stagger}
      >
        <StatCard icon={HeartPulse}  label="Animals Monitored" value={128}  suffix="+"  pct={82} color="#22c55e" delay={0} />
        <StatCard icon={BrainCircuit} label="Predictions Run"  value={347}  suffix=""   pct={70} color="#a855f7" delay={1} />
        <StatCard icon={TrendingUp}  label="Accuracy Rate"    value={96}   suffix="%"  pct={96} color="#3b82f6" delay={2} />
        <StatCard icon={Zap}         label="Alerts Resolved"  value={89}   suffix="%"  pct={89} color="#f97316" delay={3} />
      </motion.div>

      {/* ── Tool Cards ─────────────────────────────────────────── */}
      <motion.div
        className="ud-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        variants={stagger}
      >
        <motion.h2 className="ud-section-title" variants={fadeUp} custom={0}>
          Health Management Tools
        </motion.h2>
        <div className="ud-tools-grid">
          <ToolCard
            icon={BrainCircuit} color="#a855f7" delay={1}
            title="Disease Prediction"
            desc="Analyze livestock symptoms using cutting-edge neural networks to detect diseases early."
            action="Run Diagnostics"
            onClick={() => onNavigate('disease-prediction')}
          />
          <ToolCard
            icon={FileText} color="#3b82f6" delay={2}
            title="AI Advisory"
            desc="Get precision health guidance and data-driven expert recommendations from our AI vet bank."
            action="View Guidelines"
            onClick={() => onNavigate('advisory-system')}
          />
          <ToolCard
            icon={ClipboardList} color="#22c55e" delay={3}
            title="Animal Records"
            desc="Securely store and track historical livestock health, vaccination, and treatment data."
            action="Manage Logs"
            onClick={() => onNavigate('animal-records')}
          />
        </div>
      </motion.div>

      {/* ── Alerts ──────────────────────────────────────────────── */}
      <motion.div
        className="ud-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        variants={stagger}
      >
        <motion.h2 className="ud-section-title" variants={fadeUp} custom={0}>
          Recent Health Alerts
        </motion.h2>
        <motion.div className="ud-alerts-card" variants={fadeUp} custom={1}>
          {recentAlerts.length === 0 ? (
            <motion.div
              className="ud-empty-state"
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
              >
                <ShieldCheck size={40} color="#22c55e" />
              </motion.div>
              <p>No active health alerts across your herd. All systems nominal.</p>
            </motion.div>
          ) : (
            <motion.div className="ud-alert-list" variants={stagger} initial="hidden" animate="visible">
              {recentAlerts.map((a, i) => (
                <motion.div
                  key={a.id}
                  className="ud-alert-row"
                  variants={fadeUp}
                  custom={i}
                  whileHover={{ x: 4, backgroundColor: '#fffbeb' }}
                >
                  <div className="ud-alert-dot" />
                  <div className="ud-alert-info">
                    <strong>{a.animal}</strong>
                    <span>{a.timeAgo}</span>
                  </div>
                  <span className="ud-badge-pending">{a.issue}</span>
                </motion.div>
              ))}
            </motion.div>
          )}
          {recentAlerts.length > 0 && (
            <motion.button
              className="ud-btn-outline"
              style={{ marginTop: 24 }}
              onClick={() => onNavigate('ai-reports')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              View All Alerts <ArrowRight size={16} />
            </motion.button>
          )}
        </motion.div>
      </motion.div>

    </motion.div>
  );
};

export default UserDashboard;
