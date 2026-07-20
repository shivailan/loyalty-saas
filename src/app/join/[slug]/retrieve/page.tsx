import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { RetrieveForm } from "./RetrieveForm";
import { Card } from "@/components/ui/Card";

export default async function RetrievePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = createAdminClient();

  const { data: merchant } = await supabase
    .from("merchants")
    .select("name")
    .eq("slug", slug)
    .maybeSingle();

  if (!merchant) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-50 px-6 py-12">
      <Card className="w-full max-w-sm">
        <h1 className="text-xl font-semibold text-neutral-900">
          Retrouver ma carte
        </h1>
        <p className="mt-2 text-sm text-neutral-600">
          Entrez l&apos;email utilisé lors de votre inscription chez{" "}
          {merchant.name}, nous vous renvoyons le lien vers votre carte.
        </p>
        <RetrieveForm slug={slug} />
      </Card>
    </div>
  );
}
