import { z } from 'zod'

/** The contract the model is asked to fill. Every field except `answer` is optional. */
export const assistantReplySchema = z.object({
  answer: z.string().min(1),
  highlights: z
    .array(
      z.object({
        label: z.string(),
        value: z.string(),
        sentiment: z.enum(['positive', 'neutral', 'attention']).catch('neutral'),
      }),
    )
    .max(4)
    .default([]),
  suggestions: z.array(z.string()).max(3).default([]),
  referencedMetrics: z.array(z.string()).max(8).default([]),
  followUpQuestions: z.array(z.string()).max(3).default([]),
})

export const chatMessageSchema = z.object({
  id: z.string(),
  role: z.enum(['user', 'assistant']),
  createdAt: z.string(),
  content: z.string(),
  reply: assistantReplySchema.optional(),
  status: z.enum(['pending', 'done', 'error']),
  errorCode: z.string().optional(),
})

export const periodSnapshotSchema = z.object({
  days: z.number(),
  avgSteps: z.number(),
  avgActiveMinutes: z.number(),
  avgSleepMinutes: z.number(),
  avgSleepScore: z.number(),
  avgCalories: z.number(),
  avgProteinG: z.number(),
  avgWaterMl: z.number(),
  avgRestingHeartRate: z.number(),
  latestWeightKg: z.number(),
  totalWorkouts: z.number(),
})

export const healthContextSchema = z.object({
  generatedAt: z.string(),
  profile: z.object({
    name: z.string(),
    age: z.number(),
    sex: z.string(),
    heightCm: z.number(),
    weightKg: z.number(),
    activityLevel: z.string(),
    goals: z.array(z.string()),
    bmi: z.number(),
    bmiCategory: z.string(),
  }),
  targets: z.object({
    steps: z.number(),
    calories: z.number(),
    proteinG: z.number(),
    waterMl: z.number(),
    sleepMinutes: z.number(),
    activeMinutes: z.number(),
  }),
  last7: periodSnapshotSchema,
  last30: periodSnapshotSchema,
  previous7: periodSnapshotSchema,
  trends: z.record(
    z.string(),
    z.object({ changePercent: z.number(), direction: z.string() }).nullable(),
  ),
  goalProgress: z.array(
    z.object({
      goal: z.string(),
      metric: z.string(),
      current: z.number(),
      target: z.number(),
      percentComplete: z.number(),
    }),
  ),
  streaks: z.object({ stepGoal: z.number(), sleepGoal: z.number() }),
  recentWorkouts: z.array(
    z.object({
      date: z.string(),
      type: z.string(),
      durationMinutes: z.number(),
      caloriesBurned: z.number(),
    }),
  ),
  recommendations: z.array(z.object({ title: z.string(), reason: z.string() })),
  wellnessScore: z.number(),
  missingData: z.array(z.string()),
})
