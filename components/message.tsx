'use client'

import { cn } from '@/lib/utils'
import 'katex/dist/katex.min.css'
import rehypeExternalLinks from 'rehype-external-links'
import rehypeKatex from 'rehype-katex'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import { Citing } from './custom-link'
import { CodeBlock } from './ui/codeblock'
import { MemoizedReactMarkdown } from './ui/markdown'

export function BotMessage({
  message,
  className
}: {
  message: string
  className?: string
}) {
  const containsLaTeX = /\\\[([\s\S]*?)\\\]|\\\(([\s\S]*?)\\\)/.test(message || '')
  const processedData = preprocessLaTeX(message || '')

  const baseComponents = {
    p: (props: any) => (
      <p className="text-sm leading-relaxed text-muted-foreground my-2" {...props} />
    ),
    h1: (props: any) => (
      <h1 className="text-xl font-bold txt-grad mt-4 mb-2 underline" {...props} />
    ),
    h2: (props: any) => (
      <h2 className="text-xl font-semibold txt-grad mt-3 mb-2 underline" {...props} />
    ),
    h3: (props: any) => (
      <h3 className="text-base font-semibold txt-grad mt-2 mb-1" {...props} />
    ),
    ul: (props: any) => (
      <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground" {...props} />
    ),
    ol: (props: any) => (
      <ol className="list-decimal pl-6 space-y-1 text-sm text-muted-foreground" {...props} />
    ),
    li: (props: any) => <li className="my-1" {...props} />,
    strong: (props: any) => <strong className="font-semibold text-foreground/70" {...props} />,
    em: (props: any) => <em className="italic text-muted-foreground" {...props} />,
    blockquote: (props: any) => (
      <blockquote className="border-l-4 border-accent pl-4 italic text-muted-foreground" {...props} />
    ),
    a: Citing,
    // Table components
    table: (props: any) => (
      <div className="my-4  overflow-x-auto max-w-[320px] md:max-w-2xl">
        <table className="min-w-full text-xs border border-border border-collapse" {...props} />
      </div>
    ),
    thead: (props: any) => (
      <thead className="bg-muted/50" {...props} />
    ),
    tbody: (props: any) => (
      <tbody {...props} />
    ),
    tr: (props: any) => (
      <tr className="border-b border-border text-center" {...props} />
    ),
    th: (props: any) => (
      <th
        className="border border-border px-4 py-2 text-center font-semibold text-sm bg-muted/30"
        {...props}
      />
    ),
    td: (props: any) => (
      <td
        className="border border-border px-4 py-2 text-center text-sm text-muted-foreground"
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
          <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono" {...props}>
            {children}
          </code>
        )
      }

      return (
        <CodeBlock
          key={Math.random()}
          language={(match && match[1]) || ''}
          value={String(children).replace(/\n$/, '')}
          {...props}
        />
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
  const blockProcessedContent = content.replace(/\\\[([\s\S]*?)\\\]/g, (_, eq) => `$$${eq}$$`)
  const inlineProcessedContent = blockProcessedContent.replace(/\\\(([\s\S]*?)\\\)/g, (_, eq) => `$${eq}$`)
  return inlineProcessedContent
}