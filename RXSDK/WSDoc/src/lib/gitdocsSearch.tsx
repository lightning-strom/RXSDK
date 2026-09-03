import React from 'react';

// ─── Config ────────────────────────────────────────────────────────
// 走 CORS 代理（proxy.mjs，监听 3002）。TODO: 待 Nginx 配置 /api/gitdocs/ 反代后改为同源相对路径
export const GITDOCS_API = typeof window !== 'undefined' && window.location.hostname !== 'localhost'
  ? `${window.location.protocol}//${window.location.hostname}:3002`
  : 'http://localhost:3002';
export const STATIC_INDEX_PATH = '/llms.txt';

// ─── Types ─────────────────────────────────────────────────────────
export interface AiResult {
  rank: number;
  file_name: string;
  file_path: string;
  heading: string;
  chapter_path: string;
  document_url: string;
  content_preview: string;
  semantic_score: number;
}

export interface AiEvidence {
  citation_id: string;
  source_rank: number;
  file_name: string;
  file_path: string;
  chapter_path: string;
  snippet: string;
  document_url: string;
}

interface QueryResponse {
  code: number;
  message: string;
  data: {
    query_id: string;
    query: string;
    rewritten_query: string;
    answer: string | null;
    answer_mode: string;
    total: number;
    results: AiResult[];
    answer_evidence: AiEvidence[];
  };
}

interface AnswerResponseData {
  query_id: string;
  query: string;
  rewritten_query: string;
  answer: string;
  answer_mode: string;
  answer_evidence: AiEvidence[];
}

export interface StaticDoc {
  t: string; // title
  u: string; // url
  d: string; // description
}

export interface QueryOutcome {
  ok: boolean;
  results: AiResult[];
  queryId: string | null;
  rewrittenQuery: string;
  errorMessage: string | null;
}

export interface AnswerStreamCallbacks {
  onDelta: (delta: string) => void;
  onComplete: (answer: string, evidence: AiEvidence[]) => void;
  onError: (message: string) => void;
}

// ─── Helpers ───────────────────────────────────────────────────────
export function aiPathToRoute(filePath: string): string {
  return filePath.replace(/^docs\//, '/docs/').replace(/\.mdx$/, '').replace(/\.md$/, '');
}

export function highlight(text: string, q: string, hlClassName: string): React.ReactNode {
  if (!q.trim()) return text;
  const terms = q.split(/\s+/).filter(t => t.length > 1);
  if (!terms.length) return text;
  const re = new RegExp(`(${terms.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');
  const testRe = new RegExp(re.source, 'i');
  return text.split(re).map((part, i) =>
    testRe.test(part) ? <mark key={i} className={hlClassName}>{part}</mark> : part
  );
}

// ─── Stage 1: 检索（不生成智能总结） ────────────────────────────────
export async function fetchGitDocsQuery(
  query: string,
  requestId: number,
  currentRequestIdRef: { current: number },
  topK = 8,
): Promise<QueryOutcome | null> {
  try {
    const res = await fetch(`${GITDOCS_API}/api/v1/kb/git-docs/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: query.trim(),
        top_k: topK,
        enable_answer: false,
        enable_query_understanding: true,
      }),
    });
    if (requestId !== currentRequestIdRef.current) return null;
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json: QueryResponse = await res.json();
    if (requestId !== currentRequestIdRef.current) return null;
    if (json.code !== 0) {
      return { ok: false, results: [], queryId: null, rewrittenQuery: '', errorMessage: json.message || '搜索失败' };
    }
    return {
      ok: true,
      results: json.data.results,
      queryId: json.data.query_id || null,
      rewrittenQuery: json.data.rewritten_query || '',
      errorMessage: null,
    };
  } catch {
    if (requestId !== currentRequestIdRef.current) return null;
    return { ok: false, results: [], queryId: null, rewrittenQuery: '', errorMessage: '搜索服务暂时不可用' };
  }
}

