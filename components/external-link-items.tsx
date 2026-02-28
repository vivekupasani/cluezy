'use client'

import Link from 'next/link'
import { SiGithub, SiInstagram, SiLinkedin, SiX } from 'react-icons/si'

import { DropdownMenuItem } from './ui/dropdown-menu'

const externalLinks = [
  {
    name: 'X',
    href: 'https://x.com/v1vekupasani',
    icon: <SiX className="mr-2 h-4 w-4 text-foreground/70" />
  },
  {
    name: 'GitHub',
    href: 'https://github.com/cluezy',
    icon: <SiGithub className="mr-2 h-4 w-4 text-foreground/70" />
  },
  {
    name: 'Linkedin',
    href: 'https://www.linkedin.com/company/cluezy',
    icon: <SiLinkedin className="mr-2 h-4 w-4 text-foreground/70" />
  },
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/v1vekupasani/',
    icon: <SiInstagram className="mr-2 h-4 w-4 text-foreground/70" />
  }
]

export function ExternalLinkItems() {
  return (
    <>
      {externalLinks.map(link => (
        <DropdownMenuItem
          key={link.name}
          asChild
          className="cursor-pointer px-3 py-2 rounded-lg"
        >
          <Link href={link.href} target="_blank" rel="noopener noreferrer">
            {link.icon}
            <span className="text-foreground/70 font-medium text-sm">
              {link.name}
            </span>
          </Link>
        </DropdownMenuItem>
      ))}
    </>
  )
}
