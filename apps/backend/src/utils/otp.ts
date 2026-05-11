import crypto from 'crypto';

const OTP_DIGIT_MIN = 100_000;
const OTP_DIGIT_MAX = 999_999;

export const OTP_EXPIRY_MINUTES = 5;
export const RESET_TOKEN_EXPIRY_MINUTES = 15;
export const REFRESH_TOKEN_EXPIRY_DAYS = 7;

export function generateOtp(): string {
  return crypto.randomInt(OTP_DIGIT_MIN, OTP_DIGIT_MAX).toString();
}
