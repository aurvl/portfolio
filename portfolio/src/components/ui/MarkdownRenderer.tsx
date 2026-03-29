import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkDirective from 'remark-directive'
import type { Components } from 'react-markdown'
import type { ReactNode } from 'react'
import { useState } from 'react'

type MdContentRendererProps = {
  content: string
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button className="md-content__copy-btn" onClick={handleCopy}>
      {copied ? 'Copied!' : 'Copy'}
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

function visitTree(node: unknown, callback: (node: unknown) => void) {
  if (!node || typeof node !== 'object') return

  callback(node)

  const typedNode = node as { children?: unknown[] }

  if (Array.isArray(typedNode.children)) {
    typedNode.children.forEach((child) => visitTree(child, callback))
  }
}

function MdContentRenderer({ content }: MdContentRendererProps) {
  const components: Components = {
    h1: ({ children }) => (
      <h1 className="md-content__h1">{children}</h1>
    ),

    h2: ({ children }) => (
      <h2 className="md-content__h2">{children}</h2>
    ),

    h3: ({ children }) => (
      <h3 className="md-content__h3">{children}</h3>
    ),

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

    code: ({ className, children, ...props }) => {
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

        return (
            <div className="md-content__code-block-wrapper">
                <div className="md-content__code-header">
                    {language && (
                        <div className="md-content__code-lang">{language}</div>
                    )}
                    <CopyButton text={codeString} />
                </div>
                <pre className="md-content__code-block">
                    <code {...props}>{children}</code>
                </pre>
            </div>
        )
    },

    hr: () => <hr className="md-content__hr" />,

    div: ({ node, className, children, ...props }) => {
        const properties = (node as { properties?: Record<string, unknown> }).properties
        const isPanel = properties?.['data-panel'] === 'true'
        const title = String(properties?.['data-title'] ?? '')

        if (isPanel) {
            return (
            <div className={className} {...props}>
                {title && (
                <div className="md-content__panel-header">
                    {title}
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
        remarkPlugins={[remarkDirective, remarkPanelDirective, remarkGfm]}
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

export default MdContentRenderer