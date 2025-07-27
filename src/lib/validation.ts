import { z } from 'zod'
import { ValidationResult } from '@/types/services'
import {
  PhoneNumberSchema,
  IVRScenarioSchema,
  CallLogSchema,
  CallResponseSchema,
  SMSNotificationSchema,
  CreatePhoneNumberSchema,
  CreateIVRScenarioSchema,
  CreateCallLogSchema,
  CreateCallResponseSchema,
  CreateSMSNotificationSchema,
  UpdatePhoneNumberSchema,
  UpdateIVRScenarioSchema,
} from '@/types/database'

/**
 * 汎用バリデーション関数
 */
export function validateData<T>(schema: z.ZodSchema<T>, data: unknown): ValidationResult {
  try {
    const validatedData = schema.parse(data)
    return {
      success: true,
      data: validatedData,
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors?.map(err => `${err.path.join('.')}: ${err.message}`) || ['バリデーションエラーが発生しました'],
      }
    }
    return {
      success: false,
      errors: ['バリデーションエラーが発生しました'],
    }
  }
}

/**
 * 電話番号バリデーション
 */
export function validatePhoneNumber(data: unknown): ValidationResult {
  return validateData(PhoneNumberSchema, data)
}

export function validateCreatePhoneNumber(data: unknown): ValidationResult {
  return validateData(CreatePhoneNumberSchema, data)
}

export function validateUpdatePhoneNumber(data: unknown): ValidationResult {
  return validateData(UpdatePhoneNumberSchema, data)
}

/**
 * IVRシナリオバリデーション
 */
export function validateIVRScenario(data: unknown): ValidationResult {
  const result = validateData(IVRScenarioSchema, data)
  
  if (result.success && result.data) {
    // 追加のビジネスロジックバリデーション
    const scenario = result.data as any
    const additionalErrors = validateScenarioLogic(scenario)
    
    if (additionalErrors.length > 0) {
      return {
        success: false,
        errors: additionalErrors,
      }
    }
  }
  
  return result
}

export function validateCreateIVRScenario(data: unknown): ValidationResult {
  const result = validateData(CreateIVRScenarioSchema, data)
  
  if (result.success && result.data) {
    const scenario = result.data as any
    const additionalErrors = validateScenarioLogic(scenario)
    
    if (additionalErrors.length > 0) {
      return {
        success: false,
        errors: additionalErrors,
      }
    }
  }
  
  return result
}

export function validateUpdateIVRScenario(data: unknown): ValidationResult {
  return validateData(UpdateIVRScenarioSchema, data)
}

/**
 * シナリオのビジネスロジックバリデーション
 */
function validateScenarioLogic(scenario: any): string[] {
  const errors: string[] = []
  
  if (!scenario.scenario_data) {
    return errors
  }
  
  const { questions, transitions } = scenario.scenario_data
  
  if (!questions || questions.length === 0) {
    errors.push('少なくとも1つの質問が必要です')
    return errors
  }
  
  // 質問IDの重複チェック
  const questionIds = questions.map((q: any) => q.id)
  const duplicateIds = questionIds.filter((id: string, index: number) => questionIds.indexOf(id) !== index)
  if (duplicateIds.length > 0) {
    errors.push(`重複する質問ID: ${duplicateIds.join(', ')}`)
  }
  
  // 遷移の整合性チェック
  if (transitions) {
    for (const transition of transitions) {
      // 遷移元の質問が存在するかチェック
      if (!questionIds.includes(transition.from_question_id)) {
        errors.push(`存在しない質問IDからの遷移: ${transition.from_question_id}`)
      }
      
      // 遷移先の質問が存在するかチェック（nullでない場合）
      if (transition.to_question_id && !questionIds.includes(transition.to_question_id)) {
        errors.push(`存在しない質問IDへの遷移: ${transition.to_question_id}`)
      }
    }
  }
  
  // DTMFタイプの質問にはoptionsが必要
  for (const question of questions) {
    if (question.type === 'dtmf' && (!question.options || question.options.length === 0)) {
      errors.push(`DTMF質問「${question.text}」には選択肢が必要です`)
    }
  }
  
  return errors
}

/**
 * 通話ログバリデーション
 */
export function validateCallLog(data: unknown): ValidationResult {
  return validateData(CallLogSchema, data)
}

export function validateCreateCallLog(data: unknown): ValidationResult {
  return validateData(CreateCallLogSchema, data)
}

/**
 * 通話回答バリデーション
 */
export function validateCallResponse(data: unknown): ValidationResult {
  return validateData(CallResponseSchema, data)
}

export function validateCreateCallResponse(data: unknown): ValidationResult {
  return validateData(CreateCallResponseSchema, data)
}

/**
 * SMS通知バリデーション
 */
export function validateSMSNotification(data: unknown): ValidationResult {
  return validateData(SMSNotificationSchema, data)
}

export function validateCreateSMSNotification(data: unknown): ValidationResult {
  return validateData(CreateSMSNotificationSchema, data)
}

/**
 * 電話番号フォーマット正規化
 */
export function normalizePhoneNumber(phoneNumber: string): string {
  // 日本の電話番号の場合、+81を追加
  let normalized = phoneNumber.replace(/[^\d+]/g, '')
  
  if (normalized.startsWith('0')) {
    normalized = '+81' + normalized.substring(1)
  } else if (!normalized.startsWith('+')) {
    normalized = '+81' + normalized
  }
  
  return normalized
}

/**
 * バリデーションエラーメッセージの日本語化
 */
export function formatValidationErrors(errors: string[]): string {
  return errors.join('\n')
}