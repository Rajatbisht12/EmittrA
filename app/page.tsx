'use client';

import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { SignInButton, SignUpButton } from '@clerk/nextjs';
import { CheckCircle, Users, Target, Plus } from 'lucide-react';

export default function Home() {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push('/boards');
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (isSignedIn) {
    return null; // Will redirect to /boards
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-foreground mb-6">
            Organize Your Work with
            <span className="text-green-600"> Task Manager</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Streamline your workflow with our intuitive task management platform. 
            Create boards, organize tasks, and collaborate with your team effortlessly.
          </p>
          <div className="flex justify-center gap-4">
            <SignInButton>
              <Button size="lg" className="bg-green-600 hover:bg-green-700">
                Get Started
              </Button>
            </SignInButton>
            <SignUpButton>
              <Button size="lg" variant="outline">
                Sign Up Free
              </Button>
            </SignUpButton>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center p-6 bg-card rounded-lg shadow-md">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">Task Management</h3>
            <p className="text-muted-foreground">
              Create, organize, and track tasks with ease. Set priorities, due dates, and assign team members.
            </p>
          </div>

          <div className="text-center p-6 bg-card rounded-lg shadow-md">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">Team Collaboration</h3>
            <p className="text-muted-foreground">
              Work together seamlessly. Assign tasks, share boards, and keep everyone in sync.
            </p>
          </div>

          <div className="text-center p-6 bg-card rounded-lg shadow-md">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">Visual Organization</h3>
            <p className="text-muted-foreground">
              Use kanban boards to visualize your workflow and track progress at a glance.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-card rounded-lg shadow-md p-8">
          <h2 className="text-3xl font-bold mb-4 text-foreground">Ready to get organized?</h2>
          <p className="text-muted-foreground mb-6">
            Join thousands of teams who are already using Task Manager to boost their productivity.
          </p>
          <SignUpButton>
            <Button size="lg" className="bg-green-600 hover:bg-green-700">
              Start Your Free Trial
            </Button>
          </SignUpButton>
        </div>
      </div>
    </div>
  );
}
