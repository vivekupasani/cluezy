'use client'

import Link from 'next/link'
import { SiGithub, SiInstagram, SiLinkedin, SiX } from 'react-icons/si'

import { DropdownMenuItem } from '@/components/ui/dropdown-menu'

const externalLinks = [
  {
    name: 'X',
    href: 'https://x.com/v1vekupasani',
    icon: <SiX className="mr-2 h-4 w-4" />
  },
  {
    name: 'GitHub',
    href: 'https://github.com/cluezy',
    icon: <SiGithub className="mr-2 h-4 w-4" />
  },
  {
    name: 'Linkedin',
    href: 'https://www.linkedin.com/company/cluezy',
    icon: <SiLinkedin className="mr-2 h-4 w-4" />
  },
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/v1vekupasani/',
    icon: <SiInstagram className="mr-2 h-4 w-4" />
  }
]

export function ExternalLinkItems() {
  return (
    <>
      {externalLinks.map(link => (
        <DropdownMenuItem key={link.name} asChild className='cursor-pointer'>
          <Link href={link.href} target="_blank" rel="noopener noreferrer">
            {link.icon}
            <span>{link.name}</span>
          </Link>
        </DropdownMenuItem>
      ))}
    </>
  )
}
