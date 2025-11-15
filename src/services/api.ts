export interface StudyPartner {
  id: string;
  name: string;
  subject?: string;
  bio?: string;
  imageUrl?: string;
}

const API_BASE = (import.meta.env.VITE_API_BASE as string) || '';

const full = (path: string) => (API_BASE ? `${API_BASE}${path}` : path);

const parseJsonSafely = async (res: Response) => {
  const text = await res.text();
  const ct = res.headers.get('content-type') || '';
  if (!res.ok) {
    throw new Error(text.slice(0, 300) || `HTTP ${res.status}`);
  }
  if (!ct.includes('application/json')) {
    throw new Error(`Expected JSON but got ${ct}. Body: ${text.slice(0, 300)}`);
  }
  return JSON.parse(text);
};

export const getStudyPartners = async (signal?: AbortSignal): Promise<StudyPartner[]> => {
  const res = await fetch(full('/api/study-partners'), { signal });
  return parseJsonSafely(res);
};

export const postSwipe = async (userId: string, direction: 'left' | 'right') => {
  const res = await fetch(full(`/api/study-partners/${encodeURIComponent(userId)}/swipe`), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ direction }),
  });
  return parseJsonSafely(res);
};