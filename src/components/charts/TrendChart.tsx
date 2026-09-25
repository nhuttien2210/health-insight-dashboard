import type { ComponentProps } from 'react'
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Line, LineChart, ReferenceLine, XAxis, YAxis } from 'recharts'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { cn } from '@/libs/cn'
import { formatCompact, formatShortDate } from '@/utils/format'

const MARGIN = { top: 8, right: 4, bottom: 0, left: 0 } as const

type DatedPoint = { date: string }

type TrendYAxis = {
  width?: number
  domain?: ComponentProps<typeof YAxis>['domain']
  tickFormatter?: (value: number) => string
}

type TrendChartBase<T extends DatedPoint> = {
  data: T[]
  config: ChartConfig
  ariaLabel: string
  className?: string
  yAxis?: TrendYAxis
  target?: number
  formatValue: (value: number, name: string) => string
}

function trendChrome({
  yAxis,
  target,
  formatValue,
}: {
  yAxis?: TrendYAxis
  target?: number
  formatValue: (value: number, name: string) => string
}) {
  return [
    <CartesianGrid key="grid" vertical={false} strokeDasharray="3 3" />,
    <XAxis
      key="x"
      dataKey="date"
      tickLine={false}
      axisLine={false}
      tickMargin={8}
      minTickGap={24}
      interval="preserveStartEnd"
      tickFormatter={formatShortDate}
    />,
    <YAxis
      key="y"
      width={yAxis?.width ?? 44}
      domain={yAxis?.domain}
      tickLine={false}
      axisLine={false}
      tickFormatter={yAxis?.tickFormatter ?? ((value: number) => formatCompact(value))}
    />,
    <ChartTooltip
      key="tooltip"
      content={
        <ChartTooltipContent
          labelFormatter={(value) => formatShortDate(String(value))}
          formatter={(value, name) => formatValue(Number(value), String(name))}
        />
      }
    />,
    target !== undefined ? (
      <ReferenceLine
        key="target"
        y={target}
        stroke="var(--muted-foreground)"
        strokeDasharray="4 4"
        strokeWidth={1}
      />
    ) : null,
  ]
}

export function BarTrendChart<T extends DatedPoint>({
  data,
  dataKey,
  config,
  ariaLabel,
  className,
  yAxis,
  target,
  formatValue,
}: TrendChartBase<T> & { dataKey: string }) {
  return (
    <ChartContainer config={config} className={cn('h-[240px] w-full', className)} aria-label={ariaLabel}>
      <BarChart data={data} margin={MARGIN}>
        {trendChrome({ yAxis, target, formatValue })}
        <Bar dataKey={dataKey} fill={`var(--color-${dataKey})`} radius={[3, 3, 0, 0]} maxBarSize={28} />
      </BarChart>
    </ChartContainer>
  )
}

export function LineTrendChart<T extends DatedPoint>({
  data,
  dataKey,
  config,
  ariaLabel,
  className,
  yAxis,
  target,
  formatValue,
}: TrendChartBase<T> & { dataKey: string }) {
  return (
    <ChartContainer config={config} className={cn('h-[240px] w-full', className)} aria-label={ariaLabel}>
      <LineChart data={data} margin={MARGIN}>
        {trendChrome({ yAxis, target, formatValue })}
        <Line
          type="monotone"
          dataKey={dataKey}
          stroke={`var(--color-${dataKey})`}
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
        />
      </LineChart>
    </ChartContainer>
  )
}

export type StackedAreaSeries = {
  dataKey: string
  fillOpacity: number
}

export function StackedAreaTrendChart<T extends DatedPoint>({
  data,
  series,
  stackId,
  config,
  ariaLabel,
  className,
  yAxis,
  target,
  formatValue,
}: TrendChartBase<T> & { series: StackedAreaSeries[]; stackId: string }) {
  return (
    <ChartContainer config={config} className={cn('h-[240px] w-full', className)} aria-label={ariaLabel}>
      <AreaChart data={data} margin={MARGIN}>
        {trendChrome({ yAxis, target, formatValue })}
        {series.map((item) => (
          <Area
            key={item.dataKey}
            type="monotone"
            dataKey={item.dataKey}
            stackId={stackId}
            stroke={`var(--color-${item.dataKey})`}
            fill={`var(--color-${item.dataKey})`}
            fillOpacity={item.fillOpacity}
          />
        ))}
        <ChartLegend content={<ChartLegendContent />} />
      </AreaChart>
    </ChartContainer>
  )
}
