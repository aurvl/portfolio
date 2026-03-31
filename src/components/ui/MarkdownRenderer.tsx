import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkDirective from 'remark-directive'
import type { Components } from 'react-markdown'
import type { ReactNode } from 'react'
import { useState } from 'react'
import { LuCheck, LuChevronDown, LuChevronUp, LuCopy } from 'react-icons/lu'
import { GoLinkExternal } from 'react-icons/go'
import { createHeadingId } from '../../lib/getPost'

type MdContentRendererProps = {
  content: string
}

type CodeSnippet = {
  title: string
  language: string
  code: string
}

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    void navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      type="button"
      className="md-content__copy-btn"
      onClick={handleCopy}
      aria-label={copied ? `${label} copied` : label}
      title={copied ? 'Copied' : 'Copy code'}
    >
      {copied ? <LuCheck /> : <LuCopy />}
    </button>
  )
}

function remarkPanelDirective() {
  return (tree: { children?: unknown[] }) => {
    visitTree(tree, (node) => {
      const typedNode = node as {
        type?: string
        name?: string
        attributes?: Record<string, unknown>
        data?: {
          hName?: string
          hProperties?: Record<string, unknown>
        }
      }

      if (typedNode.type === 'containerDirective' && typedNode.name === 'panel') {
        const tone = String(typedNode.attributes?.tone ?? 'blue')
        const title = String(typedNode.attributes?.title ?? '')

        typedNode.data = {
          hName: 'div',
          hProperties: {
            className: ['md-content__panel', `md-content__panel--${tone}`],
            'data-panel': 'true',
            'data-tone': tone,
            'data-title': title,
          },
        }
      }
    })
  }
}

function remarkCodeGroupDirective() {
  return (tree: { children?: unknown[] }) => {
    visitTree(tree, (node) => {
      const typedNode = node as {
        type?: string
        name?: string
        children?: unknown[]
        data?: {
          hName?: string
          hProperties?: Record<string, unknown>
        }
      }

      if (
        typedNode.type !== 'containerDirective' ||
        typedNode.name !== 'codegroup' ||
        !Array.isArray(typedNode.children)
      ) {
        return
      }

      const snippets = typedNode.children
        .filter(isCodeBlockNode)
        .map((child, index) => serializeCodeSnippet(child, index))

      if (!snippets.length) {
        return
      }

      typedNode.children = []
      typedNode.data = {
        hName: 'div',
        hProperties: {
          className: ['md-content__code-group'],
          'data-code-group': 'true',
          'data-code-items': JSON.stringify(snippets),
        },
      }
    })
  }
}

function remarkInlineColor() {
  return (tree: { children?: unknown[] }) => {
    transformInlineColorNodes(tree)
  }
}

function remarkInlineMath() {
  return (tree: { children?: unknown[] }) => {
    transformInlineMathNodes(tree)
  }
}

function transformInlineColorNodes(node: unknown) {
  if (!node || typeof node !== 'object') return

  const typedNode = node as { children?: unknown[] }

  if (!Array.isArray(typedNode.children)) return

  typedNode.children = typedNode.children.flatMap((child) => {
    if (isTextNode(child)) {
      return splitTextNodeForColor(child.value ?? '')
    }

    transformInlineColorNodes(child)
    return [child]
  })
}

function transformInlineMathNodes(node: unknown) {
  if (!node || typeof node !== 'object') return

  const typedNode = node as { children?: unknown[] }

  if (!Array.isArray(typedNode.children)) return

  typedNode.children = typedNode.children.flatMap((child) => {
    if (isTextNode(child)) {
      return splitTextNodeForMath(child.value ?? '')
    }

    transformInlineMathNodes(child)
    return [child]
  })
}

function isTextNode(node: unknown): node is { type: 'text'; value?: string } {
  return Boolean(
    node &&
      typeof node === 'object' &&
      (node as { type?: string }).type === 'text'
  )
}

