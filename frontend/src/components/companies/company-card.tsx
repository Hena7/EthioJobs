import Link from 'next/link';
import { Building2, MapPin, Users, Briefcase, ExternalLink, BadgeCheck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Company } from '@/types';

interface CompanyCardProps {
  company: Company;
}

export function CompanyCard({ company }: CompanyCardProps) {
  return (
    <Link href={`/companies/${company.id}`} className="block h-full outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-xl">
      <Card className="group h-full overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-primary/30">
        <CardContent className="flex h-full flex-col p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex size-16 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-teal-500/10 text-primary group-hover:from-primary/20 group-hover:to-teal-500/20 transition-colors">
              {company.logo ? (
                <img
                  src={company.logo}
                  alt={`${company.name} logo`}
                  className="size-12 rounded-lg object-contain"
                />
              ) : (
                <Building2 className="size-8" />
              )}
            </div>
            
            {company.isVerified && (
              <Badge variant="secondary" className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-blue-500/20 gap-1 rounded-full px-2 py-0.5 shadow-sm">
                <BadgeCheck className="size-3" />
                Verified
              </Badge>
            )}
          </div>

          <div className="mt-4 flex-1">
            <h3 className="text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors line-clamp-1">
              {company.name}
            </h3>
            
            {company.industry && (
              <p className="mt-1 text-sm font-medium text-primary">
                {company.industry}
              </p>
            )}

            <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
              {company.description || 'No description provided.'}
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
              {company.location && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="size-4" />
                  <span className="line-clamp-1">{company.location}</span>
                </div>
              )}
              {company.size && (
                <div className="flex items-center gap-1.5">
                  <Users className="size-4" />
                  <span>{company.size}</span>
                </div>
              )}
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
              <div className="flex items-center gap-1.5 font-medium text-foreground">
                <Briefcase className="size-4 text-primary" />
                <span>
                  {company.jobCount} {company.jobCount === 1 ? 'open position' : 'open positions'}
                </span>
              </div>
              
              <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:bg-primary group-hover:text-primary-foreground">
                <ExternalLink className="size-4" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
