import {
  validatePhoneNumber,
  validateCreatePhoneNumber,
  normalizePhoneNumber,
  formatValidationErrors,
} from '@/lib/validation'

describe('電話番号正規化', () => {
  test('日本の電話番号（0から始まる）', () => {
    expect(normalizePhoneNumber('090-1234-5678')).toBe('+819012345678')
    expect(normalizePhoneNumber('09012345678')).toBe('+819012345678')
  })

  test('既に+81が付いている', () => {
    expect(normalizePhoneNumber('+819012345678')).toBe('+819012345678')
  })

  test('国際番号形式', () => {
    expect(normalizePhoneNumber('+1234567890')).toBe('+1234567890')
  })
})

describe('エラーメッセージフォーマット', () => {
  test('複数のエラーメッセージ', () => {
    const errors = [
      'phone_number: 有効な電話番号を入力してください',
      'name: シナリオ名は必須です',
    ]
    
    const formatted = formatValidationErrors(errors)
    expect(formatted).toBe('phone_number: 有効な電話番号を入力してください\nname: シナリオ名は必須です')
  })
})

describe('基本的なバリデーション', () => {
  test('新規電話番号作成バリデーション', () => {
    const newPhoneNumber = {
      phone_number: '+819012345678',
      status: 'pending',
    }

    const result = validateCreatePhoneNumber(newPhoneNumber)
    expect(result.success).toBe(true)
  })
})