function splitTextNodeForMath(text: string): unknown[] {
  const nodes: unknown[] = []
  let cursor = 0

  while (cursor < text.length) {
    const start = findInlineMathDelimiter(text, cursor)

    if (start === -1) {
      if (cursor < text.length) {
        nodes.push({ type: 'text', value: text.slice(cursor) })
      }
      break
    }

    if (start > cursor) {
      nodes.push({ type: 'text', value: text.slice(cursor, start) })
    }

    const end = findInlineMathDelimiter(text, start + 1)

    if (end === -1) {
      nodes.push({ type: 'text', value: text.slice(start) })
      break
    }

    nodes.push({
      type: 'textDirective',
      name: 'math',
      children: [{ type: 'text', value: text.slice(start + 1, end) }],
      data: {
        hName: 'span',
        hProperties: {
          className: ['md-content__math-inline'],
          'data-math-inline': 'true',
        },
      },
    })

    cursor = end + 1
  }

  return nodes
}

function splitTextNodeForColor(text: string): unknown[] {
  const nodes: unknown[] = []
  let cursor = 0

  while (cursor < text.length) {
    const start = findInlineColorStart(text, cursor)

    if (start === -1) {
      if (cursor < text.length) {
        nodes.push({ type: 'text', value: text.slice(cursor) })
      }
      break
    }

    if (start > cursor) {
      nodes.push({ type: 'text', value: text.slice(cursor, start) })
    }

    const token = getInlineColorToken(text, start)

    if (!token) {
      nodes.push({ type: 'text', value: text.slice(start, start + 1) })
      cursor = start + 1
      continue
    }

    nodes.push({
      type: 'textDirective',
      name: 'color',
      children: [{ type: 'text', value: token.content }],
      data: {
        hName: 'span',
        hProperties: {
          className: ['md-content__color-inline', `md-content__color-inline--${token.color}`],
          'data-color-inline': 'true',
          'data-color-name': token.color,
        },
      },
    })

    cursor = token.endIndex
  }

  return nodes
}

function findInlineMathDelimiter(text: string, startIndex: number) {
  for (let index = startIndex; index < text.length; index += 1) {
    if (text[index] === '$' && text[index - 1] !== '\\') {
      return index
    }
  }

  return -1
}

function findInlineColorStart(text: string, startIndex: number) {
  const colors = ['red', 'blue', 'green', 'yellow', 'purple']

  for (let index = startIndex; index < text.length; index += 1) {
    if (text[index] !== '{') {
      continue
    }

    for (const color of colors) {
      if (text.startsWith(`{${color}}`, index)) {
        return index
      }
    }
  }

  return -1
}

function getInlineColorToken(text: string, startIndex: number) {
  const colors = ['red', 'blue', 'green', 'yellow', 'purple'] as const

  for (const color of colors) {
    const openTag = `{${color}}`
    const closeTag = `{/${color}}`

    if (!text.startsWith(openTag, startIndex)) {
      continue
    }

    const contentStart = startIndex + openTag.length
    const closeIndex = text.indexOf(closeTag, contentStart)

    if (closeIndex === -1) {
      return null
    }

    return {
      color,
      content: text.slice(contentStart, closeIndex),
      endIndex: closeIndex + closeTag.length,
    }
  }

  return null
}

function visitTree(node: unknown, callback: (node: unknown) => void) {
  if (!node || typeof node !== 'object') return

  callback(node)

  const typedNode = node as { children?: unknown[] }

  if (Array.isArray(typedNode.children)) {
    typedNode.children.forEach((child) => visitTree(child, callback))
  }
}

