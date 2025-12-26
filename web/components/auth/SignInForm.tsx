'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FiMail, FiLock, FiPackage, FiCheck, FiTrendingUp, FiShield, FiArrowRight } from 'react-icons/fi';
import { supabase } from '@/lib/supabase';

function SignInFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (searchParams.get('registered') === 'true') {
      setSuccess('Account created successfully! Please sign in.');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message || 'Invalid email or password');
        return;
      }

      if (data.session) {
        router.push('/dashboard');
        router.refresh();
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/95 to-tertiary"></div>

        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute top-0 -right-1/4 w-1/2 h-1/2 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/3 w-1/2 h-1/2 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <div className="mb-8 animate-fadeInLeft">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6">
              <FiPackage className="w-8 h-8" />
            </div>
            <h2 className="text-5xl font-bold mb-6 leading-tight">Welcome Back</h2>
            <p className="text-xl text-white/90 leading-relaxed mb-8">
              Sign in to your account to continue managing your inventory and streamline your business operations.
            </p>
          </div>

          <div className="space-y-4 animate-fadeInLeft delay-200">
            {[
              { icon: FiCheck, text: 'Real-time inventory tracking' },
              { icon: FiTrendingUp, text: 'Advanced analytics & insights' },
              { icon: FiShield, text: 'Enterprise-grade security' },
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 text-white/90">
                <div className="w-8 h-8 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center">
                  <feature.icon className="w-4 h-4" />
                </div>
                <span>{feature.text}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-6 mt-12 animate-fadeInLeft delay-300">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <p className="text-3xl font-bold">10K+</p>
              <p className="text-sm text-white/80">Active Users</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <p className="text-3xl font-bold">99.9%</p>
              <p className="text-sm text-white/80">Uptime</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <p className="text-3xl font-bold">5M+</p>
              <p className="text-sm text-white/80">Items</p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>

        <div className="w-full max-w-md relative z-10 animate-fadeInRight">
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-tertiary rounded-xl flex items-center justify-center">
                <FiPackage className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold">
                <span className="text-primary">Inventra</span>
              </h1>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">Sign In</h2>
            <p className="text-muted-foreground">Welcome back! Please enter your credentials to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email Address</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="h-12 pl-12 text-base focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Password</label>
                <Link href="#" className="text-sm text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="h-12 pl-12 text-base focus:ring-2 focus:ring-primary/20 transition-all"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-xs"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </Button>
              </div>
            </div>

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2 animate-fadeIn">
                <FiCheck className="w-4 h-4" />
                {success}
              </div>
            )}

            {error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-xl text-sm animate-fadeIn">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-12 text-base bg-gradient-to-r from-primary to-tertiary hover:shadow-lg hover:scale-105 transition-all group"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>

            <div className="text-center text-sm text-muted-foreground pt-2">
              Don&apos;t have an account?{' '}
              <Link href="/auth/signup" className="text-primary hover:underline font-semibold">
                Create account
              </Link>
            </div>

            <div className="mt-6 p-5 bg-gradient-to-br from-accent/50 to-accent/30 border border-border rounded-xl">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <FiPackage className="w-4 h-4 text-primary" />
                </div>
                <p className="font-semibold text-foreground">Demo Credentials</p>
              </div>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p className="flex items-center gap-2">
                  <FiMail className="w-3 h-3" />
                  <span className="font-medium">Email:</span> admin@example.com
                </p>
                <p className="flex items-center gap-2">
                  <FiLock className="w-3 h-3" />
                  <span className="font-medium">Password:</span> admin123
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export function SignInForm() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <SignInFormContent />
    </Suspense>
  );
}
