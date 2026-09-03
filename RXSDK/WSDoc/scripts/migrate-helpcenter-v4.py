#!/usr/bin/env python3
"""
Migrate 帮助中心 v4.0 from old doc system CSV to Docusaurus .mdx files.

Usage:
  python3 scripts/migrate-helpcenter-v4.py [--dry-run]

Reads from: old_bak/menu.csv, old_bak/article.csv
Writes to:  docs/帮助中心/
"""
import csv
import sys
import os
import re
import json
import argparse

csv.field_size_limit(sys.maxsize)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OLD_DIR = os.path.join(BASE_DIR, 'old_bak')
DOCS_DIR = os.path.join(BASE_DIR, 'docs', '帮助中心')

HC_CODE = '4c17ef49-1834-494f-82fc-fe829a563580'
V40_CODE = '4bc8ed93-421a-4eac-9508-2f13f4e5fd69'
V40_PATH_PREFIX = f'{HC_CODE}/{V40_CODE}'


def sanitize_filename(name: str) -> str:
    """Sanitize a string for use as filename/dirname."""
    # Replace problematic chars
    name = name.replace('/', '-')
    name = name.replace('\\', '-')
    name = name.replace(':', '-')
    name = name.replace('*', '')
    name = name.replace('?', '')
    name = name.replace('"', '')
    name = name.replace('<', '')
    name = name.replace('>', '')
    name = name.replace('|', '-')
    name = name.replace('&', '-')
    name = name.strip()
    return name


def fix_markdown_for_mdx(md: str) -> str:
    """Fix markdown content for MDX compatibility."""
    # Escape curly braces that aren't in code blocks (MDX JSX)
    # Simple approach: escape { and } that appear in text (not code fences)
    lines = md.split('\n')
    in_code = False
    result = []
    for line in lines:
        if line.strip().startswith('```'):
            in_code = not in_code
            result.append(line)
            continue
        if not in_code:
            # Escape { and } for MDX, but not in inline code
            parts = []
            in_inline_code = False
            i = 0
            while i < len(line):
                c = line[i]
                if c == '`':
                    in_inline_code = not in_inline_code
                    parts.append(c)
                elif c == '{' and not in_inline_code:
                    parts.append('\\{')
                elif c == '}' and not in_inline_code:
                    parts.append('\\}')
                else:
                    parts.append(c)
                i += 1
            result.append(''.join(parts))
        else:
            result.append(line)
    return '\n'.join(result)


def build_menu_tree():
    """Parse menu.csv and build v4.0 tree."""
    items = []
    with open(os.path.join(OLD_DIR, 'menu.csv'), 'r') as f:
        reader = csv.reader(f)
        header = next(reader)
        for row in reader:
            menu_path = row[13] if len(row) > 13 else ''
            if not menu_path.startswith(V40_PATH_PREFIX):
                continue
            # Skip v4.0 root itself
            if row[11] == V40_CODE:
                continue
            name = row[7]
            code = row[11]
            parent = row[12]
            level = int(row[14]) if row[14] else 0
            mtype = row[10]  # 1=folder, 2=article
            sort = int(row[19]) if len(row) > 19 and row[19] else 999
            items.append({
                'name': name,
                'code': code,
                'parent': parent,
                'level': level,
                'type': mtype,
                'sort': sort,
            })
    return items


def load_articles():
    """Parse article.csv and index by menu_code."""
    articles = {}
    with open(os.path.join(OLD_DIR, 'article.csv'), 'r') as f:
        reader = csv.reader(f)
        header = next(reader)
        for row in reader:
            menu_code = row[7] if len(row) > 7 else ''
            title = row[9] if len(row) > 9 else ''
            desc = row[10] if len(row) > 10 else ''
            md = row[14] if len(row) > 14 else ''
            html = row[13] if len(row) > 13 else ''
            sort = int(row[16]) if len(row) > 16 and row[16] else 999
            articles[menu_code] = {
                'title': title,
                'desc': desc,
                'md': md,
                'html': html,
                'sort': sort,
            }
    return articles


