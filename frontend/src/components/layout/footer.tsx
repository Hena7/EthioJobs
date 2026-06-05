import Link from 'next/link';
import { Briefcase, Globe, ExternalLink, MessageCircle, Mail } from 'lucide-react';

const footerLinks = [
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms', href: '/terms' },
];

const socialLinks = [
  { label: 'Twitter', href: '#', icon: MessageCircle },
  { label: 'LinkedIn', href: '#', icon: ExternalLink },
  { label: 'GitHub', href: '#', icon: Globe },
  { label: 'Email', href: '#', icon: Mail },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-2 font-bold text-lg">
            <Briefcase className="size-5 text-primary" />
            <span>EthioJobs</span>
          </div>
          <nav className="flex flex-wrap justify-center gap-6">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  aria-label={social.label}
                >
                  <Icon className="size-4" />
                </a>
              );
            })}
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-6 text-center">
          <p className="text-xs text-muted-foreground">
            &copy; 2026 EthioJobs Hub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
