'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FiMail, FiLock, FiUser, FiPackage, FiCheck, FiStar, FiShield, FiArrowRight } from 'react-icons/fi';
import { supabase } from '@/lib/supabase';

export function SignUpForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!agreedToTerms) {
      setError('Please agree to terms and conditions');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            name: formData.name,
          },
        },
      });

      if (signUpError) {
        setError(signUpError.message || 'Failed to create account');
        return;
      }

      // Wait for session to be established
      if (data.session) {
        // Small delay to ensure cookies are set
        await new Promise(resolve => setTimeout(resolve, 100));
        router.push('/dashboard');
        router.refresh();
      } else {
        setError('Account created but session not established. Please sign in manually.');
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
        <div className="absolute inset-0 bg-gradient-to-br from-tertiary via-primary to-primary/95"></div>

        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute top-0 -right-1/4 w-1/2 h-1/2 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/3 w-1/2 h-1/2 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <div className="mb-8 animate-fadeInLeft">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6">
              <FiStar className="w-8 h-8" />
            </div>
            <h2 className="text-5xl font-bold mb-6 leading-tight">Start Your Journey</h2>
            <p className="text-xl text-white/90 leading-relaxed mb-8">
              Join thousands of businesses transforming their inventory management with Inventra.
            </p>
          </div>

          <div className="space-y-4 animate-fadeInLeft delay-200">
            {[
              { icon: FiCheck, text: 'Free 14-day trial, no credit card required' },
              { icon: FiShield, text: 'Bank-level security & encryption' },
              { icon: FiStar, text: 'Award-winning customer support' },
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 text-white/90">
                <div className="w-8 h-8 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center">
                  <feature.icon className="w-4 h-4" />
                </div>
                <span>{feature.text}</span>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 animate-fadeInLeft delay-300">
            <div className="flex items-center gap-1 mb-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <FiStar key={i} className="w-4 h-4 fill-yellow-300 text-yellow-300" />
              ))}
            </div>
            <p className="text-white/90 text-sm mb-3">
              &ldquo;Inventra has completely transformed how we handle inventory. The real-time tracking is a game changer!&rdquo;
            </p>
            <p className="text-xs text-white/70">— Sarah Johnson, Operations Manager</p>
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
            <h2 className="text-3xl font-bold mb-2">Create Account</h2>
            <p className="text-muted-foreground">Start your free trial today. No credit card required.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <div className="relative">
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                  className="h-12 pl-12 text-base focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Email Address</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  className="h-12 pl-12 text-base focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Minimum 6 characters"
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
              <p className="text-xs text-muted-foreground">Must be at least 6 characters long</p>
            </div>

            <div className="flex items-start gap-3 p-4 bg-accent/30 rounded-xl border border-border">
              <input
                type="checkbox"
                id="terms"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary mt-0.5"
              />
              <label htmlFor="terms" className="text-sm text-muted-foreground">
                I agree to the{' '}
                <Link href="#" className="text-primary hover:underline">
                  Terms & Conditions
                </Link>{' '}
                and{' '}
                <Link href="#" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
              </label>
            </div>

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
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
                  <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>

            <div className="text-center text-sm text-muted-foreground pt-2">
              Already have an account?{' '}
              <Link href="/auth/signin" className="text-primary hover:underline font-semibold">
                Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