// ─── Stage 2a: 智能总结（非流式，兜底用） ────────────────────────────
export async function fetchGitDocsAnswer(
  queryId: string,
  requestId: number,
  currentRequestIdRef: { current: number },
): Promise<{ ok: boolean; answer: string; evidence: AiEvidence[]; errorMessage: string | null } | null> {
  try {
    const res = await fetch(`${GITDOCS_API}/api/v1/kb/git-docs/answer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query_id: queryId }),
    });
    if (requestId !== currentRequestIdRef.current) return null;
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json: { code: number; message: string; data: AnswerResponseData } = await res.json();
    if (requestId !== currentRequestIdRef.current) return null;
    if (json.code !== 0) {
      return { ok: false, answer: '', evidence: [], errorMessage: json.message || '智能总结生成失败' };
    }
    return { ok: true, answer: json.data.answer || '', evidence: json.data.answer_evidence || [], errorMessage: null };
  } catch {
    if (requestId !== currentRequestIdRef.current) return null;
    return { ok: false, answer: '', evidence: [], errorMessage: '智能总结服务暂时不可用' };
  }
}

function parseSseEvent(raw: string): { event: string | null; data: string | null } {
  let event: string | null = null;
  const dataLines: string[] = [];
  for (const line of raw.split('\n')) {
    if (line.startsWith('event:')) event = line.slice(6).trim();
    else if (line.startsWith('data:')) dataLines.push(line.slice(5).trim());
  }
  return { event, data: dataLines.length ? dataLines.join('\n') : null };
}

// ─── Stage 2b: 智能总结（流式，页面优先使用） ────────────────────────
export async function streamGitDocsAnswer(
  queryId: string,
  requestId: number,
  currentRequestIdRef: { current: number },
  callbacks: AnswerStreamCallbacks,
): Promise<void> {
  try {
    const res = await fetch(`${GITDOCS_API}/api/v1/kb/git-docs/answer/stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'text/event-stream' },
      body: JSON.stringify({ query_id: queryId }),
    });
    if (requestId !== currentRequestIdRef.current) return;
    if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (requestId !== currentRequestIdRef.current) return;
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      let sepIndex: number;
      while ((sepIndex = buffer.indexOf('\n\n')) !== -1) {
        const rawEvent = buffer.slice(0, sepIndex);
        buffer = buffer.slice(sepIndex + 2);
        const { event, data } = parseSseEvent(rawEvent);
        if (!event || data === null) continue;
        if (event === 'answer_delta') {
          try {
            const parsed = JSON.parse(data);
            callbacks.onDelta(parsed.delta || '');
          } catch {
            // 忽略无法解析的增量帧
          }
        } else if (event === 'answer_complete') {
          try {
            const parsed = JSON.parse(data);
            callbacks.onComplete(parsed.answer || '', parsed.answer_evidence || []);
          } catch {
            callbacks.onError('智能总结解析失败');
          }
        } else if (event === 'error') {
          try {
            const parsed = JSON.parse(data);
            callbacks.onError(parsed.message || '智能总结生成失败');
          } catch {
            callbacks.onError('智能总结生成失败');
          }
        }
        // answer_start / done 事件无需额外处理
      }
    }
  } catch {
    if (requestId === currentRequestIdRef.current) callbacks.onError('智能总结服务暂时不可用');
  }
}

// ─── 静态标题索引（llms.txt），仅作 AI 检索失败时的兜底 ──────────────
let staticDocsCache: StaticDoc[] | null = null;
let staticDocsPromise: Promise<StaticDoc[]> | null = null;

export function loadStaticDocs(): Promise<StaticDoc[]> {
  if (staticDocsCache) return Promise.resolve(staticDocsCache);
  if (staticDocsPromise) return staticDocsPromise;
  staticDocsPromise = fetch(STATIC_INDEX_PATH)
    .then(r => (r.ok ? r.text() : ''))
    .then((text: string) => {
      const docs: StaticDoc[] = [];
      const re = /^- \[([^\]]+)\]\(([^)]+)\):\s*(.*)$/gm;
      let m: RegExpExecArray | null;
      while ((m = re.exec(text)) !== null) {
        docs.push({ t: m[1], u: m[2].replace('https://docs.ruixueyun.com', ''), d: m[3] });
      }
      staticDocsCache = docs;
      return docs;
    })
    .catch(() => {
      staticDocsCache = [];
      return [];
    });
  return staticDocsPromise;
}

export function searchStaticDocs(docs: StaticDoc[], query: string, limit = 15): StaticDoc[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const terms = q.split(/\s+/).filter(t => t.length > 0);
  return docs
    .filter(doc => {
      const hay = (doc.t + ' ' + doc.d + ' ' + decodeURIComponent(doc.u)).toLowerCase();
      return terms.some(t => hay.includes(t));
    })
    .slice(0, limit);
}
