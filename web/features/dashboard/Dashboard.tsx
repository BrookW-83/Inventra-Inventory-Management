'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InventoryOverview } from '@/components/dashboard/InventoryOverview';
import { PurchaseOverview } from '@/components/dashboard/PurchaseOverview';
import { useGetDashboardStatsQuery } from '@/lib/api/dashboardApi';
import {
  FiActivity,
  FiTrendingUp,
  FiPackage,
  FiShoppingCart,
  FiLayers,
  FiAlertTriangle,
} from 'react-icons/fi';
import { cn } from '@/lib/utils';

export function Dashboard() {
  const { data: stats, isLoading, error } = useGetDashboardStatsQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center animate-fadeIn">
          <div className="relative mx-auto mb-6">
            <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto"></div>
          </div>
          <p className="text-muted-foreground text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center bg-destructive/10 border border-destructive/20 rounded-2xl p-8 max-w-md animate-fadeIn">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-destructive font-semibold mb-2">Failed to load dashboard data</p>
          <p className="text-sm text-muted-foreground">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center bg-accent border border-border rounded-2xl p-8 max-w-md animate-fadeIn">
          <p className="text-muted-foreground">No data available</p>
        </div>
      </div>
    );
  }

  const usagePercentage =
    stats.totalInventoryCapacity > 0
      ? (stats.usedInventoryCapacity / stats.totalInventoryCapacity) * 100
      : 0;

  const sectionsNearCapacity = stats.sectionCapacities.filter(
    (section) => section.usagePercentage >= 80,
  ).length;

  const summaryCards = [
    {
      title: 'Inventory Utilization',
      value: `${usagePercentage.toFixed(1)}%`,
      helper: `${stats.usedInventoryCapacity.toLocaleString()} / ${stats.totalInventoryCapacity.toLocaleString()} units`,
      icon: FiPackage,
      accent: 'from-primary/20 to-primary/10 text-primary',
    },
    {
      title: 'Total Sales',
      value: `$${stats.totalSales.toLocaleString()}`,
      helper: 'Lifetime revenue from purchases',
      icon: FiTrendingUp,
      accent: 'from-emerald-200/60 to-emerald-100/40 text-emerald-600',
    },
    {
      title: 'Sections Near Capacity',
      value: sectionsNearCapacity,
      helper: sectionsNearCapacity ? 'Consider redistributing stock' : 'All sections healthy',
      icon: FiAlertTriangle,
      accent: 'from-amber-200/60 to-amber-100/40 text-amber-600',
    },
    {
      title: 'Active SKUs',
      value: stats.totalItemsStored.toLocaleString(),
      helper: 'Unique items currently tracked',
      icon: FiLayers,
      accent: 'from-indigo-200/60 to-indigo-100/40 text-indigo-600',
    },
  ];

  const quickInsights = [
    {
      label: 'Capacity Remaining',
      value: `${(stats.totalInventoryCapacity - stats.usedInventoryCapacity).toLocaleString()} units`,
      description: 'Space available before hitting storage limits',
    },
    {
      label: 'Monthly Spend',
      value: `$${stats.totalCostCurrentYear.toLocaleString()}`,
      description: `Purchasing cost for ${new Date().toLocaleString('default', { month: 'long' })}`,
    },
    {
      label: 'Recent Activity',
      value: stats.recentInventoryLogs.length ? `${stats.recentInventoryLogs[0]?.action ?? 'N/A'}` : 'N/A',
      description: stats.recentInventoryLogs.length
        ? `${stats.recentInventoryLogs[0]?.quantityChanged ?? 0} units by ${
            stats.recentInventoryLogs[0]?.performedBy
          }`
        : 'No recent inventory movements',
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-background via-background to-background/90 p-8">
        <div className="absolute inset-0 opacity-70">
          <div className="absolute -top-12 -left-10 h-48 w-48 rounded-full bg-primary/30 blur-3xl" />
          <div className="absolute -bottom-12 right-0 h-48 w-48 rounded-full bg-tertiary/20 blur-3xl" />
        </div>
        <div className="relative z-10 grid gap-6 md:grid-cols-[2fr,1fr]">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">Command Center</p>
            <h1 className="text-4xl font-bold text-foreground">
              Keep inventory decisions sharp and timely.
            </h1>
            <p className="mt-3 text-base text-muted-foreground">
              Monitor utilization, spending, and procurement health from a single consolidated view.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {quickInsights.map((insight) => (
                <div
                  key={insight.label}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm backdrop-blur"
                >
                  <p className="text-[12px] uppercase tracking-wide text-muted-foreground">{insight.label}</p>
                  <p className="text-lg font-semibold text-foreground">{insight.value}</p>
                  <p className="text-xs text-muted-foreground/80">{insight.description}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
            <div className="mb-6 flex items-center gap-2">
              <FiActivity className="h-4 w-4 text-primary" />
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Live Snapshot</p>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Inventory Utilization</span>
                  <span>{usagePercentage.toFixed(1)}%</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-white/20">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-primary/60"
                    style={{ width: `${usagePercentage}%` }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl border border-white/15 bg-white/5 p-3 text-center">
                  <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Total Capacity</p>
                  <p className="text-lg font-semibold text-foreground">
                    {stats.totalInventoryCapacity.toLocaleString()}
                  </p>
                </div>
                <div className="rounded-xl border border-white/15 bg-white/5 p-3 text-center">
                  <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Used Today</p>
                  <p className="text-lg font-semibold text-foreground">
                    {stats.usedInventoryCapacity.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <div
            key={card.title}
            className={cn(
              'rounded-2xl border border-border/70 bg-card/90 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg',
              'relative overflow-hidden',
            )}
          >
            <div className={cn('absolute inset-0 bg-gradient-to-br opacity-70', card.accent)} />
            <div className="relative z-10 space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {card.title}
                </p>
                <span className="rounded-full bg-white/70 p-2 text-xs text-foreground/70">
                  <card.icon className="h-4 w-4" />
                </span>
              </div>
              <p className="text-2xl font-bold text-foreground">{card.value}</p>
              <p className="text-sm text-muted-foreground">{card.helper}</p>
            </div>
          </div>
        ))}
      </div>

      <Tabs defaultValue="inventory" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:w-auto md:inline-flex">
          <TabsTrigger value="inventory" className="gap-2">
            <FiPackage className="w-4 h-4" />
            Inventory Intelligence
          </TabsTrigger>
          <TabsTrigger value="purchase" className="gap-2">
            <FiShoppingCart className="w-4 h-4" />
            Purchase Insights
          </TabsTrigger>
        </TabsList>
        <TabsContent value="inventory">
          <InventoryOverview stats={stats} />
        </TabsContent>
        <TabsContent value="purchase">
          <PurchaseOverview stats={stats} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
