import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

// Set to true to bypass OTP verification (for development)
const BYPASS_OTP = true;

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: unknown;
}

// Store phone number temporarily for registration flow
let pendingPhoneNumber: string | null = null;

// Login with phone number and PIN
export async function loginWithPhoneAndPin(
  phoneNumber: string,
  pin: string
): Promise<AuthResponse> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      phone: phoneNumber,
      password: pin,
    });

    if (error) {
      return { success: false, message: error.message };
    }

    return {
      success: true,
      message: "Login successful",
      data: data,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Login failed",
    };
  }
}

// Step 1: Send OTP to phone number
export async function sendOTP(phoneNumber: string): Promise<AuthResponse> {
  // Store phone for later use in bypass mode
  pendingPhoneNumber = phoneNumber;

  if (BYPASS_OTP) {
    // Bypass: Skip actual OTP sending
    return {
      success: true,
      message: "OTP sent successfully (bypass mode)",
      data: null,
    };
  }

  try {
    const { data, error } = await supabase.auth.signInWithOtp({
      phone: phoneNumber,
    });

    if (error) {
      return { success: false, message: error.message };
    }

    return {
      success: true,
      message: "OTP sent successfully",
      data: data,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to send OTP",
    };
  }
}

// Step 2: Verify OTP
export async function verifyOTP(
  phoneNumber: string,
  otp: string
): Promise<AuthResponse> {
  // Store phone for later use
  pendingPhoneNumber = phoneNumber;

  if (BYPASS_OTP) {
    // Bypass: Accept any OTP value
    return {
      success: true,
      message: "OTP verified successfully (bypass mode)",
      data: null,
    };
  }

  try {
    const { data, error } = await supabase.auth.verifyOtp({
      phone: phoneNumber,
      token: otp,
      type: "sms",
    });

    if (error) {
      return { success: false, message: error.message };
    }

    return {
      success: true,
      message: "OTP verified successfully",
      data: data,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "OTP verification failed",
    };
  }
}

// Step 3: Create PIN after OTP verification
export async function createPin(pin: string): Promise<AuthResponse> {
  if (BYPASS_OTP && pendingPhoneNumber) {
    // Bypass: Create user directly with phone and PIN
    try {
      const { data, error } = await supabase.auth.signUp({
        phone: pendingPhoneNumber,
        password: pin,
      });

      if (error) {
        return { success: false, message: error.message };
      }

      // Clear pending phone
      pendingPhoneNumber = null;

      // If session exists, user is logged in
      if (data.session) {
        return {
          success: true,
          message: "Account created and logged in successfully",
          data: data,
        };
      }

      // No session means phone confirmation is required in Supabase
      return {
        success: true,
        message: "Account created. Phone confirmation is required - please disable it in Supabase Dashboard.",
        data: { user: data.user, needsConfirmation: true },
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : "Failed to create account",
      };
    }
  }

  // Normal flow: Update existing user's password
  try {
    const { data, error } = await supabase.auth.updateUser({
      password: pin,
    });

    if (error) {
      return { success: false, message: error.message };
    }

    return {
      success: true,
      message: "PIN created successfully",
      data: data,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to create PIN",
    };
  }
}

// Logout
export async function logout(): Promise<AuthResponse> {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return { success: false, message: error.message };
    }

    return { success: true, message: "Logged out successfully" };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Logout failed",
    };
  }
}

// Get current session
export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    return null;
  }
  return data.session;
}

// Get current user
export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    return null;
  }
  return data.user;
}
