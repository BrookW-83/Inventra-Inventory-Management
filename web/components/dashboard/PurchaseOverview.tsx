'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardStats } from '@/types';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import type { ChartData, ChartOptions, ScriptableContext } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { FiCreditCard, FiShoppingBag, FiCalendar } from 'react-icons/fi';
import { useMemo } from 'react';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

interface PurchaseOverviewProps {
  stats: DashboardStats;
}

export function PurchaseOverview({ stats }: PurchaseOverviewProps) {
  const chartData = useMemo<ChartData<'line'>>(
    () => ({
      labels: stats.recentPurchases.map((p) => new Date(p.purchaseDate).toLocaleDateString()),
      datasets: [
        {
          label: 'Purchase Cost',
          data: stats.recentPurchases.map((p) => p.totalCost),
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: (context: ScriptableContext<'line'>) => {
            const { ctx, chartArea } = context.chart;
            if (!chartArea) return 'rgba(59, 130, 246, 0.3)';
            const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
            gradient.addColorStop(0, 'rgba(59, 130, 246, 0.05)');
            gradient.addColorStop(1, 'rgba(59, 130, 246, 0.35)');
            return gradient;
          },
          pointBackgroundColor: '#fff',
          pointBorderColor: 'rgb(59, 130, 246)',
          pointHoverRadius: 5,
          pointBorderWidth: 2,
          tension: 0.45,
          fill: true,
        },
      ],
    }),
    [stats.recentPurchases],
  );

  const chartOptions = useMemo<ChartOptions<'line'>>(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          mode: 'index' as const,
          intersect: false,
          backgroundColor: '#0f172a',
          borderColor: '#334155',
          borderWidth: 1,
          padding: 12,
          callbacks: {
            label: (context) => `$${context.parsed.y?.toLocaleString() ?? 0}`,
          },
        },
      },
      interaction: {
        intersect: false,
        mode: 'index' as const,
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
          ticks: {
            maxTicksLimit: 6,
          },
        },
        y: {
          beginAtZero: true,
          border: {
            dash: [4, 4],
          },
          grid: {
            color: 'rgba(148, 163, 184, 0.2)',
            drawBorder: false,
          },
          ticks: {
            callback: (value: number) => `$${value}`,
          },
        },
      },
    }),
    [],
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-[2fr,1fr]">
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Purchasing Trend</p>
              <CardTitle className="text-2xl font-semibold">Spend velocity</CardTitle>
            </div>
            <div className="rounded-full bg-primary/10 p-3 text-primary">
              <FiCreditCard className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-64">
              <Line data={chartData} options={chartOptions} />
            </div>
          </CardContent>
        </Card>

        <Card className="border-emerald-200/50 bg-gradient-to-br from-emerald-50 to-background">
          <CardHeader>
            <p className="text-xs uppercase tracking-wide text-emerald-600">Spending Health</p>
            <CardTitle className="text-3xl text-foreground">
              ${stats.totalCostCurrentYear.toLocaleString()}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Year-to-date purchasing cost ({new Date().getFullYear()})
            </p>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <FiShoppingBag className="h-4 w-4 text-emerald-600" />
              <span>{stats.recentPurchases.length} recorded purchase orders</span>
            </div>
            <div className="flex items-center gap-2">
              <FiCalendar className="h-4 w-4 text-emerald-600" />
              <span>Latest update {stats.recentPurchases[0] ? new Date(stats.recentPurchases[0].purchaseDate).toLocaleDateString() : 'N/A'}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Total Sales</p>
            <p className="text-2xl font-bold text-foreground">${stats.totalSales.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Lifetime revenue</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Average order value</p>
            <p className="text-2xl font-bold text-foreground">
              $
              {stats.recentPurchases.length
                ? Math.round(
                    stats.recentPurchases.reduce((sum, purchase) => sum + purchase.totalCost, 0) /
                      stats.recentPurchases.length,
                  ).toLocaleString()
                : 0}
            </p>
            <p className="text-sm text-muted-foreground">Trailing {stats.recentPurchases.length} orders</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Items purchased</p>
            <p className="text-2xl font-bold text-foreground">
              {stats.recentPurchases
                .reduce((sum, purchase) => sum + purchase.purchaseItems.length, 0)
                .toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">Across recent purchase orders</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent purchase activity</CardTitle>
          <p className="text-sm text-muted-foreground">
            Track procurement velocity and identify heavy buyers instantly.
          </p>
        </CardHeader>
        <CardContent className="divide-y divide-border/70">
          {stats.recentPurchases.map((purchase) => (
            <div key={purchase.id} className="flex flex-wrap items-center gap-4 py-4">
              <div className="flex min-w-[180px] flex-col">
                <p className="text-sm font-semibold text-foreground">{purchase.purchasedBy}</p>
                <span className="text-xs text-muted-foreground">
                  {new Date(purchase.purchaseDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex flex-1 flex-wrap gap-4 text-sm text-muted-foreground">
                <span>
                  {purchase.purchaseItems.length} item{purchase.purchaseItems.length === 1 ? '' : 's'}
                </span>
                <span className="font-semibold text-foreground">${purchase.totalCost.toLocaleString()}</span>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">
                  {purchase.status === 0
                    ? 'Pending'
                    : purchase.status === 1
                      ? 'Active'
                      : purchase.status === 2
                        ? 'Completed'
                        : 'Cancelled'}
                </span>
              </div>
            </div>
          ))}
          {!stats.recentPurchases.length && (
            <p className="py-6 text-center text-sm text-muted-foreground">No purchases have been recorded yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
