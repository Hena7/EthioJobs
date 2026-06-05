import Link from 'next/link';
import { Briefcase, Target, Eye, Heart, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const values = [
  {
    icon: Heart,
    title: 'Empowerment',
    description:
      'We empower job seekers with the tools and resources they need to find meaningful employment.',
  },
  {
    icon: Shield,
    title: 'Trust',
    description:
      'We build trust between employers and candidates through verified profiles and transparent processes.',
  },
  {
    icon: Target,
    title: 'Impact',
    description:
      'We measure our success by the careers we launch and the businesses we help grow.',
  },
];

const team = [
  { name: 'Abebe Kebede', role: 'CEO & Founder' },
  { name: 'Sara Tadesse', role: 'CTO' },
  { name: 'Henok Alemu', role: 'Head of Operations' },
  { name: 'Meron Girma', role: 'Lead Product Designer' },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-4xl font-bold tracking-tight">About EthioJobs Hub</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Bridging the gap between Ethiopian talent and great opportunities.
        </p>
      </div>

      <section className="mt-16">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <h2 className="flex items-center gap-2 text-2xl font-bold">
              <Target className="size-6 text-primary" />
              Our Mission
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              To transform the Ethiopian job market by creating a digital
              ecosystem where every job seeker can find their ideal career path
              and every employer can discover the talent they need to thrive.
            </p>
            <h2 className="mt-8 flex items-center gap-2 text-2xl font-bold">
              <Eye className="size-6 text-primary" />
              Our Vision
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              A Ethiopia where talent knows no boundaries — where every
              qualified professional is connected to opportunities that match
              their skills, ambitions, and potential.
            </p>
          </div>
          <div className="relative">
            <div className="rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 p-8">
              <Briefcase className="size-16 text-primary" />
              <p className="mt-4 text-3xl font-bold">
                10,000+
              </p>
              <p className="text-muted-foreground">Jobs Listed</p>
              <p className="mt-4 text-3xl font-bold">5,000+</p>
              <p className="text-muted-foreground">Companies Trust Us</p>
              <p className="mt-4 text-3xl font-bold">50,000+</p>
              <p className="text-muted-foreground">Active Job Seekers</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-20">
        <h2 className="mb-8 text-center text-2xl font-bold">Our Values</h2>
        <div className="grid gap-6 sm:grid-cols-3">
          {values.map((value) => {
            const Icon = value.icon;
            return (
              <Card key={value.title}>
                <CardContent className="p-6 text-center">
                  <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="size-6" />
                  </div>
                  <h3 className="mb-2 font-semibold">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="mt-20">
        <h2 className="mb-8 text-center text-2xl font-bold">Our Team</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((member) => (
            <Card key={member.name}>
              <CardContent className="p-6 text-center">
                <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">
                  {member.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </div>
                <h3 className="font-semibold">{member.name}</h3>
                <p className="text-sm text-muted-foreground">{member.role}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-20 text-center">
        <h2 className="text-2xl font-bold">Ready to Get Started?</h2>
        <p className="mt-2 text-muted-foreground">
          Join thousands of job seekers and employers on EthioJobs Hub.
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <Link href="/auth/register">
            <Button size="lg">Create Account</Button>
          </Link>
          <Link href="/contact">
            <Button variant="outline" size="lg">
              Contact Us
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
