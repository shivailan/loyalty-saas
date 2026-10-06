import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, LegalSection } from "@/components/legal/LegalPage";
import { legal } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Conditions d’utilisation — KeepMe",
};

export default function CguPage() {
  return (
    <LegalPage title="Conditions d’utilisation">
      <LegalSection title="1. Objet">
        <p>
          Les présentes conditions encadrent l’utilisation du service{" "}
          {legal.productName}, proposé par {legal.publisherName} (
          {legal.publisherStatus}), qui permet à un commerçant de créer et gérer
          un programme de fidélité digital pour ses clients. Les conditions
          tarifaires sont précisées dans les{" "}
          <Link href="/cgv" className="underline">
            conditions générales de vente
          </Link>
          .
        </p>
      </LegalSection>

      <LegalSection title="2. Compte commerçant">
        <p>
          Le service est destiné aux professionnels. Le commerçant s’engage à
          fournir des informations exactes, à garder ses identifiants
          confidentiels et à rester responsable de toute action effectuée avec
          son compte.
        </p>
      </LegalSection>

      <LegalSection title="3. Obligations du commerçant">
        <ul className="list-disc pl-5">
          <li>
            Informer ses clients du traitement de leurs données et, avant tout
            envoi d’offres commerciales, avoir recueilli leur consentement (la
            page d’inscription propose une case dédiée, non cochée par défaut).
          </li>
          <li>
            Respecter les demandes d’exercice de droits de ses clients (accès,
            rectification, effacement…).
          </li>
          <li>
            Proposer des récompenses licites et honorer celles qu’il annonce.
          </li>
          <li>
            Ne pas utiliser le service pour des contenus illicites ou à des fins
            frauduleuses.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="4. Données personnelles et sous-traitance">
        <p>
          Le commerçant est responsable du traitement des données de ses
          clients. {legal.productName} agit en qualité de sous-traitant au sens
          du règlement général sur la protection des données et s’engage à :
        </p>
        <ul className="list-disc pl-5">
          <li>
            traiter ces données uniquement pour fournir le service, selon les
            instructions du commerçant ;
          </li>
          <li>garantir la confidentialité des données et leur sécurité ;</li>
          <li>
            recourir à des sous-traitants ultérieurs (hébergement, base de
            données, envoi d’emails) présentant des garanties suffisantes ;
          </li>
          <li>
            aider le commerçant à répondre aux demandes d’exercice de droits ;
          </li>
          <li>l’informer sans délai en cas de violation de données ;</li>
          <li>
            supprimer ou restituer les données à la fin du contrat, sur
            demande.
          </li>
        </ul>
        <p>
          Le détail est disponible dans la{" "}
          <Link href="/confidentialite" className="underline">
            politique de confidentialité
          </Link>
          .
        </p>
      </LegalSection>

      <LegalSection title="5. Disponibilité du service">
        <p>
          {legal.productName} fait de son mieux pour assurer un service continu
          mais ne peut garantir l’absence d’interruption (maintenance, panne
          d’un prestataire, cas de force majeure).
        </p>
      </LegalSection>

      <LegalSection title="6. Suspension et résiliation">
        <p>
          Le commerçant peut cesser d’utiliser le service et demander la
          suppression de son compte à tout moment. {legal.productName} peut
          suspendre un compte en cas de manquement aux présentes conditions ou
          de défaut de paiement.
        </p>
      </LegalSection>

      <LegalSection title="7. Responsabilité">
        <p>
          La responsabilité de {legal.productName} est limitée aux dommages
          directs et prévisibles. Elle ne saurait être engagée pour les
          récompenses promises par le commerçant à ses clients ni pour
          l’utilisation que celui-ci fait des données.
        </p>
      </LegalSection>

      <LegalSection title="8. Propriété intellectuelle">
        <p>
          Le service, son code et la marque {legal.productName} restent la
          propriété de leur éditeur. Le commerçant conserve la propriété de son
          logo et de ses contenus, qu’il autorise {legal.productName} à
          afficher pour les besoins du service.
        </p>
      </LegalSection>

      <LegalSection title="9. Modification des conditions">
        <p>
          Ces conditions peuvent évoluer. Les commerçants seront informés de
          toute modification importante. La poursuite de l’utilisation du
          service vaut acceptation de la nouvelle version.
        </p>
      </LegalSection>

      <LegalSection title="10. Droit applicable">
        <p>
          Les présentes conditions sont soumises au droit français. En cas de
          litige, une solution amiable sera recherchée avant toute action devant
          les tribunaux compétents.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
