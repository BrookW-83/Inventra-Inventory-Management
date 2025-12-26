'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardStats } from '@/types';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';
import type { ChartData, ChartOptions, ScriptableContext, TooltipItem } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { FiTrendingUp, FiTarget, FiBox } from 'react-icons/fi';
import { useMemo } from 'react';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

interface InventoryOverviewProps {
  stats: DashboardStats;
}

const sectionColors = ['from-blue-500/80', 'from-emerald-500/80', 'from-orange-500/80', 'from-purple-500/80'];

export function InventoryOverview({ stats }: InventoryOverviewProps) {
  const usagePercentage =
    stats.totalInventoryCapacity > 0
      ? (stats.usedInventoryCapacity / stats.totalInventoryCapacity) * 100
      : 0;

  const chartData = useMemo<ChartData<'bar'>>(
    () => ({
      labels: ['Total Capacity', 'Used Capacity'],
      datasets: [
        {
          label: 'Inventory Capacity',
          data: [stats.totalInventoryCapacity, stats.usedInventoryCapacity],
          backgroundColor: (context: ScriptableContext<'bar'>) => {
            const { ctx, chartArea } = context.chart;
            if (!chartArea) return 'rgba(59, 130, 246, 0.3)';
            const gradient = ctx.createLinearGradient(chartArea.left, chartArea.bottom, chartArea.left, chartArea.top);
            if (context.dataIndex === 0) {
              gradient.addColorStop(0, 'rgba(59, 130, 246, 0.2)');
              gradient.addColorStop(1, 'rgba(99, 102, 241, 0.6)');
            } else {
              gradient.addColorStop(0, 'rgba(16, 185, 129, 0.15)');
              gradient.addColorStop(1, 'rgba(45, 212, 191, 0.6)');
            }
            return gradient;
          },
          borderColor: (context: ScriptableContext<'bar'>) =>
            context.dataIndex === 0 ? 'rgba(59, 130, 246, 0.9)' : 'rgba(16, 185, 129, 0.9)',
          borderWidth: 2,
          borderRadius: 18,
          barThickness: 70,
          borderSkipped: false,
        },
      ],
    }),
    [stats.totalInventoryCapacity, stats.usedInventoryCapacity],
  );

  const chartOptions = useMemo<ChartOptions<'bar'>>(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          backgroundColor: '#0f172a',
          borderColor: '#334155',
          borderWidth: 1,
          padding: 12,
          callbacks: {
            label: (tooltipItem: TooltipItem<'bar'>) =>
              `${tooltipItem.dataset.label}: ${tooltipItem.parsed.y ?? tooltipItem.parsed.x ?? 0}`,
          },
        },
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
          ticks: {
            font: { weight: 600 as const },
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
            callback: (value: string | number) => `${value}`,
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
              <p className="text-sm font-medium text-muted-foreground">Capacity Utilization</p>
              <CardTitle className="text-2xl font-semibold">Storage health</CardTitle>
            </div>
            <div className="rounded-full bg-primary/10 p-3 text-primary">
              <FiTrendingUp className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-64">
              <Bar data={chartData} options={chartOptions} />
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-background to-background">
          <CardHeader>
            <p className="text-xs uppercase tracking-wide text-primary">Live Insight</p>
            <CardTitle className="text-3xl">
              {usagePercentage.toFixed(1)}% <span className="text-base text-muted-foreground">utilized</span>
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {stats.usedInventoryCapacity.toLocaleString()} of {stats.totalInventoryCapacity.toLocaleString()} units in
              storage
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-2 rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary via-primary/80 to-primary/60"
                style={{ width: `${usagePercentage}%` }}
              />
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl border border-primary/20 bg-background/80 p-3">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Total items stored</p>
                <p className="text-lg font-semibold text-foreground">{stats.totalItemsStored.toLocaleString()}</p>
              </div>
              <div className="rounded-xl border border-primary/20 bg-background/80 p-3">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Remaining capacity</p>
                <p className="text-lg font-semibold text-foreground">
                  {(stats.totalInventoryCapacity - stats.usedInventoryCapacity).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          {
            title: 'Stock on hand',
            value: stats.usedInventoryCapacity.toLocaleString(),
            helper: 'Units currently available',
            icon: FiBox,
          },
          {
            title: 'Inventory throughput',
            value: stats.recentInventoryLogs.length ? `${stats.recentInventoryLogs.length} logs` : 'No activity',
            helper: 'Movements this week',
            icon: FiTarget,
          },
          {
            title: 'Avg. section utilization',
            value: `${(
              stats.sectionCapacities.reduce((acc, curr) => acc + curr.usagePercentage, 0) /
              stats.sectionCapacities.length
            ).toFixed(1)}%`,
            helper: 'Across all storage zones',
            icon: FiTrendingUp,
          },
        ].map((card) => (
          <Card key={card.title}>
            <CardContent className="flex items-center gap-4 pt-6">
              <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                <card.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">{card.title}</p>
                <p className="text-xl font-bold text-foreground">{card.value}</p>
                <p className="text-sm text-muted-foreground">{card.helper}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Section utilization</CardTitle>
          <p className="text-sm text-muted-foreground">
            Monitor which areas are nearing capacity to rebalance inventory.
          </p>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          {stats.sectionCapacities.map((section, index) => (
            <div
              key={`section-${section.section}`}
              className="rounded-2xl border border-border/60 bg-muted/40 p-4 shadow-sm"
            >
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-semibold text-foreground">
                  Section {String.fromCharCode(65 + section.section)}
                </p>
                <span className="text-xs text-muted-foreground">{section.usagePercentage.toFixed(1)}% used</span>
              </div>
              <div className="h-2 rounded-full bg-background">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${sectionColors[index % sectionColors.length]} to-transparent`}
                  style={{ width: `${section.usagePercentage}%` }}
                />
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                <span>Used: {section.usedCapacity.toLocaleString()}</span>
                <span>Remaining: {section.remainingCapacity.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent inventory movements</CardTitle>
          <p className="text-sm text-muted-foreground">
            Latest adjustments from team members and automations.
          </p>
        </CardHeader>
        <CardContent>
          <div className="relative space-y-6 before:absolute before:left-3 before:top-0 before:h-full before:w-px before:bg-border">
            {stats.recentInventoryLogs.map((log) => (
              <div key={log.id} className="relative flex gap-4 pl-8">
                <span className="absolute left-0 top-2 h-3 w-3 rounded-full bg-primary shadow-md shadow-primary/40" />
                <div className="flex-1 rounded-2xl border border-border/70 bg-card/90 p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-foreground">{log.itemName}</p>
                    <span className="text-xs text-muted-foreground">
                      {new Date(log.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {log.action} &bull; {log.quantityChanged} units &bull; by {log.performedBy}
                  </p>
                </div>
              </div>
            ))}
            {!stats.recentInventoryLogs.length && (
              <p className="text-center text-sm text-muted-foreground">No recent adjustments recorded.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
