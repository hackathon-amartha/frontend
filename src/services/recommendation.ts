import { createClient } from "@/lib/supabase/client";

const getSupabase = () => createClient();

export type ProductType = "Modal" | "Celengan" | "AmarthaLink";

export interface RecommendationData {
  userId: string;
  recommendation: ProductType;
  answers: Record<number, string>;
}

export interface SaveRecommendationResponse {
  success: boolean;
  message: string;
  data?: unknown;
}

export async function saveRecommendation(
  recommendation: ProductType,
  answers: Record<number, string>
): Promise<SaveRecommendationResponse> {
  try {
    const supabase = getSupabase();

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return {
        success: false,
        message: "User not authenticated",
      };
    }

    // Save recommendation to user_recommendations table
    const { data, error } = await supabase
      .from("user_recommendations")
      .upsert({
        user_id: user.id,
        recommendation: recommendation,
        answers: answers,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }, {
        onConflict: "user_id",
      });

    if (error) {
      console.error("Error saving recommendation:", error);
      return {
        success: false,
        message: error.message,
      };
    }

    // Also update user metadata with recommendation
    const { error: updateError } = await supabase.auth.updateUser({
      data: {
        recommendation: recommendation,
        onboarding_completed: true,
      },
    });

    if (updateError) {
      console.error("Error updating user metadata:", updateError);
      // Don't fail the whole operation if metadata update fails
    }

    return {
      success: true,
      message: "Recommendation saved successfully",
      data: data,
    };
  } catch (error) {
    console.error("Error saving recommendation:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to save recommendation",
    };
  }
}

export async function getRecommendation(): Promise<{
  recommendation: ProductType | null;
  answers: Record<number, string> | null;
}> {
  try {
    const supabase = getSupabase();

    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return { recommendation: null, answers: null };
    }

    const { data, error } = await supabase
      .from("user_recommendations")
      .select("recommendation, answers")
      .eq("user_id", user.id)
      .single();

    if (error || !data) {
      return { recommendation: null, answers: null };
    }

    return {
      recommendation: data.recommendation as ProductType,
      answers: data.answers as Record<number, string>,
    };
  } catch (error) {
    console.error("Error getting recommendation:", error);
    return { recommendation: null, answers: null };
  }
}
