import { z } from 'zod'

// 電話番号データのスキーマ
export const PhoneNumberSchema = z.object({
  id: z.string().uuid(),
  phone_number: z.string().regex(/^\+?[1-9]\d{1,14}$/, '有効な電話番号を入力してください'),
  status: z.enum(['pending', 'calling', 'completed', 'failed', 'no_interest']).default('pending'),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  metadata: z.record(z.any()).optional(),
  assigned_sales_person: z.string().optional(),
})

export type PhoneNumber = z.infer<typeof PhoneNumberSchema>

// IVRシナリオのスキーマ
export const QuestionSchema = z.object({
  id: z.string(),
  text: z.string().min(1, '質問文は必須です'),
  type: z.enum(['dtmf', 'voice_recording']),
  options: z.array(z.object({
    key: z.string(),
    label: z.string(),
    value: z.string(),
  })).optional(),
  required: z.boolean().default(true),
  max_length: z.number().positive().optional(),
})

export type Question = z.infer<typeof QuestionSchema>

export const TransitionSchema = z.object({
  from_question_id: z.string(),
  condition: z.string(), // 条件式（例: "answer === '1'"）
  to_question_id: z.string().optional(), // nullの場合は終了
})

export type Transition = z.infer<typeof TransitionSchema>

export const IVRScenarioSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'シナリオ名は必須です'),
  description: z.string().optional(),
  scenario_data: z.object({
    questions: z.array(QuestionSchema),
    transitions: z.array(TransitionSchema),
  }),
  twilio_flow_sid: z.string().optional(),
  is_active: z.boolean().default(true),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
})

export type IVRScenario = z.infer<typeof IVRScenarioSchema>

// 通話ログのスキーマ
export const CallLogSchema = z.object({
  id: z.string().uuid(),
  phone_number_id: z.string().uuid(),
  twilio_call_sid: z.string().optional(),
  scenario_id: z.string().uuid(),
  status: z.enum(['initiated', 'in_progress', 'completed', 'failed', 'no_answer']).default('initiated'),
  started_at: z.string().datetime(),
  completed_at: z.string().datetime().optional(),
  duration: z.number().nonnegative().optional(),
  error_message: z.string().optional(),
})

export type CallLog = z.infer<typeof CallLogSchema>

// 通話回答のスキーマ
export const CallResponseSchema = z.object({
  id: z.string().uuid(),
  call_log_id: z.string().uuid(),
  question_id: z.string(),
  question_text: z.string(),
  answer_type: z.enum(['dtmf', 'voice']),
  answer_value: z.string().optional(),
  answer_label: z.string().optional(),
  audio_file_url: z.string().url().optional(),
  created_at: z.string().datetime(),
})

export type CallResponse = z.infer<typeof CallResponseSchema>

// SMS通知のスキーマ
export const SMSNotificationSchema = z.object({
  id: z.string().uuid(),
  call_log_id: z.string().uuid(),
  recipient_phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, '有効な電話番号を入力してください'),
  message_content: z.string().min(1, 'メッセージ内容は必須です'),
  twilio_message_sid: z.string().optional(),
  status: z.enum(['pending', 'sent', 'failed', 'delivered']).default('pending'),
  sent_at: z.string().datetime().optional(),
  retry_count: z.number().nonnegative().default(0),
  created_at: z.string().datetime(),
})

export type SMSNotification = z.infer<typeof SMSNotificationSchema>

// API リクエスト/レスポンス用のスキーマ
export const CreatePhoneNumberSchema = PhoneNumberSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
})

export const UpdatePhoneNumberSchema = PhoneNumberSchema.partial().omit({
  id: true,
  created_at: true,
})

export const CreateIVRScenarioSchema = IVRScenarioSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
})

export const UpdateIVRScenarioSchema = IVRScenarioSchema.partial().omit({
  id: true,
  created_at: true,
})

export const CreateCallLogSchema = CallLogSchema.omit({
  id: true,
  started_at: true,
})

export const CreateCallResponseSchema = CallResponseSchema.omit({
  id: true,
  created_at: true,
})

export const CreateSMSNotificationSchema = SMSNotificationSchema.omit({
  id: true,
  created_at: true,
})