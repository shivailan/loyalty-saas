import { parseOffer } from "@/lib/offers";
import SignupForm from "./SignupForm";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ offre?: string | string[] }>;
}) {
  const { offre } = await searchParams;
  return <SignupForm offer={parseOffer(offre)} />;
}
