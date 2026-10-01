import React, { useState, useMemo, useEffect } from 'react';
import { Truck, Navigation, Plus, Trash2, ShieldAlert, Award, Compass } from 'lucide-react';

export default function App() {
  const [deliveries, setDeliveries] = useState(() => {
    const saved = localStorage.getItem('logiroute_data');
    return saved ? JSON.parse(saved) : [
      { id: 1, location: 'Electronic City Industrial Hub, Phase 1', priority: 'High', weight: 450, distance: 18 },
      { id: 2, location: 'Whitefield Global Technology Park', priority: 'Medium', weight: 280, distance: 24 },
      { id: 3, location: 'Koramangala 4th Block Commercial Zone', priority: 'High', weight: 125, distance: 8 }
    ];
  });

  const [location, setLocation] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [weight, setWeight] = useState('');
  const [distance, setDistance] = useState('');

  useEffect(() => {
    localStorage.setItem('logiroute_data', JSON.stringify(deliveries));
  }, [deliveries]);

  const optimizedRouteMetrics = useMemo(() => {
    const optimizedList = [...deliveries].sort((a, b) => {
      if (a.priority === 'High' && b.priority !== 'High') return -1;
      if (a.priority !== 'High' && b.priority === 'High') return 1;
      return a.distance - b.distance;
    });

    const totalWeight = deliveries.reduce((sum, item) => sum + Number(item.weight || 0), 0);
    const totalDistance = optimizedList.reduce((sum, item) => sum + Number(item.distance || 0), 0);
    const structuralAlert = totalWeight > 1000 || totalDistance > 120;

    return { optimizedList, totalWeight, totalDistance, structuralAlert };
  }, [deliveries]);

  const handleAddStop = (e) => {
    e.preventDefault();
    if (!location || !weight || !distance) return alert('Please input valid transactional data vectors.');

    setDeliveries([...deliveries, {
      id: Date.now(),
      location,
      priority,
      weight: Number(weight),
      distance: Number(distance)
    }]);
    setLocation('');
    setWeight('');
    setDistance('');
  };

  const styles = {
    container: { fontFamily: 'Segoe UI, sans-serif', backgroundColor: '#090d16', minHeight: '100vh', padding: '32px', color: '#e2e8f0' },
    header: { borderBottom: '1px solid #1e293b', paddingBottom: '20px', marginBottom: '32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
    gridStats: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px' },
    statCard: { backgroundColor: '#111827', padding: '24px', borderRadius: '12px', border: '1px solid #1e293b', position: 'relative', overflow: 'hidden' },
    mainGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '32px' },
    cardPanel: { backgroundColor: '#111827', padding: '24px', borderRadius: '12px', border: '1px solid #1e293b', height: 'fit-content' },
    inputField: { width: '100%', padding: '12px', backgroundColor: '#030712', border: '1px solid #374151', borderRadius: '8px', color: '#f3f4f6', marginBottom: '16px', marginTop: '6px', boxSizing: 'border-box' },
    actionBtn: { width: '100%', padding: '14px', backgroundColor: '#38bdf8', color: '#0f172a', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' },
    routeRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#030712', padding: '16px', borderRadius: '8px', marginBottom: '12px' }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <Compass size={40} color="#38bdf8" />
          <div>
            <h1 style={{ margin: 0, fontSize: '28px', letterSpacing: '-0.5px' }}>LogiRoute Pro</h1>
            <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '13px' }}>Algorithmic Fleet Supply Chain Optimization Engine</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#1e293b', padding: '8px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', color: '#38bdf8' }}>
          <Award size={14} /> Production Grade V1.0
        </div>
      </div>

      <div style={styles.gridStats}>
        <div style={styles.statCard}>
          <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>Active Waypoints</p>
          <h2 style={{ margin: '8px 0 0 0', fontSize: '32px', color: '#38bdf8' }}>{deliveries.length} Nodes</h2>
        </div>
        <div style={styles.statCard}>
          <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>Cumulative Freight Mass</p>
          <h2 style={{ margin: '8px 0 0 0', fontSize: '32px', color: '#fbbf24' }}>{optimizedRouteMetrics.totalWeight} kg</h2>
        </div>
        <div style={styles.statCard}>
          <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>Computed Circuit Loops</p>
          <h2 style={{ margin: '8px 0 0 0', fontSize: '32px', color: '#10b981' }}>{optimizedRouteMetrics.totalDistance} km</h2>
        </div>
      </div>

      {optimizedRouteMetrics.structuralAlert && (
        <div style={{ backgroundColor: '#7f1d1d', padding: '16px', borderRadius: '12px', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px', border: '1px solid #f43f5e' }}>
          <ShieldAlert color="#f43f5e" />
          <div>
            <strong style={{ color: '#ffffff' }}>System Capacity Warning Threshold Breached:</strong>
            <span style={{ marginLeft: '6px', color: '#fca5a5', fontSize: '14px' }}>Payload allocations exceed standard vehicle fleet operations constraints. Optimize structural distribution nodes.</span>
          </div>
        </div>
      )}

      <div style={styles.mainGrid}>
        <div style={styles.cardPanel}>
          <h3 style={{ marginTop: 0, marginBottom: '20px', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '8px' }}><Plus size={20}/> Ingest Operational Parameters</h3>
          <form onSubmit={handleAddStop}>
            <label style={{ fontSize: '13px', color: '#64748b' }}>Destination Hub Physical Address</label>
            <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Sector 5 Warehouse, Terminal B" style={styles.inputField} required />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '13px', color: '#64748b' }}>Cargo Weight (kg)</label>
                <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="Mass Vectors" style={styles.inputField} required />
              </div>
              <div>
                <label style={{ fontSize: '13px', color: '#64748b' }}>Radial Distance (km)</label>
                <input type="number" value={distance} onChange={(e) => setDistance(e.target.value)} placeholder="Radius Metric" style={styles.inputField} required />
              </div>
            </div>

            <label style={{ fontSize: '13px', color: '#64748b' }}>Client SLA Execution Urgency</label>
            <select value={priority} onChange={(e) => setPriority(e.target.value)} style={styles.inputField}>
              <option value="High">High Priority (Immediate Dispatch Window)</option>
              <option value="Medium">Medium Priority (Standard Delivery Window)</option>
              <option value="Low">Low Priority (Flexible Route Options)</option>
            </select>

            <button type="submit" style={styles.actionBtn}>Compute & Execute Sorting Matrix</button>
          </form>
        </div>

        <div style={styles.cardPanel}>
          <h3 style={{ marginTop: 0, marginBottom: '20px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '8px' }}><Navigation size={20}/> Algorithmic Optimized Dispatch Manifest</h3>
          
          <div style={{ maxHeight: '440px', overflowY: 'auto' }}>
            {optimizedRouteMetrics.optimizedList.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#475569', marginTop: '40px' }}>No operational parameters currently tracked in engine memory.</p>
            ) : (
              optimizedRouteMetrics.optimizedList.map((item, index) => (
                <div key={item.id} style={{ ...styles.routeRow, borderLeft: item.priority === 'High' ? '4px solid #f43f5e' : '4px solid #38bdf8' }}>
                  <div style={{ paddingLeft: '8px' }}>
                    <h4 style={{ margin: 0, fontSize: '15px' }}>{index + 1}. {item.location}</h4>
                    <p style={{ margin: '6px 0 0 0', fontSize: '13px', color: '#94a3b8' }}>
                      Payload Weight: <span style={{ color: '#fbbf24', fontWeight: 'bold' }}>{item.weight} kg</span> | Radial Index: <span style={{ color: '#10b981', fontWeight: 'bold' }}>{item.distance} km</span>
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingRight: '8px' }}>
                    <span style={{ fontSize: '10px', fontWeight: 'bold', padding: '3px 8px', borderRadius: '4px', backgroundColor: item.priority === 'High' ? '#7f1d1d' : '#0369a1', color: '#ffffff', textTransform: 'uppercase' }}>
                      {item.priority}
                    </span>
                    <button onClick={() => setDeliveries(deliveries.filter(d => d.id !== item.id))} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
