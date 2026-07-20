import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { CardQrCode } from "./CardQrCode";
import { Card } from "@/components/ui/Card";

const DEFAULT_ACCENT = "#FACC15";

export default async function CardPage({
  params,
}: {
  params: Promise<{ cardId: string }>;
}) {
  const { cardId } = await params;
  const supabase = createAdminClient();

  const { data: card } = await supabase
    .from("loyalty_cards")
    .select(
      `
      id,
      current_stamps,
      customers ( first_name ),
      loyalty_programs ( visits_required, reward_description, merchants ( name, primary_color, logo_url ) )
    `,
    )
    .eq("id", cardId)
    .maybeSingle();

  if (!card) {
    notFound();
  }

  const program = card.loyalty_programs;
  const merchant = program?.merchants;
  const customer = card.customers;

  const stamps = card.current_stamps;
  const required = program?.visits_required ?? 0;
  const progressPercent =
    required > 0 ? Math.min(100, (stamps / required) * 100) : 0;
  const accentColor =
    merchant?.primary_color && merchant.primary_color !== "#000000"
      ? merchant.primary_color
      : DEFAULT_ACCENT;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-50 px-6 py-12">
      <Card className="w-full max-w-sm">
        {merchant?.logo_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={merchant.logo_url}
            alt={merchant.name}
            className="mb-4 h-14 w-14 rounded-lg border border-neutral-200 object-contain"
          />
        )}
        <h1 className="text-xl font-semibold text-neutral-900">
          {merchant?.name ?? "Votre carte"}
        </h1>
        {customer?.first_name && (
          <p className="mt-1 text-sm text-neutral-600">
            Bonjour {customer.first_name}
          </p>
        )}

        <div className="mt-6">
          <div className="flex justify-between text-sm font-medium text-neutral-900">
            <span>
              {stamps} / {required} passages
            </span>
          </div>
          <div className="mt-2 h-2.5 w-full rounded-full bg-neutral-100">
            <div
              className="h-2.5 rounded-full transition-all"
              style={{
                width: `${progressPercent}%`,
                backgroundColor: accentColor,
              }}
            />
          </div>
          {program?.reward_description && (
            <p className="mt-2 text-sm text-neutral-600">
              Récompense :{" "}
              <span className="font-medium text-neutral-900">
                {program.reward_description}
              </span>
            </p>
          )}
        </div>

        <div className="mt-8">
          <p className="text-center text-sm text-neutral-600">
            Présentez ce QR code au commerçant à chaque passage :
          </p>
          <div className="mt-3">
            <CardQrCode cardId={card.id} />
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-neutral-500">
          Astuce : ajoutez cette page à votre écran d&apos;accueil pour y
          accéder en un geste, comme une vraie carte. L&apos;ajout à Apple
          Wallet arrive bientôt.
        </p>
      </Card>
    </div>
  );
}
