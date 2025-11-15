import React, { useState } from 'react';
import SwipeCard from './SwipeCard';
import { postSwipe } from '../services/api';
import type { StudyPartner } from '../types';

interface Props {
  partners: StudyPartner[];
  onEmpty?: () => void;
}

const SwipeDeck: React.FC<Props> = ({ partners, onEmpty }) => {
  const [index, setIndex] = useState(0);
  const current = partners[index];

  const handleSwipe = async (direction: 'left' | 'right') => {
    if (!current) return;
    // optimistic advance
    setIndex((i) => i + 1);
    try {
      await postSwipe(current.id, direction);
    } catch (err) {
      console.error('postSwipe failed', err);
      // optional rollback: setIndex(i => i - 1)
    }
  };

  if (!current) {
    if (onEmpty) onEmpty();
    return <div style={{ padding: 20 }}>No more profiles.</div>;
  }

  return (
    <div
      className="swipe-deck"
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: 360,
        height: 520,
        margin: '0 auto',
        overflow: 'hidden', // <- prevents dragging card from creating horizontal scroll
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <SwipeCard user={current} onSwipe={handleSwipe} />
      <div style={{ position: 'absolute', top: 12, right: 12, color: '#666' }}>
        {index + 1}/{partners.length}
      </div>
    </div>
  );
};

export default SwipeDeck;