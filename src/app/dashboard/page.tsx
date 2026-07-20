import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Settings2,
  QrCode,
  ScanLine,
  BarChart3,
  Mail,
  Palette,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";

const shortcuts = [
  {
    href: "/dashboard/program",
    icon: Settings2,
    title: "Programme de fidélité",
    description: "Nombre de passages requis et récompense offerte.",
  },
  {
    href: "/dashboard/branding",
    icon: Palette,
    title: "Apparence",
    description: "Logo et couleur de la carte de fidélité.",
  },
  {
    href: "/dashboard/qr-code",
    icon: QrCode,
    title: "QR code",
    description: "Le code que vos clients scannent pour s'inscrire.",
  },
  {
    href: "/dashboard/scan",
    icon: ScanLine,
    title: "Scanner",
    description: "Ajoutez un passage à la carte d'un client.",
  },
  {
    href: "/dashboard/stats",
    icon: BarChart3,
    title: "Statistiques",
    description: "Inscriptions, passages, récompenses, clients actifs.",
  },
  {
    href: "/dashboard/notifications",
    icon: Mail,
    title: "Notifications",
    description: "Choisissez les emails envoyés à vos clients.",
  },
];

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
    .select("name")
    .single();

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900">
        Bienvenue{merchant ? `, ${merchant.name}` : ""}
      </h1>
      <p className="mt-1 text-sm text-neutral-600">
        Connecté en tant que {user.email}
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {shortcuts.map((shortcut) => {
          const Icon = shortcut.icon;
          return (
            <Link key={shortcut.href} href={shortcut.href}>
              <Card className="h-full transition hover:border-yellow-300 hover:shadow-md">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-100">
                  <Icon className="h-5 w-5 text-yellow-700" />
                </div>
                <h2 className="mt-4 font-semibold text-neutral-900">
                  {shortcut.title}
                </h2>
                <p className="mt-1 text-sm text-neutral-600">
                  {shortcut.description}
                </p>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
