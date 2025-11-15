import React, { useRef, useState } from 'react';

interface User {
  id: string;
  name: string;
  subject?: string;
  bio?: string;
  imageUrl?: string;
}

interface SwipeCardProps {
  user: User;
  onSwipe: (direction: 'left' | 'right') => void;
}

const THRESHOLD = 100; // px to trigger a swipe

const SwipeCard: React.FC<SwipeCardProps> = ({ user, onSwipe }) => {
  const startX = useRef(0);
  const startY = useRef(0);
  const [tx, setTx] = useState(0);
  const [ty, setTy] = useState(0);
  const [rot, setRot] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [gone, setGone] = useState(false);

  const onPointerDown = (e: React.PointerEvent) => {
    if (gone) return;
    (e.target as Element).setPointerCapture(e.pointerId);
    startX.current = e.clientX;
    startY.current = e.clientY;
    setDragging(true);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging || gone) return;
    const dx = e.clientX - startX.current;
    const dy = e.clientY - startY.current;
    setTx(dx);
    setTy(dy);
    setRot(Math.max(-20, Math.min(20, dx / 10)));
  };

  const finish = (direction?: 'left' | 'right') => {
    if (direction) {
      const sign = direction === 'right' ? 1 : -1;
      // push card off-screen and report swipe
      setTx(window.innerWidth * 0.8 * sign);
      setTy(0);
      setRot(20 * sign);
      setGone(true);
      setTimeout(() => onSwipe(direction), 200);
    } else {
      // reset
      setTx(0);
      setTy(0);
      setRot(0);
    }
    setDragging(false);
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (gone) return;
    const dx = e.clientX - startX.current;
    if (dx > THRESHOLD) finish('right');
    else if (dx < -THRESHOLD) finish('left');
    else finish();
    try {
      (e.target as Element).releasePointerCapture(e.pointerId);
    } catch {}
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (gone) return;
    if (e.key === 'ArrowLeft') finish('left');
    if (e.key === 'ArrowRight') finish('right');
  };

  return (
    <div
      tabIndex={0}
      onKeyDown={handleKey}
      style={{
        // position absolute so transforms don't expand the page bounds
        position: 'absolute',
        left: '50%',
        top: '50%',
        width: 320,
        maxWidth: '90vw',
        transform: `translate3d(calc(-50% + ${tx}px), calc(-50% + ${ty}px), 0) rotate(${rot}deg)`,
        transition: dragging ? 'none' : 'transform 220ms ease',
        perspective: 1000,
        userSelect: 'none',
        cursor: dragging ? 'grabbing' : 'grab',
        boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
        borderRadius: 12,
        overflow: 'hidden',
        background: '#fff',
        border: '1px solid #eee',
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={() => finish()}
      role="article"
      aria-label={`Profile card for ${user.name}`}
    >
      {user.imageUrl ? (
        <img
          src={user.imageUrl}
          alt={user.name}
          style={{ width: '100%', height: 200, objectFit: 'cover', display: 'block' }}
        />
      ) : (
        <div style={{ width: '100%', height: 200, background: '#f5f5f5' }} />
      )}

      <div style={{ padding: 12 }}>
        <h3 style={{ margin: '0 0 6px' }}>{user.name}</h3>
        {user.subject && <p style={{ margin: 0, color: '#666' }}>{user.subject}</p>}
        {user.bio && <p style={{ marginTop: 8 }}>{user.bio}</p>}

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
          <button
            onClick={() => finish('left')}
            style={{ padding: '8px 14px', background: '#fff', border: '1px solid #ddd', borderRadius: 6 }}
            aria-label="Nope"
          >
            Nope
          </button>
          <button
            onClick={() => finish('right')}
            style={{ padding: '8px 14px', background: '#0a84ff', color: '#fff', border: 'none', borderRadius: 6 }}
            aria-label="Like"
          >
            Like
          </button>
        </div>
      </div>
    </div>
  );
};

export default SwipeCard;