interface ForgetPassword {
  email?: string;
  phone?: string;
  imageVerify: string;
  emailVerifyCode?: number;
  phoneVerifyCode?: number;
  newPassword: string;
  confirmPassword: string;
  emailOrPhone: number;
}
