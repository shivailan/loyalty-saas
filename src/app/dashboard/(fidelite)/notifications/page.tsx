import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { NotificationsForm } from "./NotificationsForm";
import { Card } from "@/components/ui/Card";

export default async function NotificationsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  const { data: merchant } = await supabase
    .from("merchants")
    .select("send_welcome_email, send_reward_email")
    .single();
  if (!merchant) {
    redirect("/login");
  }

  return (
    <div className="max-w-md">
      <h1 className="text-2xl font-bold text-neutral-900">Notifications</h1>
      <p className="mt-1 text-sm text-neutral-600">
        Choisissez les emails automatiques envoyés à vos clients.
      </p>
      <Card className="mt-6">
        <NotificationsForm
          defaultValues={{
            sendWelcomeEmail: merchant.send_welcome_email,
            sendRewardEmail: merchant.send_reward_email,
          }}
        />
      </Card>
    </div>
  );
}
