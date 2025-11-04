/* eslint-disable @typescript-eslint/no-explicit-any */
export interface UserInterface {
  authTokenIssuedAt: number;
  authorizedOtp: number;
  countryCode: string;
  contactNumber: string;
  created: string;
  email: string;
  failedLoginAttempts: number;
  firstName: string;
  isDeleted: boolean;
  isSuspended: boolean;
  isVerified: boolean;
  lastName: string;
  role: string;
  preventLoginTill: number;
  resetToken: string;
  updated: string;
  __v: number;
  id: string;
  mobileNumber: any;
  mobile: any;
  name: string;
}

export interface LoginRequest {
  mobileNumber: string;
  // mobile: string;
}

export interface LoginResponse {
  // status: boolean;
  success: boolean;
  mobile: number;
  data: {
    token: string;
    user: UserInterface | undefined;
  };
  message: string;
}
export interface VerifyOTPRequest {
  mobileNumber: any;
  otp: string;
}

export interface VerifyOTPResponse {
  success: boolean;
  data: undefined;
  access_token?: string;
  message?: string;
}
