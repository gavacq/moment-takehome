import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts"
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import type { Measurement } from "@/lib/api"
import { useMemo } from "react"

interface VoltageChartProps {
  data: Measurement[];
  startTime: number;
  endTime: number;
}

const chartConfig = {
  voltage: {
    label: "Voltage",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export function VoltageChart({ data, startTime, endTime }: VoltageChartProps) {
  
  const chartData = useMemo(() => {
    return data.map((d) => ({
        timestamp: new Date(d.timestamp).toLocaleString(),
        rawTimestamp: new Date(d.timestamp).getTime(),
        voltage: d.voltage
    }))
  }, [data]);

  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full h-[400px]">
      <AreaChart
        accessibilityLayer
        data={chartData}
        margin={{
          left: 12,
          right: 12,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="rawTimestamp"
          type="number"
          domain={[startTime, endTime]}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => {
             const date = new Date(value);
             return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          }}
          minTickGap={32}
        />
        <YAxis 
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            domain={[0, 5]}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="line" />}
        />
        <Area
          dataKey="voltage"
          type="monotone"
          fill="var(--color-voltage)"
          fillOpacity={0.4}
          stroke="var(--color-voltage)"
        />
      </AreaChart>
    </ChartContainer>
  )
}
