import { z } from 'zod'
import { PhoneNumber, CallLog, CallResponse, IVRScenario } from './database'

// バリデーション結果
export interface ValidationResult {
  success: boolean
  errors?: string[]
  data?: any
}

// キューの状態
export interface QueueStatus {
  pending: number
  processing: number
  completed: number
  failed: number
}

// 発信結果
export interface CallResult {
  callId: string
  status: 'initiated' | 'failed'
  twilioCallSid?: string
  error?: string
}

// 通話完了データ（SMS通知用）
export interface CallCompletionData {
  phoneNumber: string
  responses: CallResponse[]
  completedAt: Date
  priority: 'normal' | 'high'
  assignedPlan?: string
}

// リマインダーデータ
export interface ReminderData {
  phoneNumber: string
  followUpDate: Date
  responses: CallResponse[]
}

// ダッシュボード統計
export interface DashboardStats {
  totalCalls: number
  completedCalls: number
  pendingCalls: number
  failedCalls: number
  totalResponses: number
  averageCallDuration: number
  successRate: number
}

// 通話履歴フィルター
export const CallHistoryFiltersSchema = z.object({
  status: z.enum(['initiated', 'in_progress', 'completed', 'failed', 'no_answer']).optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
  phoneNumber: z.string().optional(),
  scenarioId: z.string().uuid().optional(),
  limit: z.number().positive().default(50),
  offset: z.number().nonnegative().default(0),
})

export type CallHistoryFilters = z.infer<typeof CallHistoryFiltersSchema>

// 回答データフィルター
export const ResponseFiltersSchema = z.object({
  callLogId: z.string().uuid().optional(),
  questionId: z.string().optional(),
  answerType: z.enum(['dtmf', 'voice']).optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
  limit: z.number().positive().default(50),
  offset: z.number().nonnegative().default(0),
})

export type ResponseFilters = z.infer<typeof ResponseFiltersSchema>

// 回答サマリー
export interface ResponseSummary {
  callLogId: string
  phoneNumber: string
  scenarioName: string
  completedAt: string
  responses: {
    questionId: string
    questionText: string
    answerValue?: string
    answerLabel?: string
    audioFileUrl?: string
  }[]
}

// 同期状況
export interface SyncStatus {
  lastSyncAt: Date
  status: 'connected' | 'disconnected' | 'error'
  errorMessage?: string
  pendingRecords: number
}

// Twilio Webhook データ
export interface TwilioWebhookData {
  CallSid: string
  From: string
  To: string
  CallStatus: string
  Direction: string
  Digits?: string
  RecordingUrl?: string
  RecordingSid?: string
  [key: string]: any
}

// エラー情報
export interface SystemError {
  id: string
  type: 'supabase' | 'twilio' | 'validation' | 'system'
  severity: 'low' | 'medium' | 'high'
  message: string
  details?: any
  timestamp: Date
  resolved: boolean
}

// エラー統計
export interface ErrorStats {
  total: number
  byType: Record<string, number>
  bySeverity: Record<string, number>
  recent: SystemError[]
}