function CodeSurface({
  snippets,
  interactiveTabs,
}: {
  snippets: CodeSnippet[]
  interactiveTabs: boolean
}) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const safeIndex = Math.min(activeIndex, Math.max(snippets.length - 1, 0))
  const activeSnippet = snippets[safeIndex]
  const isFoldable = interactiveTabs

  if (!activeSnippet) {
    return null
  }

  return (
    <div className="md-content__code-shell">
      <div
        className={
          isCollapsed
            ? 'md-content__code-toolbar md-content__code-toolbar--collapsed'
            : 'md-content__code-toolbar'
        }
      >
        <div
          className="md-content__code-tabs"
          role={interactiveTabs ? 'tablist' : undefined}
          aria-label={interactiveTabs ? 'Code language variants' : undefined}
        >
          {interactiveTabs
            ? snippets.map((snippet, index) => (
                <button
                  key={`${snippet.title}-${snippet.language}-${index}`}
                  type="button"
                  role="tab"
                  className={
                    index === safeIndex
                      ? 'md-content__code-tab md-content__code-tab--active'
                      : 'md-content__code-tab'
                  }
                  aria-selected={index === safeIndex}
                  onClick={() => setActiveIndex(index)}
                >
                  {snippet.title}
                </button>
              ))
            : (
                <div className="md-content__code-tab md-content__code-tab--active">
                  {activeSnippet.title}
                </div>
              )}
        </div>
        <div className="md-content__code-actions">
          {isFoldable && (
            <button
              type="button"
              className="md-content__code-fold-btn"
              aria-label={isCollapsed ? 'Expand code group' : 'Collapse code group'}
              title={isCollapsed ? 'Expand code group' : 'Collapse code group'}
              aria-expanded={!isCollapsed}
              onClick={() => setIsCollapsed((current) => !current)}
            >
              {isCollapsed ? <LuChevronDown /> : <LuChevronUp />}
            </button>
          )}
          <CopyButton
            text={activeSnippet.code}
            label={`Copy ${activeSnippet.title} code`}
          />
        </div>
      </div>
      {!isCollapsed && (
        <pre className="md-content__code-block">
          <code className="md-content__code">
            {renderCodeLines(activeSnippet.code, activeSnippet.language)}
          </code>
        </pre>
      )}
    </div>
  )
}

