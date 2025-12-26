'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FiDollarSign, FiZap, FiTool, FiPackage, FiTrendingUp, FiBarChart2, FiShield, FiUsers, FiArrowRight, FiCheck, FiStar } from 'react-icons/fi';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-card/80 border-b border-border/50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-tertiary rounded-xl flex items-center justify-center">
              <FiPackage className="w-6 h-6 text-white" />
            </div>
            <span className="text-primary">Inventra</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#home" className="text-sm font-medium text-foreground hover:text-primary transition-all hover:scale-105">Home</a>
            <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-all hover:scale-105">Features</a>
            <a href="#about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-all hover:scale-105">About</a>
            <a href="#contact" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-all hover:scale-105">Contact</a>
            <Link href="/auth/signin">
              <Button variant="outline" size="sm" className="hover:scale-105 transition-transform">Sign In</Button>
            </Link>
            <Link href="/auth/signup">
              <Button size="sm" className="bg-gradient-to-r from-primary to-tertiary hover:shadow-lg hover:scale-105 transition-all">
                Sign Up
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/95 to-tertiary"></div>

        {/* Animated mesh gradient */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute top-0 -right-1/4 w-1/2 h-1/2 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/3 w-1/2 h-1/2 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:30px_30px]"></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left content */}
            <div className="text-white space-y-8 animate-fadeInLeft">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                <FiStar className="w-4 h-4 text-yellow-300" />
                <span className="text-sm">Trusted by 10,000+ businesses</span>
              </div>

              <h1 className="text-6xl md:text-7xl font-bold leading-tight">
                Manage Your
                <span className="block bg-gradient-to-r from-yellow-200 to-pink-200 bg-clip-text text-transparent">
                  Inventory Smarter
                </span>
              </h1>

              <p className="text-xl text-white/90 leading-relaxed">
                The all-in-one platform that transforms how you track inventory,
                manage purchases, and grow your business with real-time insights.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/auth/signup">
                  <Button size="lg" className="bg-white text-primary hover:bg-white/90 hover:scale-105 transition-all shadow-2xl group text-base px-8 py-6">
                    Start Free Trial
                    <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="#about">
                  <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 backdrop-blur-sm px-8 py-6 text-base">
                    Watch Demo
                  </Button>
                </Link>
              </div>

              <div className="flex items-center gap-8 pt-4">
                <div className="flex -space-x-2">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 border-2 border-white"></div>
                  ))}
                </div>
                <div className="text-sm">
                  <div className="flex items-center gap-1 mb-1">
                    {[1,2,3,4,5].map(i => (
                      <FiStar key={i} className="w-4 h-4 fill-yellow-300 text-yellow-300" />
                    ))}
                  </div>
                  <p className="text-white/80">Rated 4.9/5 from 200+ reviews</p>
                </div>
              </div>
            </div>

            {/* Right side - 3D Dashboard mockup */}
            <div className="relative animate-fadeInRight">
              <div className="relative perspective-1000">
                {/* Main dashboard card */}
                <div className="bg-white/10 backdrop-blur-2xl rounded-3xl p-8 border border-white/20 shadow-2xl transform hover:scale-105 transition-all duration-500 rotate-y-5">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-white font-semibold text-lg">Dashboard Overview</h3>
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-400"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                      <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10 hover:scale-105 transition-transform">
                      <FiPackage className="w-8 h-8 mb-3 text-yellow-300" />
                      <p className="text-xs text-white/70 mb-1">Total Items</p>
                      <p className="text-3xl font-bold text-white">1,234</p>
                      <p className="text-xs text-green-300 mt-1">+12% this month</p>
                    </div>
                    <div className="bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10 hover:scale-105 transition-transform">
                      <FiTrendingUp className="w-8 h-8 mb-3 text-green-300" />
                      <p className="text-xs text-white/70 mb-1">Revenue</p>
                      <p className="text-3xl font-bold text-white">$45.2K</p>
                      <p className="text-xs text-green-300 mt-1">+23% this month</p>
                    </div>
                  </div>

                  {/* Animated Chart */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/10">
                    <p className="text-xs text-white/70 mb-4">Sales Analytics</p>
                    <div className="flex items-end justify-between gap-2 h-32">
                      {[60, 80, 45, 90, 70, 95, 85, 75].map((height, i) => (
                        <div key={i} className="flex-1 group relative">
                          <div
                            className="w-full bg-gradient-to-t from-yellow-300 to-pink-300 rounded-t-lg hover:from-yellow-400 hover:to-pink-400 transition-all duration-300 animate-slideUp"
                            style={{
                              height: `${height}%`,
                              animationDelay: `${i * 100}ms`
                            }}
                          ></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Floating elements */}
                <div className="absolute -top-6 -right-6 bg-gradient-to-br from-green-400 to-emerald-500 text-white px-5 py-3 rounded-2xl shadow-2xl animate-float">
                  <div className="flex items-center gap-2">
                    <FiCheck className="w-5 h-5" />
                    <span className="text-sm font-semibold">Live Updates</span>
                  </div>
                </div>

                <div className="absolute -bottom-6 -left-6 bg-gradient-to-br from-purple-500 to-pink-500 text-white px-5 py-3 rounded-2xl shadow-2xl animate-float animation-delay-2000">
                  <div className="flex items-center gap-2">
                    <FiShield className="w-5 h-5" />
                    <span className="text-sm font-semibold">100% Secure</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <div className="w-1 h-3 bg-white/50 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Why Inventra */}
      <section id="features" className="py-32 relative bg-gradient-to-b from-background to-accent/20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-4">
              <FiZap className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Why Choose Us</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Built for Modern Businesses
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to run your inventory efficiently, backed by powerful analytics
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: FiDollarSign,
                title: 'Cost Effective',
                desc: 'Reduce operational costs with efficient inventory tracking and automated purchase management.',
                gradient: 'from-green-500 to-emerald-500'
              },
              {
                icon: FiZap,
                title: 'Real-time Tracking',
                desc: 'Monitor your inventory levels and purchase orders in real-time with instant updates.',
                gradient: 'from-yellow-500 to-orange-500'
              },
              {
                icon: FiTool,
                title: 'Smart Automation',
                desc: 'Automate repetitive tasks with intelligent logging and streamlined workflows.',
                gradient: 'from-blue-500 to-cyan-500'
              },
              {
                icon: FiBarChart2,
                title: 'Analytics & Reports',
                desc: 'Generate detailed reports and analytics to make informed business decisions.',
                gradient: 'from-purple-500 to-pink-500'
              }
            ].map((feature, i) => (
              <div key={i} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl blur-xl -z-10"
                     style={{background: `linear-gradient(to bottom right, var(--tw-gradient-stops))`}}></div>
                <div className="relative bg-card border border-border rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 h-full">
                  <div className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.desc}
                  </p>
                  <div className="mt-6 flex items-center text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Learn more <FiArrowRight className="ml-1 w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features Showcase */}
      <section className="py-32 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-tertiary/10 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Everything You Need, <span className="text-primary">All In One Place</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive tools designed to streamline your workflow and boost productivity
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Inventory Management Card */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-tertiary/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative bg-gradient-to-br from-primary via-primary/90 to-tertiary text-white p-10 rounded-3xl hover:shadow-2xl transition-all duration-500 overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-20 -mt-20"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-16 -mb-16"></div>

                <div className="relative z-10">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <FiPackage className="w-8 h-8" />
                  </div>
                  <h3 className="text-3xl font-bold mb-4">Inventory Management</h3>
                  <p className="text-white/90 mb-6 text-lg">
                    Track your stock levels, manage product information, and receive alerts
                    when inventory runs low. Keep your business running smoothly.
                  </p>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {[
                      'Stock level monitoring',
                      'Low inventory alerts',
                      'Product categorization',
                      'Batch tracking'
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-white/90">
                        <FiCheck className="w-4 h-4 text-green-300" />
                        {item}
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm">
                    Explore Feature <FiArrowRight className="ml-2" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Purchase Tracking Card */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-tertiary/20 to-primary/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative bg-gradient-to-br from-tertiary via-tertiary/90 to-primary text-white p-10 rounded-3xl hover:shadow-2xl transition-all duration-500 overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-20 -mt-20"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-16 -mb-16"></div>

                <div className="relative z-10">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <FiBarChart2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-3xl font-bold mb-4">Purchase Tracking</h3>
                  <p className="text-white/90 mb-6 text-lg">
                    Monitor all purchase orders, track spending, and analyze vendor performance.
                    Make data-driven decisions for your procurement process.
                  </p>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {[
                      'Real-time order tracking',
                      'Vendor analytics',
                      'Spending insights',
                      'Purchase history'
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-white/90">
                        <FiCheck className="w-4 h-4 text-green-300" />
                        {item}
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm">
                    Explore Feature <FiArrowRight className="ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Us - Impressive Stats Section */}
      <section id="about" className="py-32 relative overflow-hidden bg-gradient-to-b from-accent/20 to-background">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:30px_30px]"></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-4">
              <FiTrendingUp className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Trusted Worldwide</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Join Thousands of Happy Businesses
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Built on the pillars of efficiency, reliability, and innovation
            </p>
          </div>

          {/* Impressive Stats Grid */}
          <div className="grid md:grid-cols-4 gap-6 mb-20">
            {[
              { icon: FiUsers, value: '10,000+', label: 'Active Users', gradient: 'from-blue-500 to-cyan-500' },
              { icon: FiTrendingUp, value: '99.9%', label: 'Uptime SLA', gradient: 'from-green-500 to-emerald-500' },
              { icon: FiShield, value: '100%', label: 'Data Security', gradient: 'from-purple-500 to-pink-500' },
              { icon: FiPackage, value: '5M+', label: 'Items Tracked', gradient: 'from-orange-500 to-red-500' }
            ].map((stat, i) => (
              <div key={i} className="group relative">
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-20 rounded-2xl blur-xl transition-opacity duration-500`}></div>
                <div className="relative bg-card border border-border rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 text-center">
                  <div className={`w-14 h-14 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                    <stat.icon className="w-7 h-7 text-white" />
                  </div>
                  <p className="text-4xl font-bold mb-2">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-primary via-primary/95 to-tertiary rounded-3xl p-12 text-white text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24"></div>

            <div className="relative z-10">
              <h3 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Transform Your Business?
              </h3>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Join thousands of businesses streamlining their operations with Inventra.
                Start your free trial today - no credit card required.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/auth/signup">
                  <Button size="lg" className="bg-white text-primary hover:bg-white/90 hover:scale-105 transition-all shadow-2xl px-8 py-6 text-base">
                    Start Free Trial
                    <FiArrowRight className="ml-2" />
                  </Button>
                </Link>
                <Link href="#contact">
                  <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 backdrop-blur-sm px-8 py-6 text-base">
                    Schedule Demo
                  </Button>
                </Link>
              </div>
              <p className="text-sm text-white/70 mt-6">
                ✓ 14-day free trial  ✓ No credit card required  ✓ Cancel anytime
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* Contact Us */}
      <section id="contact" className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background to-accent/10"></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-4">
              <FiPackage className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Get in Touch</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Let's Talk</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="bg-card border border-border rounded-3xl p-10 shadow-2xl">
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Name</label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      className="w-full px-5 py-4 rounded-xl border border-input bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input
                      type="email"
                      placeholder="john@example.com"
                      className="w-full px-5 py-4 rounded-xl border border-input bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Subject</label>
                  <input
                    type="text"
                    placeholder="How can we help?"
                    className="w-full px-5 py-4 rounded-xl border border-input bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Message</label>
                  <textarea
                    placeholder="Tell us more about your needs..."
                    rows={6}
                    className="w-full px-5 py-4 rounded-xl border border-input bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none resize-none"
                  ></textarea>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-primary to-tertiary hover:shadow-lg hover:scale-105 transition-all text-base py-6"
                  size="lg"
                >
                  Send Message
                  <FiArrowRight className="ml-2" />
                </Button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <div className="text-center p-6 bg-card border border-border rounded-2xl hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FiPackage className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-semibold mb-1">Email Us</h4>
                <p className="text-sm text-muted-foreground">support@quickmgmt.com</p>
              </div>
              <div className="text-center p-6 bg-card border border-border rounded-2xl hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FiUsers className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-semibold mb-1">Call Us</h4>
                <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
              </div>
              <div className="text-center p-6 bg-card border border-border rounded-2xl hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FiShield className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-semibold mb-1">Support</h4>
                <p className="text-sm text-muted-foreground">24/7 Available</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">
                <span className="text-primary">Inventra</span>
              </h3>
              <p className="text-sm text-secondary-foreground/80">
                Streamline your operations with our powerful inventory and purchase management platform.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-secondary-foreground mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="text-sm text-secondary-foreground/80 hover:text-primary transition-colors">Features</a></li>
                <li><a href="#pricing" className="text-sm text-secondary-foreground/80 hover:text-primary transition-colors">Pricing</a></li>
                <li><a href="#about" className="text-sm text-secondary-foreground/80 hover:text-primary transition-colors">About Us</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-secondary-foreground mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="#contact" className="text-sm text-secondary-foreground/80 hover:text-primary transition-colors">Contact</a></li>
                <li><a href="#help" className="text-sm text-secondary-foreground/80 hover:text-primary transition-colors">Help Center</a></li>
                <li><a href="#docs" className="text-sm text-secondary-foreground/80 hover:text-primary transition-colors">Documentation</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-secondary-foreground mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#privacy" className="text-sm text-secondary-foreground/80 hover:text-primary transition-colors">Privacy Policy</a></li>
                <li><a href="#terms" className="text-sm text-secondary-foreground/80 hover:text-primary transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-secondary-foreground/20 mt-8 pt-8 text-center">
            <p className="text-sm text-secondary-foreground/80">
              © {new Date().getFullYear()} Inventra. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}
