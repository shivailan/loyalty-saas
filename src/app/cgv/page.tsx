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
                .filter((feature) => !feature.soon && !feature.excluded)
                .map((feature) => feature.label)
                .join(" ; ")}
              .
            </li>
          ))}
        </ul>
        <p>
          Les fonctionnalités signalées « bientôt » sur le site ne sont pas
          encore disponibles. Elles ne font pas partie des obligations du
          Prestataire tant qu’elles n’ont pas été mises à disposition, et leur
          date de disponibilité n’est pas garantie.
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
          Client peut alors résilier son abonnement avant cette date, sans
          frais.
        </p>
      </LegalSection>

      <LegalSection title="4. Souscription, essai gratuit, durée et reconduction">
        <p>
          Le Client crée son compte sur le site, accepte les présentes CGV, puis
          choisit sa formule et souscrit son abonnement en ligne. Le contrat est
          conclu à la validation de la souscription ; le Client reçoit une
          confirmation par email.
        </p>
        <p>
          Chaque Client bénéficie d’un{" "}
          <strong>essai gratuit de 14 jours</strong> à la première souscription
          (une seule fois par Client). Aucune somme n’est prélevée pendant
          l’essai, mais un moyen de paiement est demandé à la souscription. Un
          email de rappel est envoyé quelques jours avant la fin de l’essai.
          Sauf résiliation avant son terme, l’abonnement choisi démarre
          automatiquement à la fin de l’essai et le premier paiement est alors
          prélevé.
        </p>
        <p>
          L’abonnement est mensuel et sans engagement de durée. Il se renouvelle
          automatiquement chaque mois, jusqu’à sa résiliation. Le Client peut
          passer à une formule supérieure à tout moment depuis son espace : la
          différence de prix est facturée au prorata de la période restante. Le
          retour à une formule inférieure se fait sur demande par email et prend
          effet à la prochaine échéance.
        </p>
      </LegalSection>

      <LegalSection title="5. Paiement">
        <p>
          Le paiement s’effectue chaque mois, à l’avance, par carte bancaire ou
          prélèvement SEPA, sur une page de paiement sécurisée opérée par
          Stripe, à laquelle le Client est redirigé depuis le site. Le
          Prestataire ne reçoit ni ne conserve les données de la carte bancaire
          du Client. Les factures et reçus sont envoyés par email et accessibles
          depuis la rubrique « Abonnement » de l’espace du Client, où il peut
          aussi changer son moyen de paiement.
        </p>
        <p>
          L’essai gratuit de 14 jours garantit qu’aucun paiement n’est demandé
          avant l’expiration du délai de 7 jours prévu lorsque l’article 9
          s’applique.
        </p>
      </LegalSection>

      <LegalSection title="6. Retard ou défaut de paiement">
        <p>
          En cas de retard de paiement, des pénalités sont dues de plein droit,
          sans rappel, à un taux égal à trois fois le taux d’intérêt légal,
          ainsi qu’une indemnité forfaitaire de 40 € pour frais de recouvrement
          (art. L441-10 du Code de commerce).
        </p>
        <p>
          Un paiement refusé fait l’objet de nouvelles tentatives automatiques
          pendant plusieurs jours, durant lesquelles l’accès au service est
          maintenu et le Client est invité à mettre à jour son moyen de
          paiement. Si le paiement n’est pas régularisé à l’issue de ces
          tentatives, le Prestataire peut suspendre l’accès au service jusqu’à
          régularisation.
        </p>
      </LegalSection>

      <LegalSection title="7. Résiliation">
        <p>
          Le Client peut résilier son abonnement à tout moment, directement
          depuis la rubrique « Abonnement » de son espace, ou en écrivant à{" "}
          {legal.contactEmail}. La résiliation prend effet à la fin de la
          période mensuelle en cours (ou de l’essai gratuit, auquel cas aucun
          prélèvement n’est effectué) ; aucun prélèvement n’est effectué
          ensuite. La période déjà payée n’est pas remboursée, sous réserve de
          l’article 9.
        </p>
        <p>
          Le Prestataire peut résilier l’abonnement en cas de manquement du
          Client à ses obligations (notamment défaut de paiement ou non-respect
          des conditions d’utilisation) après une mise en demeure restée sans
          effet pendant huit jours. Il peut également mettre fin au service
          moyennant un préavis de 30 jours.
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
          consommation), le Client dispose d’un délai de{" "}
          <strong>14 jours calendaires</strong> à compter de la conclusion du
          contrat pour se rétracter, sans avoir à se justifier et sans pénalité
          (art. L221-18 du même code).
        </p>
        <p>
          Pour l’exercer, le Client adresse une déclaration claire à{" "}
          {legal.contactEmail} avant l’expiration du délai, par exemple avec le
          formulaire ci-dessous. Le service étant gratuit pendant les 14
          premiers jours (essai gratuit), aucune somme n’est due en cas de
          rétractation dans ce délai.
        </p>
        <p className="rounded-xl border border-neutral-200 bg-white p-4">
          <strong>Formulaire type de rétractation</strong>
          <br />À l’attention de {legal.publisherName}, {legal.address},{" "}
          {legal.contactEmail} : je vous notifie par la présente ma rétractation
          du contrat portant sur l’abonnement au service {legal.productName}.
          Souscrit le [date]. Nom du Client : [nom]. Adresse : [adresse]. Date
          et signature : [date, signature].
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
          au cours des 12 mois précédant le fait générateur. Le Prestataire
          n’est pas responsable des récompenses promises par le Client à ses
          propres clients ni de l’utilisation que le Client fait du service.
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
          Les présentes CGV sont soumises au droit français. En cas de litige,
          une solution amiable sera recherchée avant toute action devant les
          juridictions compétentes.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