function MdContentRenderer({ content }: MdContentRendererProps) {
  const components: Components = {
    h1: ({ children }) => {
      const id = createHeadingId(flattenReactNodeToString(children))
      return <h1 id={id} className="md-content__h1">{children}</h1>
    },

    h2: ({ children }) => {
      const id = createHeadingId(flattenReactNodeToString(children))
      return <h2 id={id} className="md-content__h2">{children}</h2>
    },

    h3: ({ children }) => {
      const id = createHeadingId(flattenReactNodeToString(children))
      return <h3 id={id} className="md-content__h3">{children}</h3>
    },

    p: ({ children }) => (
      <p className="md-content__p">{children}</p>
    ),

    a: ({ href, children }) => (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="md-content__link"
      >
        {children}
        <GoLinkExternal className="ml-1 inline align-middle" />
      </a>
    ),

    img: ({ src, alt }) => (
      <img
        src={src ?? ''}
        alt={alt ?? ''}
        className="md-content__img"
      />
    ),

    blockquote: ({ children }) => (
      <blockquote className="md-content__blockquote">
        {children}
      </blockquote>
    ),

    ul: ({ children }) => (
      <ul className="md-content__ul">{children}</ul>
    ),

    ol: ({ children }) => (
      <ol className="md-content__ol">{children}</ol>
    ),

    li: ({ children }) => {
      const extracted = extractCustomListItem(children)

      if (extracted?.type === 'done') {
        return (
          <li className="md-content__li md-content__li--done">
            <span className="md-content__li-badge md-content__li-badge--done">
              ✓
            </span>
            <span>{extracted.content}</span>
          </li>
        )
      }

      if (extracted?.type === 'avoid') {
        return (
          <li className="md-content__li md-content__li--avoid">
            <span className="md-content__li-badge md-content__li-badge--avoid">
              ×
            </span>
            <span>{extracted.content}</span>
          </li>
        )
      }

      return <li className="md-content__li">{children}</li>
    },

    table: ({ children }) => (
      <div className="md-content__table-wrapper">
        <table className="md-content__table">{children}</table>
      </div>
    ),

    thead: ({ children }) => (
      <thead className="md-content__thead">{children}</thead>
    ),

    tbody: ({ children }) => (
      <tbody className="md-content__tbody">{children}</tbody>
    ),

    tr: ({ children }) => (
      <tr className="md-content__tr">{children}</tr>
    ),

    th: ({ children }) => (
      <th className="md-content__th">{children}</th>
    ),

    td: ({ children }) => (
      <td className="md-content__td">{children}</td>
    ),

    span: ({ className, children, ...props }) => {
      const classNameString = Array.isArray(className)
        ? className.join(' ')
        : typeof className === 'string'
          ? className
          : ''

      if (classNameString.includes('md-content__math-inline')) {
        const mathText = flattenReactNodeToString(children)

        return (
          <span className="md-content__math-inline" {...props}>
            {renderInlineMath(mathText)}
          </span>
        )
      }

      return (
        <span className={classNameString || undefined} {...props}>
          {children}
        </span>
      )
    },

    code: ({ node, className, children }) => {
      const isInline = !className
      const language = className?.replace('language-', '') ?? ''

      if (isInline) {
        return (
          <code className="md-content__inline-code">
            {children}
          </code>
        )
      }

      const codeString = String(children).replace(/\n$/, '')
      const meta = extractCodeMeta(node)
      const title = extractCodeTitle(meta) || formatLanguageLabel(language)

      return (
        <CodeSurface
          snippets={[
            {
              title,
              language,
              code: codeString,
            },
          ]}
          interactiveTabs={false}
        />
      )
    },

    hr: () => <hr className="md-content__hr" />,

    div: ({ node, className, children, ...props }) => {
        const properties = (node as { properties?: Record<string, unknown> }).properties
        const isCodeGroup = readNodeProperty(properties, 'data-code-group') === 'true'
        const codeItems = String(readNodeProperty(properties, 'data-code-items') ?? '[]')
        const isPanel = readNodeProperty(properties, 'data-panel') === 'true'
        const title = String(readNodeProperty(properties, 'data-title') ?? '')

        if (isCodeGroup) {
            return (
            <div className={className} {...props}>
                <CodeSurface
                snippets={parseCodeGroup(codeItems)}
                interactiveTabs
                />
            </div>
            )
        }

        if (isPanel) {
            const renderedTitle = renderInlineTitle(title)

            return (
            <div className={className} {...props}>
                {title && (
                <div className="md-content__panel-header">
                    {renderedTitle}
                </div>
                )}
                <div className="md-content__panel-body">
                {children}
                </div>
            </div>
            )
        }

        return (
            <div className={className} {...props}>
            {children}
            </div>
        )
    },
  }

  return (
    <div className="md-content">
      <ReactMarkdown
        remarkPlugins={[remarkDirective, remarkPanelDirective, remarkCodeGroupDirective, remarkInlineColor, remarkInlineMath, remarkGfm]}
        components={components}
        >
        {content}
      </ReactMarkdown>
    </div>
  )
}

function extractCustomListItem(children: ReactNode): {
  type: 'done' | 'avoid'
  content: string
} | null {
  const text = flattenReactNodeToString(children).trim()

  if (text.startsWith('[v] ')) {
    return {
      type: 'done',
      content: text.replace(/^\[v\]\s*/, ''),
    }
  }

  if (text.startsWith('[!] ')) {
    return {
      type: 'avoid',
      content: text.replace(/^\[!\]\s*/, ''),
    }
  }

  return null
}

function flattenReactNodeToString(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') {
    return String(node)
  }

  if (Array.isArray(node)) {
    return node.map(flattenReactNodeToString).join('')
  }

  if (node && typeof node === 'object' && 'props' in node) {
    const props = (node as { props?: { children?: ReactNode } }).props
    return flattenReactNodeToString(props?.children ?? '')
  }

  return ''
}

function renderCodeLines(code: string, language: string) {
  const lines = code.split('\n')

  return lines.map((line, index) => (
    <span className="md-content__code-line" key={`line-${language}-${index}`}>
      <span className="md-content__code-line-number">
        {index + 1}
      </span>
      <span className="md-content__code-line-content">
        {highlightCodeLine(line, language, index)}
      </span>
    </span>
  ))
}

