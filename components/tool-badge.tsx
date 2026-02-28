import React from 'react'

import {
  BookOpen,
  FileText,
  Film,
  Link,
  Presentation,
  Search
} from 'lucide-react'

import { Badge } from './ui/badge'

type ToolBadgeProps = {
  tool: string
  children: React.ReactNode
  className?: string
}

export const ToolBadge: React.FC<ToolBadgeProps> = ({
  tool,
  children,
  className
}) => {
  const icon: Record<string, React.ReactNode> = {
    search: <Search size={14} />,
    acadamicSearch: <BookOpen size={14} />,
    retrieve: <Link size={14} />,
    videoSearch: <Film size={14} />,
    pdfSearch: <FileText size={14} />,
    docSearch: <FileText size={14} />,
    pptSearch: <Presentation size={14} />
  }

  return (
    <Badge className={className} variant={'secondary'}>
      {/* {icon[tool]} */}
      <span>{children}</span>
    </Badge>
  )
}
