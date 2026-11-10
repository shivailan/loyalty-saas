import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";
import { navGroupsFor } from "./nav-items";
import { iconMap } from "@/lib/icons";
import { hasLoyalty, lockedFeatures } from "@/lib/billing/access";
import { LOCKED_MESSAGE } from "@/lib/features";
import { Lock } from "lucide-react";
import { includesCommande, parseOffer } from "@/lib/offers";
import { createHandoffToken } from "@/lib/integrations/handoff";
import { fetchOrdersPage } from "@/lib/integrations/orders-page";
import {
  OnboardingChecklist,
  type OnboardingStep,
} from "./OnboardingChecklist";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: merchant } = await supabase
    .from("merchants")
    .select(
      "id, name, slug, logo_url, primary_color, poster_downloaded_at, billing_exempt, subscription_plan, offer, integration_key_hint",
    )
    .single();

  // Guide de démarrage : chaque étape se coche d'après les données réelles.
  const [{ data: program }, { count: customerCount }, { count: visitCount }] =
    merchant
      ? await Promise.all([
          supabase
            .from("loyalty_programs")
            .select("is_active")
            .eq("merchant_id", merchant.id)
            .maybeSingle(),
          supabase
            .from("customers")
            .select("id", { count: "exact", head: true }),
          supabase.from("visits").select("id", { count: "exact", head: true }),
        ])
      : [{ data: null }, { count: 0 }, { count: 0 }];

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const hasLogo = Boolean(merchant?.logo_url);
  // « #000000 » est l'ancienne valeur par défaut : couleur pas encore choisie.
  const hasColor = Boolean(
    merchant?.primary_color && merchant.primary_color !== "#000000",
  );

  const steps: OnboardingStep[] = [
    {
      key: "program",
      title: "Définissez votre récompense",
      description:
        "Choisissez le nombre de passages et ce que vous offrez (par exemple : 10 cafés, le 11e offert). Sans cela, vos clients ne peuvent pas s'inscrire.",
      done: Boolean(program?.is_active),
      actionLabel: "Définir ma récompense",
      href: "/dashboard/program",
    },
    {
      key: "branding",
      title: "Personnalisez votre carte",
      description:
        "Ajoutez votre logo et choisissez vos couleurs : c'est ce que vos clients verront sur leur téléphone.",
      hint: `Logo : ${hasLogo ? "ajouté" : "à ajouter"} · Couleurs : ${hasColor ? "choisies" : "à choisir"}`,
      done: hasLogo && hasColor,
      actionLabel: "Personnaliser ma carte",
      href: "/dashboard/branding",
    },
    {
      key: "poster",
      title: "Téléchargez votre affiche",
      description:
        "Une affiche A4 avec votre QR code, prête à imprimer et à poser en caisse ou en vitrine.",
      done: Boolean(merchant?.poster_downloaded_at),
      actionLabel: "Télécharger mon affiche",
      href: "/dashboard/qr-code",
    },
    {
      key: "first-customer",
      title: "Inscrivez votre premier client",
      description:
        "Le plus simple : ouvrez votre lien d'inscription sur votre téléphone et créez votre propre carte pour voir ce que vivent vos clients.",
      done: (customerCount ?? 0) > 0,
      actionLabel: "Ouvrir mon lien d'inscription",
      href: merchant
        ? `${siteUrl}/join/${merchant.slug}`
        : "/dashboard/qr-code",
      external: true,
    },
    {
      key: "first-visit",
      title: "Ajoutez un premier passage",
      description:
        "Ouvrez le scanner et visez le QR code de la carte du client : le passage est ajouté tout seul.",
      done: (visitCount ?? 0) > 0,
      actionLabel: "Ouvrir le scanner",
      href: "/dashboard/scan",
    },
  ];
  const onboardingDone = steps.every((step) => step.done);
  const locked = merchant ? lockedFeatures(merchant) : [];
  const loyalty = merchant ? hasLoyalty(merchant) : true;
  const navGroups = navGroupsFor(loyalty);

  // Offre avec prise de commande : proposer de créer la page de commande, déjà
  // reliée à la fidélité (la clé de liaison est posée automatiquement).
  const wantsCommande = merchant ? includesCommande(parseOffer(merchant.offer)) : false;
  // Page déjà créée : on retrouve son adresse pour proposer d'y aller. Si
  // l'application de commande ne la connaît plus (page supprimée), on repart
  // comme au premier jour : proposer d'en créer une.
  const ordersPage =
    merchant && wantsCommande && merchant.integration_key_hint
      ? await fetchOrdersPage(merchant.id)
      : null;
  const ordersSlug = ordersPage?.status === "found" ? ordersPage.slug : null;
  const ordersLookupFailed = ordersPage?.status === "error";
  const commandeLinked =
    Boolean(merchant?.integration_key_hint) && ordersPage?.status !== "missing";
  const handoffToken =
    merchant && wantsCommande && !commandeLinked && user.email
      ? createHandoffToken(merchant.id, user.email, loyalty)
      : null;

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900">
        Bienvenue{merchant ? `, ${merchant.name}` : ""}
      </h1>
      <p className="mt-1 text-sm text-neutral-600">
        Connecté en tant que {user.email}
      </p>

      {wantsCommande && (
        <div className="mt-8 rounded-2xl border border-yellow-300 bg-yellow-50 p-5">
          <h2 className="font-semibold text-neutral-900">
            KeepMe Order : votre page de commande à emporter
          </h2>
          {commandeLinked ? (
            <>
              <p className="mt-1 text-sm text-neutral-600">
                {loyalty
                  ? "Votre page de commande est créée et reliée à votre carte de fidélité : chaque commande retirée ajoute un passage à vos clients qui l'ont demandé."
                  : "Votre page de commande est créée. Gérez vos commandes, votre carte et vos horaires depuis son espace."}
              </p>
              {ordersLookupFailed && (
                <p className="mt-3 text-sm text-neutral-700">
                  Impossible de retrouver l&apos;adresse de votre page pour le moment.{" "}
                  <a href="/dashboard" className="font-semibold underline underline-offset-4">
                    Réessayer
                  </a>
                </p>
              )}
              {ordersSlug && (
                <div className="mt-3 flex flex-wrap gap-2">
                  <a
                    href={`/r/${ordersSlug}/admin`}
                    className="rounded-full bg-yellow-400 px-5 py-2.5 text-sm font-semibold text-neutral-900 hover:bg-yellow-300"
                  >
                    Gérer mes commandes
                  </a>
                  <a
                    href={`/r/${ordersSlug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-neutral-300 bg-white px-5 py-2.5 text-sm font-semibold text-neutral-900 hover:bg-neutral-50"
                  >
                    Voir ma page de commande
                  </a>
                </div>
              )}
            </>
          ) : handoffToken ? (
            <>
              <p className="mt-1 text-sm text-neutral-600">
                Créez votre page en quelques minutes (SIRET, couleurs, carte).
                {loyalty && " Elle sera reliée automatiquement à votre carte de fidélité."}
              </p>
              <a
                href={`/inscription?token=${encodeURIComponent(handoffToken)}`}
                className="mt-3 inline-block rounded-full bg-yellow-400 px-5 py-2.5 text-sm font-semibold text-neutral-900 hover:bg-yellow-300"
              >
                Créer ma page de commande
              </a>
            </>
          ) : (
            <p className="mt-1 text-sm text-neutral-600">
              La création de la page de commande n&apos;est pas disponible pour
              le moment. Contactez-nous.
            </p>
          )}
        </div>
      )}

      {!loyalty && (
        <div className="mt-8 rounded-2xl border border-neutral-200 bg-white p-5">
          <h2 className="font-semibold text-neutral-900">
            La carte de fidélité n&apos;est pas dans votre formule
          </h2>
          <p className="mt-1 text-sm text-neutral-600">
            KeepMe Order ne comprend pas la carte de fidélité. Pour offrir un
            passage à vos clients à chaque commande retirée, passez à KeepMe
            Complet : écrivez-nous à{" "}
            <a
              href="mailto:contact@keepmecard.fr"
              className="font-medium underline"
            >
              contact@keepmecard.fr
            </a>
            .
          </p>
        </div>
      )}

      {loyalty && !onboardingDone && (
        <div className="mt-8">
          <OnboardingChecklist steps={steps} />
        </div>
      )}

      <div className="mt-10 flex flex-col gap-10">
        {navGroups.map((group) => {
          const items = group.items.filter(
            (item) => item.href !== "/dashboard",
          );
          if (items.length === 0) return null;
          return (
            <div key={group.label}>
              <h2 className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
                {group.label}
              </h2>
              <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((item) => {
                  const Icon = iconMap[item.icon];
                  const isLocked = Boolean(
                    item.feature && locked.includes(item.feature),
                  );
                  return (
                    <Link key={item.href} href={item.href}>
                      <Card className="h-full transition hover:border-yellow-300 hover:shadow-md">
                        <div className="flex items-start justify-between">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-100">
                            <Icon className="h-5 w-5 text-yellow-700" />
                          </div>
                          {isLocked && (
                            <span
                              title={LOCKED_MESSAGE}
                              className="flex items-center gap-1 rounded-full bg-neutral-100 px-2.5 py-1 text-[11px] font-semibold text-neutral-500"
                            >
                              <Lock className="h-3 w-3" aria-hidden="true" />
                              Business
                            </span>
                          )}
                        </div>
                        <h3 className="mt-4 font-semibold text-neutral-900">
                          {item.label}
                        </h3>
                        <p className="mt-1 text-sm text-neutral-600">
                          {isLocked ? LOCKED_MESSAGE : item.description}
                        </p>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