function highlightCodeLine(line: string, language: string, keySeed: number) {
  const tokenizer = getCodeTokenizer(language)

  if (!tokenizer) {
    return line || ' '
  }

  const parts: ReactNode[] = []
  let cursor = 0
  let tokenIndex = 0
  let match: RegExpExecArray | null
  const pattern = new RegExp(tokenizer.pattern.source, tokenizer.pattern.flags)

  while ((match = pattern.exec(line)) !== null) {
    if (match.index > cursor) {
      parts.push(line.slice(cursor, match.index))
    }

    const value = match[0]
    const tokenType = classifyCodeToken(value, tokenizer)

    parts.push(
      <span
        key={`token-${language}-${keySeed}-${tokenIndex}`}
        className={`md-content__code-token md-content__code-token--${tokenType}`}
      >
        {value}
      </span>
    )

    cursor = match.index + value.length
    tokenIndex += 1
  }

  if (cursor < line.length) {
    parts.push(line.slice(cursor))
  }

  return parts.length ? parts : ' '
}

function getCodeTokenizer(language: string) {
  const normalizedLanguage = normalizeLanguage(language)

  if (['ts', 'tsx', 'js', 'jsx', 'mjs', 'cjs'].includes(normalizedLanguage)) {
    return buildCodeTokenizer({
      comment: /\/\/.*$/,
      keywords: [
        'import',
        'from',
        'export',
        'default',
        'const',
        'let',
        'var',
        'function',
        'return',
        'if',
        'else',
        'await',
        'async',
        'new',
        'class',
        'extends',
        'try',
        'catch',
        'finally',
        'throw',
        'interface',
        'type',
        'true',
        'false',
        'null',
        'undefined',
      ],
    })
  }

  if (['py', 'python'].includes(normalizedLanguage)) {
    return buildCodeTokenizer({
      comment: /#.*$/,
      keywords: [
        'def',
        'return',
        'if',
        'elif',
        'else',
        'for',
        'while',
        'in',
        'import',
        'from',
        'as',
        'class',
        'try',
        'except',
        'finally',
        'with',
        'yield',
        'await',
        'async',
        'True',
        'False',
        'None',
      ],
    })
  }

  if (['sql'].includes(normalizedLanguage)) {
    return buildCodeTokenizer({
      comment: /--.*$/,
      keywords: [
        'select',
        'from',
        'where',
        'group',
        'by',
        'order',
        'limit',
        'join',
        'left',
        'right',
        'inner',
        'outer',
        'on',
        'as',
        'case',
        'when',
        'then',
        'else',
        'end',
        'and',
        'or',
        'not',
        'count',
        'sum',
        'avg',
        'min',
        'max',
      ],
      flags: 'gi',
    })
  }

  if (['json'].includes(normalizedLanguage)) {
    return buildCodeTokenizer({
      keywords: ['true', 'false', 'null'],
    })
  }

  if (['bash', 'sh', 'shell', 'zsh'].includes(normalizedLanguage)) {
    return buildCodeTokenizer({
      comment: /#.*$/,
      keywords: [
        'if',
        'then',
        'else',
        'fi',
        'for',
        'do',
        'done',
        'case',
        'esac',
        'in',
        'function',
        'export',
      ],
    })
  }

  return null
}

function buildCodeTokenizer({
  comment,
  keywords,
  flags = 'g',
}: {
  comment?: RegExp
  keywords: string[]
  flags?: string
}) {
  const segments = [
    comment?.source,
    /"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`/.source,
    /\b\d+(?:\.\d+)?\b/.source,
    keywords.length
      ? `\\b(?:${keywords.map(escapeForRegex).join('|')})\\b`
      : '',
  ].filter(Boolean)

  return {
    pattern: new RegExp(segments.join('|'), flags),
    comment: comment ? new RegExp(`^${comment.source}$`, flags.replace('g', '')) : null,
    string: /^(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)$/,
    number: /^\d+(?:\.\d+)?$/,
    keyword: keywords.length
      ? new RegExp(`^\\b(?:${keywords.map(escapeForRegex).join('|')})\\b$`, flags.replace('g', ''))
      : null,
  }
}

