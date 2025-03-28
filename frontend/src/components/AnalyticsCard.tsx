
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ReactNode } from "react";

interface AnalyticsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function AnalyticsCard({ title, value, description, icon, trend }: AnalyticsCardProps) {
  return (
    <Card className="card-glass border-0 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {title}
        </CardTitle>
        {icon && <div className="text-gray-400 dark:text-gray-500">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <CardDescription className="mt-1 text-xs">{description}</CardDescription>
        )}
        {trend && (
          <div className={`mt-2 flex items-center text-xs font-medium ${
            trend.isPositive ? 'text-green-500' : 'text-red-500'
          }`}>
            <span className="mr-1">
              {trend.isPositive ? '↑' : '↓'}
            </span>
            <span>{trend.value}%</span>
            <span className="ml-1 text-gray-500 dark:text-gray-400">vs last month</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
