'use client';

import { useParams } from 'next/navigation';
import { Star, MapPin, Clock, DollarSign, Globe, Award, Briefcase, CheckCircle } from 'lucide-react';
import { useFreelancerPublicProfile, useUserReviews } from '@/hooks/useMarketplace';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { InitialAvatar } from '@/components/marketplace/freelancer-card';

export default function FreelancerProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { data: profile, isLoading } = useFreelancerPublicProfile(id);
  const { data: reviews = [] } = useUserReviews(id);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8 space-y-6">
        <Skeleton className="h-40 rounded-xl" />
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-32 rounded-xl" />
            <Skeleton className="h-24 rounded-xl" />
          </div>
          <Skeleton className="h-48 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <p className="text-lg font-medium">Freelancer not found</p>
        <p className="text-sm text-muted-foreground">This profile may not exist or is private.</p>
      </div>
    );
  }

  const skills = profile.skills?.split(',').map((s) => s.trim()).filter(Boolean) ?? [];
  const portfolioLinks = profile.portfolioLinks?.split(/[\n,]/).map((s) => s.trim()).filter(Boolean) ?? [];
  const isTopRated = (profile.ratingAverage ?? 0) >= 4.8 || (profile.completedJobs ?? 0) >= 10;
  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : profile.ratingAverage?.toFixed(1);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      {/* Hero Card */}
      <Card className="overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-primary to-teal-500" />
        <CardContent className="p-6 sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
            <InitialAvatar name={profile.name} size="lg" />
            <div className="flex-1 min-w-0 space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold">{profile.name ?? 'Freelancer'}</h1>
                {isTopRated && (
                  <Badge className="bg-amber-500/10 text-amber-600 border-amber-200 gap-1">
                    <Award className="size-3" /> Top Rated
                  </Badge>
                )}
              </div>
              {profile.headline && (
                <p className="text-lg text-muted-foreground">{profile.headline}</p>
              )}
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                {profile.hourlyRate && (
                  <span className="flex items-center gap-1 text-foreground font-semibold">
                    <DollarSign className="size-4 text-primary" />${profile.hourlyRate}/hr
                  </span>
                )}
                {avgRating && (
                  <span className="flex items-center gap-1">
                    <Star className="size-4 fill-amber-400 text-amber-400" />
                    {avgRating} ({reviews.length || profile.completedJobs || 0} reviews)
                  </span>
                )}
                {profile.location && (
                  <span className="flex items-center gap-1"><MapPin className="size-4" />{profile.location}</span>
                )}
                {profile.availability && (
                  <span className="flex items-center gap-1"><Clock className="size-4 text-green-500" />{profile.availability}</span>
                )}
                {profile.completedJobs != null && (
                  <span className="flex items-center gap-1"><Briefcase className="size-4 text-blue-500" />{profile.completedJobs} jobs</span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* About */}
          {profile.bio && (
            <Card>
              <CardHeader><CardTitle className="text-base">About</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">{profile.bio}</p>
              </CardContent>
            </Card>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <Card>
              <CardHeader><CardTitle className="text-base">Skills</CardTitle></CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-sm px-3 py-1">
                      <CheckCircle className="size-3 mr-1.5 text-primary" />{skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Portfolio */}
          {portfolioLinks.length > 0 && (
            <Card>
              <CardHeader><CardTitle className="text-base">Portfolio</CardTitle></CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {portfolioLinks.map((link, i) => (
                    <li key={i}>
                      <a href={link} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-primary hover:underline">
                        <Globe className="size-4 shrink-0" />
                        <span className="truncate">{link}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Reviews */}
          {reviews.length > 0 && (
            <Card>
              <CardHeader><CardTitle className="text-base">Client Reviews</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {reviews.map((r) => (
                  <div key={r.id} className="rounded-lg border p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm">{r.reviewerName}</p>
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`size-4 ${i < r.rating ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground'}`} />
                        ))}
                      </div>
                    </div>
                    {r.comment && <p className="text-sm text-muted-foreground">{r.comment}</p>}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Profile Details</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              {profile.experienceLevel && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Experience</span>
                  <span className="font-medium">{profile.experienceLevel}</span>
                </div>
              )}
              {profile.availability && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Available</span>
                  <span className="font-medium text-green-600">{profile.availability}</span>
                </div>
              )}
              {profile.categories && (
                <div className="flex justify-between gap-3">
                  <span className="text-muted-foreground shrink-0">Specialties</span>
                  <span className="font-medium text-right">{profile.categories}</span>
                </div>
              )}
              {profile.completedJobs != null && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Jobs Done</span>
                  <span className="font-medium">{profile.completedJobs}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
