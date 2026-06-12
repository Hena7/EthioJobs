'use client';

import Link from 'next/link';
import { Star, MapPin, Clock, DollarSign, Award, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { JobSeekerProfile } from '@/types';
import { cn } from '@/lib/utils';

interface FreelancerCardProps {
  profile: JobSeekerProfile & { userId?: string; name?: string; email?: string };
  className?: string;
}

function InitialAvatar({ name, size = 'md' }: { name?: string; size?: 'sm' | 'md' | 'lg' }) {
  const initials = (name ?? 'F')
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const sizeClasses = {
    sm: 'size-8 text-sm',
    md: 'size-12 text-base',
    lg: 'size-16 text-xl',
  };

  // Pick a color based on the first char
  const colors = [
    'from-primary to-teal-500',
    'from-blue-500 to-indigo-500',
    'from-purple-500 to-pink-500',
    'from-amber-500 to-orange-500',
    'from-emerald-500 to-green-600',
  ];
  const idx = (name?.charCodeAt(0) ?? 0) % colors.length;

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full bg-gradient-to-br text-white font-semibold shrink-0',
        `bg-gradient-to-br ${colors[idx]}`,
        sizeClasses[size],
      )}
    >
      {initials}
    </div>
  );
}

export function FreelancerCard({ profile, className }: FreelancerCardProps) {
  const skills = profile.skills
    ? profile.skills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, 4)
    : [];

  const isTopRated = (profile.ratingAverage ?? 0) >= 4.8 || (profile.completedJobs ?? 0) >= 10;

  return (
    <Card
      className={cn(
        'group relative overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-lg',
        className,
      )}
    >
      <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-primary to-teal-500 opacity-0 transition-opacity group-hover:opacity-100" />
      <CardContent className="p-5 space-y-4">
        {/* Header */}
        <div className="flex items-start gap-3">
          <InitialAvatar name={profile.name} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold truncate">{profile.name ?? 'Freelancer'}</h3>
              {isTopRated && (
                <Badge className="shrink-0 bg-amber-500/10 text-amber-600 border-amber-200 dark:border-amber-800 dark:text-amber-400 gap-1">
                  <Award className="size-3" />
                  Top Rated
                </Badge>
              )}
            </div>
            {profile.headline && (
              <p className="text-sm text-muted-foreground truncate mt-0.5">{profile.headline}</p>
            )}
          </div>
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
          {profile.hourlyRate && (
            <span className="flex items-center gap-1 font-medium text-foreground">
              <DollarSign className="size-3.5 text-primary" />
              ${profile.hourlyRate}/hr
            </span>
          )}
          {profile.ratingAverage && (
            <span className="flex items-center gap-1">
              <Star className="size-3.5 fill-amber-400 text-amber-400" />
              {profile.ratingAverage.toFixed(1)}
              {profile.completedJobs ? ` (${profile.completedJobs})` : ''}
            </span>
          )}
          {profile.location && (
            <span className="flex items-center gap-1">
              <MapPin className="size-3.5" />
              {profile.location}
            </span>
          )}
          {profile.availability && (
            <span className="flex items-center gap-1">
              <Clock className="size-3.5 text-green-500" />
              {profile.availability}
            </span>
          )}
        </div>

        {/* Bio */}
        {profile.bio && (
          <p className="text-sm text-muted-foreground line-clamp-2">{profile.bio}</p>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {skills.map((skill) => (
              <Badge key={skill} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
          </div>
        )}

        {/* CTA */}
        <Link href={`/freelancers/${profile.userId}`}>
          <Button variant="outline" size="sm" className="w-full gap-2 mt-1">
            <Zap className="size-3.5 text-primary" />
            View Profile
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

export { InitialAvatar };
