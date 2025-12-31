'use client'

import Link from 'next/link'

import { FileText, Info, Lock } from 'lucide-react'

import { DropdownMenuItem } from './ui/dropdown-menu'

const externalLinks = [
    {
        name: 'Terms',
        href: '/terms',
        icon: <FileText className="mr-2 h-4 w-4 text-foreground/70" />
    },
    {
        name: 'Privacy',
        href: '/privacy',
        icon: <Lock className="mr-2 h-4 w-4 text-foreground/70" />
    },
    {
        name: 'About',
        href: '/about',
        icon: <Info className="mr-2 h-4 w-4 text-foreground/70" />
    },
]

export function CompanyInfoItems() {
    return (
        <>
            {externalLinks.map(link => (
                <DropdownMenuItem key={link.name} asChild className="cursor-pointer px-3 py-2 rounded-lg">
                    <Link href={link.href}>
                        {link.icon}
                        <span className='txt-grad text-sm'>{link.name}</span>
                    </Link>
                </DropdownMenuItem>
            ))}
        </>
    )
}
