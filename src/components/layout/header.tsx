import Link from 'next/link';
import { Flag, Menu } from 'lucide-react'; // Using Flag as logo
import { APP_NAME } from '@/lib/constants';
import { NavLinks } from './nav-links';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold text-primary">
          <Flag className="h-7 w-7" />
          <span>{APP_NAME}</span>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex">
          <NavLinks />
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col items-start p-4">
                <Link href="/" className="mb-4 flex items-center gap-2 text-lg font-semibold text-primary">
                  <Flag className="h-7 w-7" />
                  <span>{APP_NAME}</span>
                </Link>
                <NavLinks isMobile />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
