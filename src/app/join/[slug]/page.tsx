import Link from "next/link";
import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { JoinForm } from "./JoinForm";
import { Card } from "@/components/ui/Card";

export default async function JoinPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = createAdminClient();

  const { data: merchant } = await supabase
    .from("merchants")
    .select("id, name, is_suspended, logo_url")
    .eq("slug", slug)
    .maybeSingle();

  if (!merchant) {
    notFound();
  }

  const { data: program } = await supabase
    .from("loyalty_programs")
    .select("visits_required, reward_description")
    .eq("merchant_id", merchant.id)
    .eq("is_active", true)
    .maybeSingle();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-50 px-6 py-12">
      <Card className="w-full max-w-sm">
        {merchant.logo_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={merchant.logo_url}
            alt={merchant.name}
            className="mb-4 h-14 w-14 rounded-lg border border-neutral-200 object-contain"
          />
        )}
        <h1 className="text-xl font-semibold text-neutral-900">
          Bienvenue chez {merchant.name}
        </h1>
        {merchant.is_suspended ? (
          <p className="mt-2 text-sm text-red-600">
            Ce commerçant n&apos;accepte plus de nouvelles inscriptions pour
            le moment.
          </p>
        ) : program ? (
          <>
            <p className="mt-2 text-sm text-neutral-600">
              Cumulez {program.visits_required} passages pour obtenir :{" "}
              <span className="font-medium text-neutral-900">
                {program.reward_description}
              </span>
            </p>
            <JoinForm slug={slug} />
          </>
        ) : (
          <p className="mt-2 text-sm text-red-600">
            Ce commerçant n&apos;a pas encore activé son programme de
            fidélité.
          </p>
        )}
        <p className="mt-6 text-center text-sm text-neutral-600">
          Déjà inscrit ?{" "}
          <Link
            className="font-medium text-neutral-900 underline"
            href={`/join/${slug}/retrieve`}
          >
            Retrouvez votre carte
          </Link>
        </p>
      </Card>
    </div>
  );
}
