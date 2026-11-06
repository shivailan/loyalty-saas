import ExcelJS from "exceljs";
import { createClient } from "@/lib/supabase/server";
import { hasFeature, hasPaidAccess } from "@/lib/billing/access";

export const runtime = "nodejs";

// Un texte qui commence par = + - @ serait interprété comme une formule par
// Excel : on le neutralise pour qu'un client ne puisse pas piéger le fichier
// de son commerçant (injection de formule).
function safeText(value: string | null): string {
  if (!value) return "";
  return /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
}

// Télécharge la liste des clients du commerçant connecté au format Excel.
// Les règles d'accès (RLS) garantissent qu'il n'exporte que ses propres clients.
export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { data: merchant } = await supabase
    .from("merchants")
    .select("name, billing_exempt, subscription_status, subscription_plan")
    .eq("owner_id", user.id)
    .single();
  if (
    !merchant ||
    !hasPaidAccess(merchant) ||
    !hasFeature("customerExport", merchant)
  ) {
    return new Response("Forbidden", { status: 403 });
  }

  const { data: customers, error } = await supabase
    .from("customers")
    .select(
      `
      first_name,
      last_name,
      email,
      phone,
      marketing_consent,
      created_at,
      loyalty_cards ( current_stamps, loyalty_programs ( visits_required ) )
    `,
    )
    .order("created_at", { ascending: false });
  if (error) {
    return new Response("Server error", { status: 500 });
  }

  const workbook = new ExcelJS.Workbook();
  workbook.creator = "KeepMe";
  const sheet = workbook.addWorksheet("Clients");
  sheet.columns = [
    { header: "Prénom", key: "firstName", width: 18 },
    { header: "Nom", key: "lastName", width: 18 },
    { header: "Email", key: "email", width: 32 },
    { header: "Téléphone", key: "phone", width: 16 },
    {
      header: "Inscrit le",
      key: "createdAt",
      width: 14,
      style: { numFmt: "dd/mm/yyyy" },
    },
    { header: "Passages", key: "stamps", width: 10 },
    { header: "Passages requis", key: "required", width: 16 },
    { header: "Accepte les offres", key: "consent", width: 18 },
  ];
  sheet.getRow(1).font = { bold: true };
  sheet.views = [{ state: "frozen", ySplit: 1 }];

  for (const customer of customers ?? []) {
    const card = customer.loyalty_cards[0];
    sheet.addRow({
      firstName: safeText(customer.first_name),
      lastName: safeText(customer.last_name),
      email: safeText(customer.email),
      phone: safeText(customer.phone),
      createdAt: new Date(customer.created_at),
      stamps: card?.current_stamps ?? 0,
      required: card?.loyalty_programs?.visits_required ?? "",
      consent: customer.marketing_consent ? "Oui" : "Non",
    });
  }
  sheet.autoFilter = { from: "A1", to: "H1" };

  const buffer = await workbook.xlsx.writeBuffer();
  const date = new Date().toISOString().slice(0, 10);
  return new Response(new Uint8Array(buffer as ArrayBuffer), {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="clients-keepme-${date}.xlsx"`,
      "Cache-Control": "no-store",
    },
  });
}
