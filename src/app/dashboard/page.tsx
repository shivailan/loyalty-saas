import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";
import { navGroups } from "./nav-items";
import { iconMap } from "@/lib/icons";
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
    .select("id, name, slug, logo_url, primary_color, poster_downloaded_at")
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

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900">
        Bienvenue{merchant ? `, ${merchant.name}` : ""}
      </h1>
      <p className="mt-1 text-sm text-neutral-600">
        Connecté en tant que {user.email}
      </p>

      {!onboardingDone && (
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
                  return (
                    <Link key={item.href} href={item.href}>
                      <Card className="h-full transition hover:border-yellow-300 hover:shadow-md">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-100">
                          <Icon className="h-5 w-5 text-yellow-700" />
                        </div>
                        <h3 className="mt-4 font-semibold text-neutral-900">
                          {item.label}
                        </h3>
                        <p className="mt-1 text-sm text-neutral-600">
                          {item.description}
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