def compute_path(item, items_by_code):
    """Compute relative directory path from menu tree."""
    path_parts = []
    current = item
    while current['code'] != V40_CODE:
        path_parts.append(current)
        parent_code = current['parent']
        if parent_code == V40_CODE:
            break
        current = items_by_code.get(parent_code)
        if not current:
            break
    path_parts.reverse()
    return path_parts


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--dry-run', action='store_true', help='Preview without writing')
    args = parser.parse_args()

    print('📂 Loading menu tree...')
    menu_items = build_menu_tree()
    items_by_code = {m['code']: m for m in menu_items}
    folders = [m for m in menu_items if m['type'] == '1']
    articles_menu = [m for m in menu_items if m['type'] == '2']
    print(f'   {len(folders)} directories, {len(articles_menu)} article menu items')

    print('📄 Loading articles...')
    articles = load_articles()
    print(f'   {len(articles)} articles in CSV')

    # Create docs directory
    if not args.dry_run:
        os.makedirs(DOCS_DIR, exist_ok=True)

    # Track stats
    written = 0
    skipped = 0
    dirs_created = set()
    category_files = {}  # dir_path -> list of {sort, name, type}

    # Process folders: create directories + _category_.json
    for folder in sorted(folders, key=lambda x: (x['level'], x['sort'])):
        path_parts = compute_path(folder, items_by_code)
        dir_path = os.path.join(DOCS_DIR, *[sanitize_filename(p['name']) for p in path_parts])
        dir_rel = os.path.relpath(dir_path, DOCS_DIR)

        if dir_path not in dirs_created:
            if not args.dry_run:
                os.makedirs(dir_path, exist_ok=True)
            dirs_created.add(dir_path)

            # Write _category_.json
            cat = {
                'label': folder['name'],
                'position': folder['sort'],
                'collapsed': True,
            }
            cat_path = os.path.join(dir_path, '_category_.json')
            if not args.dry_run:
                with open(cat_path, 'w', encoding='utf-8') as f:
                    json.dump(cat, f, ensure_ascii=False, indent=2)

        # Register in parent category
        parent_dir = os.path.dirname(dir_path)
        parent_rel = os.path.relpath(parent_dir, DOCS_DIR) if parent_dir != dir_path else ''
        if parent_rel not in category_files:
            category_files[parent_rel] = []
        category_files[parent_rel].append({
            'sort': folder['sort'],
            'name': folder['name'],
            'type': 'dir',
        })

    # Process articles: create .mdx files
    for article_item in sorted(articles_menu, key=lambda x: (x['level'], x['sort'])):
        code = article_item['code']
        art = articles.get(code)

        # Compute directory
        parent_code = article_item['parent']
        parent_item = items_by_code.get(parent_code)
        if parent_item:
            path_parts = compute_path(parent_item, items_by_code)
            dir_path = os.path.join(DOCS_DIR, *[sanitize_filename(p['name']) for p in path_parts])
        else:
            dir_path = DOCS_DIR

        dir_rel = os.path.relpath(dir_path, DOCS_DIR) if dir_path != DOCS_DIR else ''

        # Ensure directory exists
        if dir_path not in dirs_created:
            if not args.dry_run:
                os.makedirs(dir_path, exist_ok=True)
            dirs_created.add(dir_path)

        # Get content
        title = art['title'] if art else article_item['name']
        md = art['md'] if art else ''
        desc = art['desc'] if art else ''
        sort = article_item['sort']

        if not md or len(md.strip()) < 5:
            skipped += 1
            continue

        # Sanitize filename
        filename = sanitize_filename(article_item['name'])
        filepath = os.path.join(dir_path, f'{filename}.mdx')

        # Fix MDX issues
        md = fix_markdown_for_mdx(md)

        # Build frontmatter
        desc_clean = desc.replace('"', "'")[:120] if desc else f'望舒帮助中心 {title} 文档'
        frontmatter = f"""---
sidebar_position: {sort}
title: "{title}"
description: "{desc_clean}"
---

"""

        if not args.dry_run:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(frontmatter + md)

        written += 1

        # Register in parent category
        if dir_rel not in category_files:
            category_files[dir_rel] = []
        category_files[dir_rel].append({
            'sort': sort,
            'name': article_item['name'],
            'type': 'file',
        })

    print(f'\n✅ 迁移完成!')
    print(f'   写入: {written} 个 .mdx 文件')
    print(f'   跳过: {skipped} 个（空内容）')
    print(f'   目录: {len(dirs_created)} 个')
    if args.dry_run:
        print(f'\n   ⚠️  --dry-run 模式，未实际写入文件')


if __name__ == '__main__':
    main()