function classifyCodeToken(
  value: string,
  tokenizer: {
    comment: RegExp | null
    string: RegExp
    number: RegExp
    keyword: RegExp | null
  }
) {
  if (tokenizer.comment?.test(value)) {
    return 'comment'
  }

  if (tokenizer.string.test(value)) {
    return 'string'
  }

  if (tokenizer.number.test(value)) {
    return 'number'
  }

  if (tokenizer.keyword?.test(value)) {
    return 'keyword'
  }

  return 'plain'
}

function renderInlineMath(expression: string): ReactNode[] {
  const result: ReactNode[] = []
  let cursor = 0
  let keyIndex = 0

  while (cursor < expression.length) {
    const fractionStart = expression.indexOf('\\frac{', cursor)

    if (fractionStart === -1) {
      result.push(...renderMathScripts(expression.slice(cursor), keyIndex))
      break
    }

    if (fractionStart > cursor) {
      result.push(...renderMathScripts(expression.slice(cursor, fractionStart), keyIndex))
      keyIndex += 100
    }

    const parsedFraction = parseFraction(expression, fractionStart)

    if (!parsedFraction) {
      result.push(...renderMathScripts(expression.slice(fractionStart, fractionStart + 6), keyIndex))
      cursor = fractionStart + 6
      keyIndex += 10
      continue
    }

    result.push(
      <span className="md-content__math-frac" key={`frac-${keyIndex}`}>
        <span className="md-content__math-frac-num">
          {renderMathScripts(parsedFraction.numerator, keyIndex + 1)}
        </span>
        <span className="md-content__math-frac-bar" aria-hidden="true" />
        <span className="md-content__math-frac-den">
          {renderMathScripts(parsedFraction.denominator, keyIndex + 2)}
        </span>
      </span>
    )

    cursor = parsedFraction.endIndex
    keyIndex += 3
  }

  return result
}

function renderInlineTitle(text: string): ReactNode {
  if (!text.includes('$')) {
    return text
  }

  const nodes: ReactNode[] = []
  let cursor = 0
  let keyIndex = 0

  while (cursor < text.length) {
    const start = findInlineMathDelimiter(text, cursor)

    if (start === -1) {
      if (cursor < text.length) {
        nodes.push(text.slice(cursor))
      }
      break
    }

    if (start > cursor) {
      nodes.push(text.slice(cursor, start))
    }

    const end = findInlineMathDelimiter(text, start + 1)

    if (end === -1) {
      nodes.push(text.slice(start))
      break
    }

    nodes.push(
      <span className="md-content__math-inline" key={`panel-math-${keyIndex}`}>
        {renderInlineMath(text.slice(start + 1, end))}
      </span>
    )

    cursor = end + 1
    keyIndex += 1
  }

  return nodes
}

function renderMathScripts(text: string, keySeed = 0): ReactNode[] {
  const nodes: ReactNode[] = []
  const pattern = /([A-Za-z0-9)])(\^|_)(\{([^{}]+)\}|[A-Za-z0-9:+\-*/.]+)/g
  let cursor = 0
  let match: RegExpExecArray | null
  let keyIndex = keySeed

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > cursor) {
      nodes.push(text.slice(cursor, match.index))
    }

    const base = match[1]
    const operator = match[2]
    const script = match[4] ?? match[3].replace(/^\{|\}$/g, '')

    nodes.push(
      <span className="md-content__math-term" key={`math-${keyIndex}`}>
        <span className="md-content__math-base">{base}</span>
        {operator === '^' ? (
          <sup className="md-content__math-sup">{script}</sup>
        ) : (
          <sub className="md-content__math-sub">{script}</sub>
        )}
      </span>
    )

    cursor = match.index + match[0].length
    keyIndex += 1
  }

  if (cursor < text.length) {
    nodes.push(text.slice(cursor))
  }

  return nodes
}

