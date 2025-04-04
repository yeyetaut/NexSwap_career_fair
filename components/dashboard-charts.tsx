"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Chart, ChartContainer, ChartTooltipContent, ChartLegend, ChartLegendItem } from "@/components/ui/chart"
import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart as RechartsLineChart,
  Pie,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

const applicantsByRoleData = [
  { name: "Software Engineer", value: 420 },
  { name: "Product Manager", value: 240 },
  { name: "UX Designer", value: 180 },
  { name: "Data Scientist", value: 150 },
  { name: "DevOps Engineer", value: 120 },
  { name: "Marketing", value: 90 },
  { name: "Sales", value: 48 },
]

const matchRelevanceData = [
  { name: "Excellent", value: 35, color: "#22c55e" },
  { name: "Good", value: 45, color: "#3b82f6" },
  { name: "Average", value: 15, color: "#f59e0b" },
  { name: "Poor", value: 5, color: "#ef4444" },
]

const applicationTrendsData = [
  { name: "Jan", applications: 65, interviews: 28 },
  { name: "Feb", applications: 59, interviews: 24 },
  { name: "Mar", applications: 80, interviews: 35 },
  { name: "Apr", applications: 81, interviews: 40 },
  { name: "May", applications: 56, interviews: 29 },
  { name: "Jun", applications: 55, interviews: 25 },
  { name: "Jul", applications: 40, interviews: 18 },
  { name: "Aug", applications: 70, interviews: 32 },
  { name: "Sep", applications: 90, interviews: 42 },
  { name: "Oct", applications: 110, interviews: 55 },
  { name: "Nov", applications: 120, interviews: 60 },
  { name: "Dec", applications: 85, interviews: 45 },
]

export function DashboardCharts() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Applicants by Role</CardTitle>
          <CardDescription>Distribution of applicants across different job roles</CardDescription>
        </CardHeader>
        <CardContent>
          <Chart className="h-80">
            <ChartContainer>
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart
                  data={applicantsByRoleData}
                  layout="vertical"
                  margin={{ top: 0, right: 0, bottom: 0, left: 80 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={80} />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                </RechartsBarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </Chart>
        </CardContent>
      </Card>

      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Match Relevance Score</CardTitle>
          <CardDescription>Quality of matches between applicants and positions</CardDescription>
        </CardHeader>
        <CardContent>
          <Chart className="h-80">
            <ChartContainer>
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={matchRelevanceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {matchRelevanceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltipContent />} />
                </RechartsPieChart>
              </ResponsiveContainer>
            </ChartContainer>
            <ChartLegend className="mt-4 justify-center gap-6">
              {matchRelevanceData.map((entry, index) => (
                <ChartLegendItem key={index} color={entry.color} name={`${entry.name} (${entry.value}%)`} />
              ))}
            </ChartLegend>
          </Chart>
        </CardContent>
      </Card>

      <Card className="col-span-1 md:col-span-2 lg:col-span-1">
        <CardHeader>
          <CardTitle>Application Trends</CardTitle>
          <CardDescription>Applications and interviews over time</CardDescription>
        </CardHeader>
        <CardContent>
          <Chart className="h-80">
            <ChartContainer>
              <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart data={applicationTrendsData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="applications" stroke="#3b82f6" strokeWidth={2} />
                  <Line type="monotone" dataKey="interviews" stroke="#22c55e" strokeWidth={2} />
                </RechartsLineChart>
              </ResponsiveContainer>
            </ChartContainer>
            <ChartLegend className="mt-4 justify-center gap-6">
              <ChartLegendItem color="#3b82f6" name="Applications" />
              <ChartLegendItem color="#22c55e" name="Interviews" />
            </ChartLegend>
          </Chart>
        </CardContent>
      </Card>
    </div>
  )
}

