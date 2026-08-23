import Link from 'next/link'
import Image from 'next/image'

const links = [
  { href: '/services', label: 'Services' },
  { href: '/contact', label: 'Contact' },
]

// Transparent nav: no background or border so the hero shows through.
// A soft top-down gradient keeps the links legible over bright imagery
// without introducing a visible bar.
export default function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-gradient-to-b from-background/60 to-transparent">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2.5" aria-label="Signal home">
          <Image
            src="/images/logo-mark-white.png"
            alt=""
            width={32}
            height={32}
            className="size-8 w-auto"
            priority
          />
          <span className="font-display text-sm font-medium tracking-[0.2em] text-foreground uppercase">
            Signal
          </span>
        </Link>
        <ul className="flex items-center gap-8">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
