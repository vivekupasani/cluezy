'use client'

import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { FileText, Info, Lock } from 'lucide-react'
import Link from 'next/link'

const externalLinks = [
    {
        name: 'Terms',
        href: '/terms',
        icon: <FileText className="mr-2 h-4 w-4" />
    },
    {
        name: 'Privacy',
        href: '/privacy',
        icon: <Lock className="mr-2 h-4 w-4" />
    },
    {
        name: 'About',
        href: '/about',
        icon: <Info className="mr-2 h-4 w-4" />
    },
]

export function CompanyInfoItems() {
    return (
        <>
            {externalLinks.map(link => (
                <DropdownMenuItem key={link.name} asChild className="cursor-pointer">
                    <Link href={link.href}>
                        {link.icon}
                        <span>{link.name}</span>
                    </Link>
                </DropdownMenuItem>
            ))}
        </>
    )
}
