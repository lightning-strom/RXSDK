import markdown from 'markdown-it'
import fs from 'fs-extra'
import hljs from 'highlight.js'
import 'highlight.js/lib/languages/typescript'
import 'highlight.js/lib/languages/json'
import Handlebars from 'handlebars'
import Anchor from 'markdown-it-anchor'
import TOC from 'markdown-it-table-of-contents'

const BASE_PATH = 'documents'

const md = new markdown({
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return '<pre class="hljs"><code>' +
          hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
          '</code></pre>'
      } catch (__) {}
    }

    return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>'
  },
})

md.use(Anchor)
const defaultLinkRender = md.renderer.rules.link_open || function(tokens, idx, options, env, self) {
  return self.renderToken(tokens, idx, options);
}
md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
  var aIndex = tokens[idx].attrIndex('target')

  if (aIndex < 0) {
    tokens[idx].attrPush(['target', '_blank'])
  } else {
    tokens[idx].attrs[aIndex][1] = '_blank'
  }
  return defaultLinkRender(tokens, idx, options, env, self);
}

const template = Handlebars.compile(fs.readFileSync('documents/layout.hbs').toString())
const style = fs.readFileSync('node_modules/highlight.js/styles/github-dark.css').toString()

function buildDocument (name) {
  const document = fs.readFileSync(`${BASE_PATH}/${name}.md`).toString()
  const content = md.render(parseTOCOptions(document))
  const title = document.match(/# (.*?)\n/)
  const result = template({
    content,
    style,
    title: (title && title[1]) || '',
  })
  fs.writeFileSync(`dist/${BASE_PATH}/${name}.html`, result)
}

function run () {
  fs.readdirSync(BASE_PATH)
    .filter(name => name.endsWith('.md'))
    .map(name => name.replace('.md', ''))
    .forEach(buildDocument)
}

function parseTOCOptions (document) {
  let options = { includeLevel: [2, 3, 4, 5] }
  return document.replace(/(\[\[toc\]\])(\{.*?\})\n/g, function (_, $1, $2) {
    try {
      options = JSON.parse($2)
    } catch (error) {} finally {
      md.use(TOC, options)
    }
    return $1 + '\n'
  })
}

export default function () {
  return {
    name: 'build-document',
    writeBundle: run,
  }
}
