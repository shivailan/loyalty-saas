"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/require-admin";
import { createAdminClient } from "@/lib/supabase/admin";

export async function setMerchantSuspended(
  merchantId: string,
  suspended: boolean,
): Promise<{ error: string | null }> {
  await requireAdmin();
  const supabase = createAdminClient();

  const { error } = await supabase
    .from("merchants")
    .update({ is_suspended: suspended })
    .eq("id", merchantId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/merchants");
  return { error: null };
}

export async function deleteMerchant(
  merchantId: string,
): Promise<{ error: string | null }> {
  await requireAdmin();
  const supabase = createAdminClient();

  const { error } = await supabase
    .from("merchants")
    .delete()
    .eq("id", merchantId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/merchants");
  return { error: null };
}
