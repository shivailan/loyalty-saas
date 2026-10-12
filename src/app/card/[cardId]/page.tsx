import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { CardQrCode } from "./CardQrCode";
import { AddToWalletButton } from "./AddToWalletButton";
import { AddToGoogleWalletButton } from "./AddToGoogleWalletButton";
import { isAppleWalletConfigured } from "@/lib/wallet/config";
import { isGoogleWalletConfigured } from "@/lib/wallet/google/config";
import { Card } from "@/components/ui/Card";
import { cardColors } from "@/lib/card-colors";

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
      loyalty_programs ( visits_required, reward_description, merchants ( name, primary_color, secondary_color, logo_url ) )
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
  const { background, text } = cardColors(
    merchant?.primary_color,
    merchant?.secondary_color,
  );

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-50 px-6 py-12">
      <Card className="w-full max-w-sm overflow-hidden p-0!">
        <div
          className="p-6"
          style={{ backgroundColor: background, color: text }}
        >
          <div className="flex items-center gap-3">
            {merchant?.logo_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={merchant.logo_url}
                alt={merchant.name}
                className="h-12 w-12 rounded-lg bg-white/80 object-contain p-1"
              />
            )}
            <div>
              <h1 className="text-xl font-semibold">
                {merchant?.name ?? "Votre carte"}
              </h1>
              {customer?.first_name && (
                <p className="text-sm opacity-80">
                  Bonjour {customer.first_name}
                </p>
              )}
            </div>
          </div>

          <p className="mt-6 text-xs font-medium uppercase tracking-wide opacity-80">
            Passages
          </p>
          <p className="text-3xl font-bold">
            {stamps} sur {required}
          </p>
          <div
            className="mt-3 h-2.5 w-full rounded-full"
            style={{ backgroundColor: `${text}33` }}
          >
            <div
              className="h-2.5 rounded-full transition-all"
              style={{ width: `${progressPercent}%`, backgroundColor: text }}
            />
          </div>
          {program?.reward_description && (
            <p className="mt-3 text-sm opacity-90">
              Récompense :{" "}
              <span className="font-semibold">
                {program.reward_description}
              </span>
            </p>
          )}
        </div>

        <div className="p-6">
          <div>
            <p className="text-center text-sm text-neutral-600">
              Présentez ce QR code au commerçant à chaque passage :
            </p>
            <div className="mt-3">
              <CardQrCode cardId={card.id} />
            </div>
          </div>

          {isAppleWalletConfigured() && <AddToWalletButton cardId={card.id} />}
          {isGoogleWalletConfigured() && (
            <AddToGoogleWalletButton cardId={card.id} />
          )}

          <p className="mt-6 text-center text-xs text-neutral-500">
            Astuce : ajoutez cette page à votre écran d&apos;accueil pour y
            accéder en un geste, comme une vraie carte.
          </p>
        </div>
      </Card>
    </div>
  );
}
