import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import Head from '@docusaurus/Head';
import { useLocation, useHistory } from '@docusaurus/router';
import {
  AiResult,
  AiEvidence,
  StaticDoc,
  aiPathToRoute,
  highlight,
  fetchGitDocsQuery,
  streamGitDocsAnswer,
  loadStaticDocs,
  searchStaticDocs,
} from '@site/src/lib/gitdocsSearch';
import styles from './styles.module.css';

function useQueryParam(name: string): string {
  const location = useLocation();
  return useMemo(() => new URLSearchParams(location.search).get(name) || '', [location.search, name]);
}

export default function SearchPage(): JSX.Element {
  const history = useHistory();
  const urlQuery = useQueryParam('q');

  const [inputValue, setInputValue] = useState(urlQuery);
  const [searchedQuery, setSearchedQuery] = useState('');

  // Stage 1: 检索
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [aiResults, setAiResults] = useState<AiResult[]>([]);
  const [aiRewritten, setAiRewritten] = useState('');

  // Stage 2: 智能总结（流式）
  const [isAnswerLoading, setIsAnswerLoading] = useState(false);
  const [answerError, setAnswerError] = useState<string | null>(null);
  const [aiAnswer, setAiAnswer] = useState('');
  const [aiEvidence, setAiEvidence] = useState<AiEvidence[]>([]);

  const [staticDocs, setStaticDocs] = useState<StaticDoc[]>([]);

  const requestIdRef = useRef(0);

  useEffect(() => {
    loadStaticDocs().then(setStaticDocs);
  }, []);

  const runSearch = useCallback(async (q: string) => {
    const trimmed = q.trim();
    setSearchedQuery(trimmed);
    setAiAnswer(''); setAiEvidence([]); setAnswerError(null); setIsAnswerLoading(false);
    if (!trimmed) {
      setAiResults([]); setSearchError(null);
      return;
    }

    const requestId = ++requestIdRef.current;
    setIsSearching(true); setSearchError(null); setAiResults([]);

    // Stage 1: 快速检索，立即展示文档结果
    const outcome = await fetchGitDocsQuery(trimmed, requestId, requestIdRef);
    if (!outcome || requestId !== requestIdRef.current) return; // 被更新的搜索取代
    setIsSearching(false);

    if (!outcome.ok) {
      setSearchError(outcome.errorMessage);
      return;
    }
    setAiResults(outcome.results);
    setAiRewritten(outcome.rewrittenQuery);

    // Stage 2: 基于 query_id 流式生成智能总结，不重复检索
    if (outcome.queryId) {
      setIsAnswerLoading(true);
      await streamGitDocsAnswer(outcome.queryId, requestId, requestIdRef, {
        onDelta: (delta) => {
          if (requestId !== requestIdRef.current) return;
          setAiAnswer(prev => prev + delta);
        },
        onComplete: (answer, evidence) => {
          if (requestId !== requestIdRef.current) return;
          setAiAnswer(answer);
          setAiEvidence(evidence);
          setIsAnswerLoading(false);
        },
        onError: (message) => {
          if (requestId !== requestIdRef.current) return;
          setAnswerError(message);
          setIsAnswerLoading(false);
        },
      });
    }
  }, []);

  // Re-run search whenever the URL's ?q= changes (including on first load)
  useEffect(() => {
    setInputValue(urlQuery);
    runSearch(urlQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlQuery]);

  const submit = () => {
    const q = inputValue.trim();
    if (!q) return;
    history.push(`/search?q=${encodeURIComponent(q)}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing) return;
    if (e.key === 'Enter') {
      e.preventDefault();
      submit();
    }
  };

  const staticFallback = useMemo(() => {
    if (!searchedQuery) return [];
    // 仅当检索没有返回可用结果时，才用标题关键词匹配做补充兜底
    if (aiResults.length > 0) return [];
    return searchStaticDocs(staticDocs, searchedQuery);
  }, [searchedQuery, staticDocs, aiResults]);

  const breadcrumb = (r: AiResult) => {
    const parts = r.chapter_path?.split(' > ') || [];
    return parts.length > 1 ? parts.slice(0, -1).join(' › ') : r.file_name;
  };

  return (
    <Layout title={searchedQuery ? `搜索：${searchedQuery}` : '搜索'}>
      <Head>
        <meta name="robots" content="noindex" />
      </Head>
      <div className={styles.page}>
        <div className={styles.searchHeader}>
          <div className={styles.inputRow}>
            <svg className={styles.inputIcon} viewBox="0 0 20 20" width="20" height="20">
              <path d="M9 17A8 8 0 1 1 9 1a8 8 0 0 1 0 16ZM14 14l4 4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              className={styles.input}
              placeholder="输入问题，如「如何接入支付」"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onCompositionEnd={e => setInputValue((e.target as HTMLInputElement).value)}
              onKeyDown={handleKeyDown}
              autoFocus
            />
            <button type="button" className={styles.submitBtn} onClick={submit}>
              搜索
            </button>
          </div>
        </div>

        <div className={styles.body}>
          {!searchedQuery && (
            <div className={styles.empty}>
              <p className={styles.emptyTitle}>基于望舒文档知识库的 AI 智能搜索</p>
              <p className={styles.emptyHint}>输入自然语言问题，AI 将检索文档并生成总结</p>
              <div className={styles.hints}>
                {['如何接入支付', '鸿蒙快速开始', '登录回调处理', 'SDK 初始化配置'].map(hint => (
                  <button
                    key={hint}
                    className={styles.hintChip}
                    onClick={() => { setInputValue(hint); history.push(`/search?q=${encodeURIComponent(hint)}`); }}
                  >
                    {hint}
                  </button>
                ))}
              </div>
            </div>
          )}

          {isSearching && (
            <div className={styles.loadingState}>
              <span className={styles.spinner} />
              <span>正在检索文档…</span>
            </div>
          )}

          {!isSearching && searchError && <div className={styles.error}>{searchError}</div>}

          {/* 智能总结：检索完成后基于 query_id 流式生成，与文档列表并排展示在上方 */}
          {!isSearching && !searchError && (isAnswerLoading || aiAnswer || answerError) && (
            <div className={styles.answerCard}>
              <div className={styles.answerHeader}>
                <svg viewBox="0 0 16 16" width="14" height="14"><path d="M8 0l2 5h5l-4 3 1.5 5L8 10l-4.5 3L5 8 1 5h5z" fill="currentColor" /></svg>
                AI 回答
              </div>
              {aiRewritten && aiRewritten !== searchedQuery && (
                <div className={styles.rewritten}>理解为：{aiRewritten}</div>
              )}
              {answerError ? (
                <div className={styles.error}>{answerError}</div>
              ) : (
                <div className={styles.answerText}>
                  {aiAnswer ? (
                    <ReactMarkdown>{aiAnswer}</ReactMarkdown>
                  ) : (
                    isAnswerLoading ? '智能总结生成中…' : ''
                  )}
                  {isAnswerLoading && <span className={styles.answerCursor} />}
                </div>
              )}
              {aiEvidence.length > 0 && (
                <div className={styles.evidenceList}>
                  <div className={styles.evidenceLabel}>引用来源</div>
                  {aiEvidence.map(ev => (
                    <Link key={ev.citation_id} className={styles.evidenceItem} to={aiPathToRoute(ev.file_path)}>
                      <span className={styles.evidenceCite}>{ev.citation_id}</span>
                      <span className={styles.evidenceName}>{ev.file_name}</span>
                      <span className={styles.evidencePath}>{ev.chapter_path}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 相关文档：Stage 1 检索完成即展示，先于智能总结出现 */}
          {!isSearching && aiResults.length > 0 && (
            <div className={styles.resultSection}>
              <div className={styles.resultSectionTitle}>相关文档</div>
              {aiResults.map(r => (
                <Link
                  key={`${r.file_path}-${r.rank}`}
                  className={styles.resultItem}
                  to={aiPathToRoute(r.file_path)}
                >
                  <div className={styles.resultRow1}>
                    <span className={styles.resultFile}>{highlight(r.file_name, searchedQuery, styles.hl)}</span>
                    {r.heading && <span className={styles.resultHead}>{highlight(r.heading, searchedQuery, styles.hl)}</span>}
                  </div>
                  <div className={styles.resultRow2}>{breadcrumb(r)}</div>
                  <div className={styles.resultRow3}>{highlight(r.content_preview?.slice(0, 220) || '', searchedQuery, styles.hl)}</div>
                </Link>
              ))}
            </div>
          )}

          {!isSearching && !searchError && searchedQuery && aiResults.length === 0 && staticFallback.length === 0 && (
            <div className={styles.empty}>
              <p>未找到相关文档，试试换个关键词</p>
            </div>
          )}

          {!isSearching && staticFallback.length > 0 && (
            <div className={styles.resultSection}>
              <div className={styles.resultSectionTitle}>文档标题匹配</div>
              {staticFallback.map(doc => (
                <Link
                  key={doc.u}
                  className={styles.resultItem}
                  to={doc.u.startsWith('/') ? doc.u : decodeURIComponent(doc.u)}
                >
                  <div className={styles.resultRow1}>
                    <span className={styles.resultFile}>{highlight(doc.t, searchedQuery, styles.hl)}</span>
                  </div>
                  <div className={styles.resultRow2}>{highlight(doc.d?.slice(0, 160) || '', searchedQuery, styles.hl)}</div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
