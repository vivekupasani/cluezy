'use client'

import rehypeExternalLinks from 'rehype-external-links'
import rehypeKatex from 'rehype-katex'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'

import { cn } from '@/lib/utils'

import { Citing } from './custom-link'
import { CodeBlock } from './ui/codeblock'
import { MemoizedReactMarkdown } from './ui/markdown'

import 'katex/dist/katex.min.css'

export function BotMessage({
  message,
  className
}: {
  message: string
  className?: string
}) {
  const containsLaTeX = /\\\[([\s\S]*?)\\\]|\\\(([\s\S]*?)\\\)/.test(
    message || ''
  )
  const processedData = preprocessLaTeX(message || '')

  const baseComponents = {
    p: (props: any) => (
      <p
        className="text-base leading-6 text-foreground my-3 tracking-wide first:mt-0 last:mb-0"
        {...props}
      />
    ),
    h1: (props: any) => (
      <h1
        className="text-2xl font-bold txt-grad leading-tight tracking-wide mt-6 mb-2"
        {...props}
      />
    ),
    h2: (props: any) => (
      <h2
        className="text-xl font-semibold txt-grad leading-tight tracking-wide mt-5 mb-2"
        {...props}
      />
    ),
    h3: (props: any) => (
      <h3
        className="text-lg font-semibold txt-grad leading-tight tracking-wide mt-4 mb-1"
        {...props}
      />
    ),
    ul: (props: any) => (
      <ul
        className="list-disc pl-6 my-3 space-y-1 text-base leading-6 tracking-wide text-foreground"
        {...props}
      />
    ),
    ol: (props: any) => (
      <ol
        className="list-decimal pl-6 my-3 space-y-1 text-base leading-6 tracking-wide text-foreground"
        {...props}
      />
    ),
    li: ({ node, ordered, index, checked, ...props }: any) => (
      <li className="leading-6 tracking-wide" {...props} />
    ),
    strong: (props: any) => (
      <strong
        className="font-semibold text-foreground tracking-wide"
        {...props}
      />
    ),
    em: (props: any) => (
      <em className="italic text-foreground tracking-wide" {...props} />
    ),
    blockquote: (props: any) => (
      <blockquote
        className="border-l-4 border-primary bg-muted/30 pl-4 py-2 pr-2 rounded-r-lg italic text-foreground my-6 tracking-wide"
        {...props}
      />
    ),
    a: Citing,
    hr: (props: any) => (
      <hr className="my-6 border-t border-border" {...props} />
    ),
    img: (props: any) => (
      <img
        className="rounded-xl border border-border shadow-sm my-4 max-w-full h-auto"
        {...props}
      />
    ),
    // Table components
    table: (props: any) => (
      <div className="w-[90vw] md:w-full overflow-x-scroll my-6 rounded-xl border border-border bg-card">
        <table
          className="min-w-full divide-y divide-border text-sm tracking-wide rounded-lg"
          {...props}
        />
      </div>
    ),
    thead: (props: any) => (
      <thead className="bg-muted/50 tracking-wide" {...props} />
    ),
    tbody: (props: any) => (
      <tbody className="divide-y divide-border tracking-wide" {...props} />
    ),
    tr: (props: any) => (
      <tr className="hover:bg-muted/30 transition-colors" {...props} />
    ),
    th: (props: any) => (
      <th
        className="px-4 py-3 text-left font-semibold text-foreground bg-muted/30 tracking-wide"
        {...props}
      />
    ),
    td: (props: any) => (
      <td
        className="px-4 py-3 text-foreground/80 whitespace-nowrap tracking-wide"
        {...props}
      />
    ),
    code({ node, inline, className, children, ...props }: any) {
      if (children.length && children[0] === '▍') {
        return <span className="mt-1 cursor-default animate-pulse">▍</span>
      }

      const match = /language-(\w+)/.exec(className || '')
      if (inline) {
        return (
          <code
            className="bg-muted/80 px-1.5 py-0.5 rounded-md text-[0.85rem] font-mono text-foreground"
            {...props}
          >
            {children}
          </code>
        )
      }

      return (
        <div>
          <CodeBlock
            key={Math.random()}
            language={(match && match[1]) || ''}
            value={String(children).replace(/\n$/, '')}
            {...props}
          />
        </div>
      )
    }
  }

  return (
    <MemoizedReactMarkdown
      rehypePlugins={[
        [rehypeExternalLinks, { target: '_blank' }],
        ...(containsLaTeX ? [rehypeKatex] : [])
      ]}
      remarkPlugins={[remarkGfm, remarkMath]}
      className={cn('prose-sm prose-neutral max-w-none', className)}
      components={baseComponents}
    >
      {containsLaTeX ? processedData : message}
    </MemoizedReactMarkdown>
  )
}

// Preprocess LaTeX
const preprocessLaTeX = (content: string) => {
  const blockProcessedContent = content.replace(
    /\\\[([\s\S]*?)\\\]/g,
    (_, eq) => `$$${eq}$$`
  )
  const inlineProcessedContent = blockProcessedContent.replace(
    /\\\(([\s\S]*?)\\\)/g,
    (_, eq) => `$${eq}$`
  )
  return inlineProcessedContent
}