function parseFraction(text: string, startIndex: number) {
  const numeratorStart = startIndex + '\\frac'.length
  if (text[numeratorStart] !== '{') return null

  const numeratorEnd = findMatchingBrace(text, numeratorStart)
  if (numeratorEnd === -1) return null

  const denominatorStart = numeratorEnd + 1
  if (text[denominatorStart] !== '{') return null

  const denominatorEnd = findMatchingBrace(text, denominatorStart)
  if (denominatorEnd === -1) return null

  return {
    numerator: text.slice(numeratorStart + 1, numeratorEnd),
    denominator: text.slice(denominatorStart + 1, denominatorEnd),
    endIndex: denominatorEnd + 1,
  }
}

function findMatchingBrace(text: string, openIndex: number) {
  let depth = 0

  for (let index = openIndex; index < text.length; index += 1) {
    if (text[index] === '{') {
      depth += 1
    } else if (text[index] === '}') {
      depth -= 1

      if (depth === 0) {
        return index
      }
    }
  }

  return -1
}

function isCodeBlockNode(
  node: unknown
): node is { type: 'code'; lang?: string; meta?: string; value?: string } {
  return Boolean(
    node &&
      typeof node === 'object' &&
      (node as { type?: string }).type === 'code'
  )
}

function serializeCodeSnippet(
  node: { lang?: string; meta?: string; value?: string },
  index: number
): CodeSnippet {
  const language = node.lang ?? ''

  return {
    title:
      extractCodeTitle(node.meta ?? '') ||
      formatLanguageLabel(language) ||
      `Snippet ${index + 1}`,
    language,
    code: node.value ?? '',
  }
}

function extractCodeMeta(node: unknown) {
  if (!node || typeof node !== 'object') {
    return ''
  }

  const typedNode = node as {
    data?: { meta?: string }
    properties?: { metastring?: string }
  }

  if (typeof typedNode.data?.meta === 'string') {
    return typedNode.data.meta
  }

  if (typeof typedNode.properties?.metastring === 'string') {
    return typedNode.properties.metastring
  }

  return ''
}

function extractCodeTitle(meta: string) {
  const match = /(?:^|\s)(?:title|label)=["']([^"']+)["']/.exec(meta)
  return match?.[1]?.trim() ?? ''
}

function parseCodeGroup(serializedItems: string): CodeSnippet[] {
  try {
    const parsed = JSON.parse(serializedItems) as unknown

    if (!Array.isArray(parsed)) {
      return []
    }

    return parsed.flatMap((item) => {
      if (
        item &&
        typeof item === 'object' &&
        typeof (item as { title?: unknown }).title === 'string' &&
        typeof (item as { language?: unknown }).language === 'string' &&
        typeof (item as { code?: unknown }).code === 'string'
      ) {
        return [item as CodeSnippet]
      }

      return []
    })
  } catch {
    return []
  }
}

function normalizeLanguage(language: string) {
  return language.trim().toLowerCase()
}

function formatLanguageLabel(language: string) {
  const normalizedLanguage = normalizeLanguage(language)

  switch (normalizedLanguage) {
    case 'ts':
    case 'tsx':
      return 'TypeScript'
    case 'js':
    case 'jsx':
      return 'JavaScript'
    case 'py':
      return 'Python'
    case 'json':
      return 'JSON'
    case 'sql':
      return 'SQL'
    case 'bash':
    case 'sh':
      return 'Shell'
    case 'md':
      return 'Markdown'
    case 'yml':
    case 'yaml':
      return 'YAML'
    default:
      return normalizedLanguage ? normalizedLanguage.toUpperCase() : 'Code'
  }
}

function escapeForRegex(text: string) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function readNodeProperty(
  properties: Record<string, unknown> | undefined,
  key: string
) {
  if (!properties) {
    return undefined
  }

  if (key in properties) {
    return properties[key]
  }

  const camelKey = key.replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase())
  return properties[camelKey]
}

export default MdContentRenderer
