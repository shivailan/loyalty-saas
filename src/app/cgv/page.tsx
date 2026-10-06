import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, LegalSection } from "@/components/legal/LegalPage";
import { legal } from "@/lib/legal";
import { plans } from "@/lib/plans";

export const metadata: Metadata = {
  title: "Conditions générales de vente — KeepMe",
};

const sellablePlans = plans.filter((plan) => !plan.comingSoon);

export default function CgvPage() {
  return (
    <LegalPage title="Conditions générales de vente">
      <LegalSection title="1. Objet et champ d’application">
        <p>
          Les présentes conditions générales de vente (« CGV ») régissent
          l’abonnement au service {legal.productName}, un service en ligne de
          cartes de fidélité digitales, proposé par {legal.publisherName},{" "}
          {legal.publisherStatus} (nom commercial : {legal.tradeName}), SIRET{" "}
          {legal.siret}, {legal.address} (le « Prestataire »), à ses clients
          professionnels (le « Client »).
        </p>
        <p>
          Elles complètent les{" "}
          <Link href="/cgu" className="underline">
            conditions d’utilisation
          </Link>{" "}
          et la{" "}
          <Link href="/confidentialite" className="underline">
            politique de confidentialité
          </Link>
          . Toute souscription implique leur acceptation.
        </p>
      </LegalSection>

      <LegalSection title="2. Les offres">
        <p>Le Prestataire propose actuellement les offres suivantes :</p>
        <ul className="list-disc pl-5">
          {sellablePlans.map((plan) => (
            <li key={plan.name}>
              <strong>
                {plan.name} : {plan.price} € par mois.
              </strong>{" "}
              {plan.features
                .filter((feature) => !feature.soon)
                .map((feature) => feature.label)
                .join(" ; ")}
              .
            </li>
          ))}
        </ul>
        <p>
          Les fonctionnalités signalées « bientôt » sur le site (notamment les
          notifications push) ne sont pas encore disponibles. Elles ne font pas
          partie des obligations du Prestataire tant qu’elles n’ont pas été mises
          à disposition, et leur date de disponibilité n’est pas garantie.
        </p>
        <p>
          Une offre supplémentaire peut être annoncée sur le site. Tant qu’elle
          n’est pas commercialisée, elle n’est pas couverte par les présentes
          CGV.
        </p>
      </LegalSection>

      <LegalSection title="3. Prix">
        <p>
          Les prix sont indiqués en euros, par mois. Le Prestataire bénéficiant
          de la franchise en base de TVA, la mention suivante figure sur ses
          factures : « TVA non applicable, art. 293 B du CGI ». Il n’y a aucun
          frais de mise en place.
        </p>
        <p>
          Le Prestataire peut modifier ses prix. Toute modification est notifiée
          au Client par email au moins 30 jours avant son entrée en vigueur ; le
          Client peut alors résilier son abonnement avant cette date, sans frais.
        </p>
      </LegalSection>

      <LegalSection title="4. Souscription, durée et reconduction">
        <p>
          L’abonnement est mensuel et sans engagement de durée. Il commence à la
          date d’activation du compte du Client et se renouvelle automatiquement
          chaque mois, jusqu’à sa résiliation.
        </p>
      </LegalSection>

      <LegalSection title="5. Paiement">
        <p>
          Le paiement s’effectue chaque mois, à l’avance, par carte bancaire ou
          prélèvement SEPA, au moyen d’un lien de paiement sécurisé fourni par le
          Prestataire et opéré par Stripe. Le Prestataire ne reçoit ni ne conserve
          les données de la carte bancaire du Client. Un reçu est envoyé par email
          à chaque paiement.
        </p>
        <p>
          Lorsque l’article 9 s’applique, le premier paiement n’est demandé qu’à
          l’expiration d’un délai de 7 jours après la conclusion du contrat.
        </p>
      </LegalSection>

      <LegalSection title="6. Retard ou défaut de paiement">
        <p>
          En cas de retard de paiement, des pénalités sont dues de plein droit,
          sans rappel, à un taux égal à trois fois le taux d’intérêt légal, ainsi
          qu’une indemnité forfaitaire de 40 € pour frais de recouvrement (art.
          L441-10 du Code de commerce).
        </p>
        <p>
          Si un paiement n’est pas régularisé huit jours après une relance, le
          Prestataire peut suspendre l’accès au service jusqu’à régularisation.
        </p>
      </LegalSection>

      <LegalSection title="7. Résiliation">
        <p>
          Le Client peut résilier son abonnement à tout moment en écrivant à{" "}
          {legal.contactEmail}. La résiliation prend effet à la fin de la période
          mensuelle en cours ; aucun prélèvement n’est effectué ensuite. La
          période déjà payée n’est pas remboursée.
        </p>
        <p>
          Le Prestataire peut résilier l’abonnement en cas de manquement du
          Client à ses obligations (notamment défaut de paiement ou non-respect
          des conditions d’utilisation) après une mise en demeure restée sans
          effet pendant huit jours. Il peut également mettre fin au service moyennant
          un préavis de 30 jours.
        </p>
        <p>
          À la fin du contrat, le Client peut demander la restitution ou la
          suppression de ses données ; elles sont supprimées dans un délai
          raisonnable après sa demande.
        </p>
      </LegalSection>

      <LegalSection title="8. Disponibilité du service">
        <p>
          Le Prestataire s’efforce d’assurer la disponibilité du service mais
          n’est tenu qu’à une obligation de moyens. Des interruptions peuvent
          survenir (maintenance, panne d’un prestataire technique, force
          majeure). Le support est assuré par email ou, pour l’offre Business,
          également par WhatsApp, sans délai de réponse garanti.
        </p>
      </LegalSection>

      <LegalSection title="9. Droit de rétractation (contrat conclu hors établissement)">
        <p>
          Lorsque le contrat est conclu hors établissement du Prestataire (par
          exemple lors d’une visite dans le commerce du Client), que le Client
          emploie cinq salariés au plus et que l’objet du contrat n’entre pas
          dans le champ de son activité principale (art. L221-3 du Code de la
          consommation), le Client dispose d’un délai de <strong>14 jours
          calendaires</strong> à compter de la conclusion du contrat pour se
          rétracter, sans avoir à se justifier et sans pénalité (art. L221-18 du
          même code).
        </p>
        <p>
          Pour l’exercer, le Client adresse une déclaration claire à{" "}
          {legal.contactEmail} avant l’expiration du délai, par exemple avec le
          formulaire ci-dessous. S’il a demandé que le service commence avant la
          fin de ce délai, il paie la part du service déjà fournie jusqu’à la
          rétractation.
        </p>
        <p className="rounded-xl border border-neutral-200 bg-white p-4">
          <strong>Formulaire type de rétractation</strong>
          <br />À l’attention de {legal.publisherName}, {legal.address},{" "}
          {legal.contactEmail} : je vous notifie par la présente ma rétractation
          du contrat portant sur l’abonnement au service {legal.productName}.
          Souscrit le [date]. Nom du Client : [nom]. Adresse : [adresse]. Date et
          signature : [date, signature].
        </p>
      </LegalSection>

      <LegalSection title="10. Données personnelles">
        <p>
          Le Client est responsable du traitement des données de ses propres
          clients ; le Prestataire intervient comme sous-traitant, dans les
          conditions décrites à l’article 4 des conditions d’utilisation et dans
          la politique de confidentialité.
        </p>
      </LegalSection>

      <LegalSection title="11. Responsabilité">
        <p>
          La responsabilité du Prestataire est limitée aux dommages directs et
          prévisibles, et plafonnée au montant des sommes payées par le Client
          au cours des 12 mois précédant le fait générateur. Le Prestataire n’est
          pas responsable des récompenses promises par le Client à ses propres
          clients ni de l’utilisation que le Client fait du service.
        </p>
      </LegalSection>

      <LegalSection title="12. Réclamations">
        <p>
          Toute réclamation peut être adressée à {legal.contactEmail}. Le
          Prestataire s’engage à y répondre dans les meilleurs délais.
        </p>
      </LegalSection>

      <LegalSection title="13. Modification des CGV">
        <p>
          Les CGV peuvent évoluer. Les nouvelles conditions s’appliquent aux
          nouvelles souscriptions ; pour les abonnements en cours, toute
          modification est notifiée par email 30 jours avant son entrée en
          vigueur, et le Client peut résilier avant cette date.
        </p>
      </LegalSection>

      <LegalSection title="14. Droit applicable et litiges">
        <p>
          Les présentes CGV sont soumises au droit français. En cas de litige, une
          solution amiable sera recherchée avant toute action devant les
          juridictions compétentes.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
