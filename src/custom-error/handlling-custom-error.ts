import { HttpException } from '@nestjs/common';

export const CustomError = {
  USER_IS_ACTIVE: () => new HttpException('user is active', 512),
  USER_IS_INACTIVE: () => new HttpException('user is inactive', 513),
  USER_VERIFY_OTP: () => new HttpException('user please verify otp step', 514),
  USER_COMPLETE_PROFILE: () => new HttpException('user please complete profile step', 515),
  USER_SOCIAL_MEDIA_LOGIN: () => new HttpException('you must login as social media account', 516),
}