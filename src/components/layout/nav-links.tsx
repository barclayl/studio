'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_ITEMS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import type { NavItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { SheetClose } from '@/components/ui/sheet'; // For mobile menu

interface NavLinksProps {
  isMobile?: boolean;
}

export function NavLinks({ isMobile = false }: NavLinksProps) {
  const pathname = usePathname();

  const linkClass = (isActive: boolean) =>
    cn(
      'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
      isActive
        ? 'bg-primary text-primary-foreground'
        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
      isMobile ? 'justify-start w-full' : ''
    );

  const renderLink = (item: NavItem) => {
    const isActive = item.match ? item.match(pathname) : pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
    const LinkContent = (
      <>
        <item.icon className="h-5 w-5" />
        <span>{item.label}</span>
      </>
    );

    if (isMobile) {
      return (
        <SheetClose asChild key={item.href}>
          <Link href={item.href} className={linkClass(isActive)}>
            {LinkContent}
          </Link>
        </SheetClose>
      );
    }

    return (
      <Button asChild variant="ghost" size="sm" className={linkClass(isActive)} key={item.href}>
        <Link href={item.href}>
         {LinkContent}
        </Link>
      </Button>
    );
  };

  return (
    <nav className={cn('flex gap-2', isMobile ? 'flex-col space-y-1 p-4' : 'items-center')}>
      {NAV_ITEMS.map(renderLink)}
    </nav>
  );
}
