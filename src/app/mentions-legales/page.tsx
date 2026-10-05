import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, LegalSection } from "@/components/legal/LegalPage";
import { legal } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Mentions légales — KeepMe",
};

export default function MentionsLegalesPage() {
  return (
    <LegalPage title="Mentions légales">
      <LegalSection title="Éditeur du site">
        <p>
          Le site {legal.productName} est édité par {legal.publisherName},{" "}
          {legal.publisherStatus}.
        </p>
        <ul className="list-disc pl-5">
          <li>SIRET : {legal.siret}</li>
          <li>Adresse : {legal.address}</li>
          <li>Email : {legal.contactEmail}</li>
        </ul>
        <p>Directeur de la publication : {legal.publisherName}.</p>
      </LegalSection>

      <LegalSection title="Hébergement">
        <p>
          Le site est hébergé par {legal.host.name}, {legal.host.address} —{" "}
          {legal.host.website}.
        </p>
      </LegalSection>

      <LegalSection title="Propriété intellectuelle">
        <p>
          La marque {legal.productName}, le site, son code et ses contenus sont
          protégés par le droit de la propriété intellectuelle. Toute
          reproduction ou réutilisation sans autorisation écrite est interdite.
        </p>
        <p>
          Les logos, noms et contenus propres à chaque commerce restent la
          propriété de ce commerce.
        </p>
      </LegalSection>

      <LegalSection title="Données personnelles">
        <p>
          Le traitement des données personnelles est détaillé dans la{" "}
          <Link href="/confidentialite" className="underline">
            politique de confidentialité
          </Link>
          .
        </p>
      </LegalSection>

      <LegalSection title="Contact">
        <p>
          Pour toute question concernant le site ou le service :{" "}
          {legal.contactEmail}.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
