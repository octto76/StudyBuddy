import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import SwipeDeck from '../components/SwipeDeck';
import { getStudyPartners } from '../services/api';
import type { StudyPartner } from '../types';

const MOCK: StudyPartner[] = [
  { id: '1', name: 'Alex', subject: 'Calculus', bio: 'Wants to study integration', imageUrl: '' },
  { id: '2', name: 'Sam', subject: 'Physics', bio: 'Quantum mechanics fan', imageUrl: '' },
];

const SwipePage: React.FC = () => {
  const [partners, setPartners] = useState<StudyPartner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ctrl = new AbortController();
    (async () => {
      try {
        const data = await getStudyPartners(ctrl.signal);
        setPartners(Array.isArray(data) ? data : []);
      } catch (err: any) {
        if (err?.name === 'AbortError') return;
        console.warn('API failed, using mock data:', err?.message);
        setError('Backend unreachable — using mock data');
        setPartners(MOCK);
      } finally {
        setLoading(false);
      }
    })();
    return () => ctrl.abort();
  }, []);

  return (
    <div>
      <Navbar />
      <div style={{ padding: 20 }}>
        {loading && <div>Loading...</div>}
        {error && <div style={{ color: 'orange' }}>Warning: {error}</div>}
        {!loading && <SwipeDeck partners={partners} onEmpty={() => console.log('deck empty')} />}
      </div>
    </div>
  );
};

export default SwipePage;