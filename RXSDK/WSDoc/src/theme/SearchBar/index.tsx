import React, { useState, useRef, useEffect } from 'react';
import { useHistory } from '@docusaurus/router';
import styles from './styles.module.css';

// ─── Component ─────────────────────────────────────────────────────
// 导航栏搜索入口：默认收起为图标按钮，点击/聚焦展开为输入框；
// Enter 跳转到全屏结果页 /search，失焦且为空时自动收起（类似抖音开放平台风格）
export default function SearchBar(): JSX.Element {
  const history = useHistory();
  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const expand = () => {
    setExpanded(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const collapseIfEmpty = () => {
    if (!query.trim()) setExpanded(false);
  };

  const close = () => {
    setQuery('');
    setExpanded(false);
    inputRef.current?.blur();
  };

  const submit = () => {
    const q = query.trim();
    if (!q) return;
    history.push(`/search?q=${encodeURIComponent(q)}`);
    setQuery('');
    setExpanded(false);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing) return;
    if (e.key === 'Enter') {
      e.preventDefault();
      submit();
    } else if (e.key === 'Escape') {
      setQuery('');
      inputRef.current?.blur();
      setExpanded(false);
    }
  };

  // Keyboard shortcut: Cmd/Ctrl+K to expand & focus the navbar search input
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        expand();
      }
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  // Collapse when clicking outside (only if input is empty)
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        collapseIfEmpty();
      }
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return (
    <div
      ref={containerRef}
      className={`${styles.searchBar} ${expanded ? styles.searchBarExpanded : ''}`}
    >
      {!expanded && (
        <button
          type="button"
          className={styles.iconBtn}
          onClick={expand}
          aria-label="搜索"
        >
          <svg className={styles.searchIcon} viewBox="0 0 20 20" width="16" height="16">
            <path d="M9 17A8 8 0 1 1 9 1a8 8 0 0 1 0 16ZM14 14l4 4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      )}
      <input
        ref={inputRef}
        type="text"
        className={styles.input}
        placeholder="搜索文档…"
        value={query}
        onChange={e => setQuery(e.target.value)}
        onCompositionEnd={e => setQuery((e.target as HTMLInputElement).value)}
        onFocus={() => setExpanded(true)}
        onKeyDown={handleKeyDown}
        onBlur={collapseIfEmpty}
        aria-label="搜索文档"
        tabIndex={expanded ? 0 : -1}
      />
      {expanded && (
        <>
          <button
            type="button"
            className={styles.submitIconBtn}
            onClick={submit}
            aria-label="搜索"
          >
            <svg className={styles.searchIcon} viewBox="0 0 20 20" width="16" height="16">
              <path d="M9 17A8 8 0 1 1 9 1a8 8 0 0 1 0 16ZM14 14l4 4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
          <span className={styles.divider} />
          <button
            type="button"
            className={styles.closeBtn}
            onClick={close}
            aria-label="关闭搜索"
          >
            <svg viewBox="0 0 16 16" width="13" height="13">
              <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        </>
      )}
    </div>
  );
}
