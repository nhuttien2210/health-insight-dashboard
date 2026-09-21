export type TrendDirection = 'up' | 'down' | 'stable'

export type Trend = {
  changePercent: number
  direction: TrendDirection
} | null

export type Sentiment = 'positive' | 'neutral' | 'attention'

export type ProgressTone = 'on-track' | 'close' | 'behind'

export type MetricAccent = 'activity' | 'sleep' | 'nutrition' | 'weight' | 'heart'
