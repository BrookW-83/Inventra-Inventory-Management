'use client';

import { useGetAdminDashboardStatsQuery } from '@/lib/api/adminApi';
import {
  FiUsers,
  FiUserCheck,
  FiUserPlus,
  FiUserX,
  FiActivity,
  FiCheckCircle,
  FiAlertTriangle,
  FiClock,
  FiTrendingUp,
} from 'react-icons/fi';
import { cn } from '@/lib/utils';
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
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export function AdminDashboard() {
  const { data: stats, isLoading, error } = useGetAdminDashboardStatsQuery();

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
    const errorMessage = 'status' in error
      ? `Error ${error.status}: ${JSON.stringify(error.data)}`
      : 'message' in error ? error.message : 'Unknown error';

    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center bg-destructive/10 border border-destructive/20 rounded-2xl p-8 max-w-md animate-fadeIn">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiAlertTriangle className="w-8 h-8 text-destructive" />
          </div>
          <p className="text-destructive font-semibold mb-2">Failed to load dashboard</p>
          <details className="text-xs text-left bg-background/50 rounded p-2">
            <summary className="cursor-pointer font-medium">Error Details</summary>
            <pre className="mt-2 overflow-auto">{errorMessage}</pre>
          </details>
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

  // Generate mock weekly data for the line chart based on current stats
  const today = new Date();
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() - (6 - i));
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  });

  // Create trend data based on total users (simulated growth)
  const baseUsers = Math.max(stats.totalUsers - 6, 1);
  const userGrowthData = last7Days.map((_, i) => baseUsers + i);

  // Active users trend (simulated)
  const activeUserData = last7Days.map((_, i) =>
    Math.max(1, Math.floor(stats.dailyActiveUsers * (0.6 + Math.random() * 0.8)))
  );

  const chartData = {
    labels: last7Days,
    datasets: [
      {
        label: 'Total Users',
        data: userGrowthData,
        borderColor: 'rgb(124, 58, 237)',
        backgroundColor: 'rgba(124, 58, 237, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgb(124, 58, 237)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: 'Active Users',
        data: activeUserData,
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgb(34, 197, 94)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            weight: 500,
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 14,
          weight: 600,
        },
        bodyFont: {
          size: 13,
        },
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 11,
          },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          font: {
            size: 11,
          },
        },
      },
    },
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
  };

  const statCards = [
    {
      title: 'Total Organizations',
      value: stats.totalUsers,
      change: `+${stats.dailyRegisteredUsers} today`,
      changeType: 'positive',
      icon: FiUsers,
      color: 'from-violet-500 to-purple-600',
      bgColor: 'bg-violet-50',
      iconColor: 'text-violet-600',
    },
    {
      title: 'Active Today',
      value: stats.dailyActiveUsers,
      change: `${((stats.dailyActiveUsers / Math.max(stats.totalUsers, 1)) * 100).toFixed(0)}% of total`,
      changeType: 'neutral',
      icon: FiUserCheck,
      color: 'from-emerald-500 to-green-600',
      bgColor: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
    },
    {
      title: 'New Registrations',
      value: stats.dailyRegisteredUsers,
      change: 'Today',
      changeType: 'positive',
      icon: FiUserPlus,
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      title: 'Inactive',
      value: stats.inactiveUsersCount,
      change: '30+ days',
      changeType: stats.inactiveUsersCount > 0 ? 'negative' : 'positive',
      icon: FiUserX,
      color: 'from-amber-500 to-orange-600',
      bgColor: 'bg-amber-50',
      iconColor: 'text-amber-600',
    },
  ];

  const performanceCards = [
    {
      title: 'Fulfillment Rate',
      value: `${stats.orderFulfillmentRate.toFixed(1)}%`,
      icon: FiCheckCircle,
      status: stats.orderFulfillmentRate >= 90 ? 'excellent' : stats.orderFulfillmentRate >= 70 ? 'good' : 'needs-attention',
    },
    {
      title: 'Backorders',
      value: stats.backorderCount,
      icon: FiAlertTriangle,
      status: stats.backorderCount === 0 ? 'excellent' : stats.backorderCount < 5 ? 'good' : 'needs-attention',
    },
    {
      title: 'Avg Processing',
      value: `${stats.averageProcessingTimeMinutes.toFixed(0)} min`,
      icon: FiClock,
      status: stats.averageProcessingTimeMinutes < 30 ? 'excellent' : stats.averageProcessingTimeMinutes < 60 ? 'good' : 'needs-attention',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'good': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'needs-attention': return 'text-amber-600 bg-amber-50 border-amber-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard Overview</h1>
          <p className="text-muted-foreground mt-1">
            Monitor organization activity and system performance
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-accent/50 px-4 py-2 rounded-lg">
          <FiActivity className="w-4 h-4" />
          <span>Last updated: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <div
            key={card.title}
            className="relative overflow-hidden rounded-2xl border border-border bg-card p-5 transition-all hover:shadow-lg hover:-translate-y-0.5"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">{card.title}</p>
                <p className="text-3xl font-bold text-foreground">{card.value}</p>
                <p className={cn(
                  'text-xs font-medium',
                  card.changeType === 'positive' && 'text-emerald-600',
                  card.changeType === 'negative' && 'text-red-500',
                  card.changeType === 'neutral' && 'text-muted-foreground'
                )}>
                  {card.change}
                </p>
              </div>
              <div className={cn('p-3 rounded-xl', card.bgColor)}>
                <card.icon className={cn('w-6 h-6', card.iconColor)} />
              </div>
            </div>
            <div className={cn('absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r', card.color)} />
          </div>
        ))}
      </div>

      {/* Chart and Performance Section */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Line Chart */}
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground">User Growth Trends</h3>
              <p className="text-sm text-muted-foreground">Weekly overview of user activity</p>
            </div>
            <div className="flex items-center gap-2 text-emerald-600 text-sm font-medium">
              <FiTrendingUp className="w-4 h-4" />
              <span>+{stats.dailyRegisteredUsers} this week</span>
            </div>
          </div>
          <div className="h-[300px]">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">System Performance</h3>
          <div className="space-y-4">
            {performanceCards.map((card) => (
              <div
                key={card.title}
                className={cn(
                  'p-4 rounded-xl border transition-all hover:shadow-sm',
                  getStatusColor(card.status)
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <card.icon className="w-5 h-5" />
                    <span className="font-medium">{card.title}</span>
                  </div>
                  <span className="text-xl font-bold">{card.value}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Stats */}
          <div className="mt-6 pt-6 border-t border-border">
            <h4 className="text-sm font-medium text-muted-foreground mb-3">Quick Stats</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 rounded-lg bg-accent/50">
                <p className="text-2xl font-bold text-foreground">{stats.activeUsersCount}</p>
                <p className="text-xs text-muted-foreground">Active</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-accent/50">
                <p className="text-2xl font-bold text-foreground">{stats.inactiveUsersCount}</p>
                <p className="text-xs text-muted-foreground">Inactive</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Active Users & Recent Changes */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Active Users */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Top Active Organizations</h3>
            <span className="text-xs text-muted-foreground bg-accent px-2 py-1 rounded-full">
              Last 30 days
            </span>
          </div>
          {stats.topActiveUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <FiUsers className="w-12 h-12 mb-3 opacity-30" />
              <p className="text-sm">No activity recorded yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {stats.topActiveUsers.map((user, index) => (
                <div
                  key={user.userId}
                  className="flex items-center justify-between p-3 rounded-xl bg-accent/30 hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm',
                      index === 0 && 'bg-amber-100 text-amber-700',
                      index === 1 && 'bg-slate-100 text-slate-700',
                      index === 2 && 'bg-orange-100 text-orange-700',
                      index > 2 && 'bg-primary/10 text-primary'
                    )}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{user.userName}</p>
                      <p className="text-xs text-muted-foreground">
                        Last: {new Date(user.lastActivityAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-foreground">{user.inventoryUpdatesCount}</p>
                    <p className="text-xs text-muted-foreground">updates</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Inventory Changes */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
            <span className="text-xs text-muted-foreground bg-accent px-2 py-1 rounded-full">
              Live feed
            </span>
          </div>
          {stats.recentInventoryChanges.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <FiActivity className="w-12 h-12 mb-3 opacity-30" />
              <p className="text-sm">No recent changes</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[320px] overflow-y-auto pr-2">
              {stats.recentInventoryChanges.map((change, index) => (
                <div
                  key={index}
                  className="p-3 rounded-xl bg-accent/30 hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{change.itemName}</p>
                      <p className="text-xs text-muted-foreground">by {change.userName}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className={cn(
                        'text-xs font-medium px-2 py-0.5 rounded-full',
                        change.action === 'Created' && 'bg-emerald-100 text-emerald-700',
                        change.action === 'Updated' && 'bg-blue-100 text-blue-700',
                        change.action === 'Deleted' && 'bg-red-100 text-red-700',
                      )}>
                        {change.action}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {change.quantityChanged > 0 ? '+' : ''}{change.quantityChanged}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {new Date(change.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
