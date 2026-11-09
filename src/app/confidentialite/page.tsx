import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/legal/LegalPage";
import { legal } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Politique de confidentialité — KeepMe",
};

export default function ConfidentialitePage() {
  return (
    <LegalPage title="Politique de confidentialité">
      <LegalSection title="Qui est responsable de vos données ?">
        <p>
          {legal.productName} est un service qui permet à des commerces de
          prendre des commandes à emporter (KeepMe Order) et de proposer une
          carte de fidélité digitale à leurs clients (KeepMe Card). Deux
          situations sont à distinguer :
        </p>
        <ul className="list-disc pl-5">
          <li>
            <strong>Si vous êtes client d’un commerce</strong> et que vous avez
            créé une carte de fidélité ou passé une commande : ce commerce est responsable du
            traitement de vos données. {legal.productName} intervient comme
            prestataire technique (sous-traitant) et ne les utilise pas pour son
            propre compte.
          </li>
          <li>
            <strong>Si vous êtes un commerçant</strong> utilisant{" "}
            {legal.productName}, ou un simple visiteur du site :{" "}
            {legal.publisherName} ({legal.publisherStatus}) est responsable du
            traitement de vos données de compte.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="Quelles données sont collectées ?">
        <ul className="list-disc pl-5">
          <li>
            <strong>Client d’un commerce :</strong> prénom, nom, adresse email,
            numéro de téléphone (facultatif), nombre de passages et récompenses
            obtenues, et votre choix concernant la réception d’offres.
          </li>
          <li>
            <strong>Client qui passe une commande :</strong> nom ou prénom,
            numéro de téléphone et adresse email (facultatifs), contenu et
            montant de la commande, créneau de retrait, éventuelle remarque, et
            votre choix concernant le fait d’être recontacté ou de cumuler des
            passages sur une carte de fidélité.
          </li>
          <li>
            <strong>Commerçant :</strong> adresse email, nom de l’établissement,
            mot de passe (conservé sous forme chiffrée), logo et couleurs, et,
            pour KeepMe Order, numéro SIRET, adresse de l’établissement,
            téléphone, code d’accès de l’équipe (conservé sous forme chiffrée),
            carte et prix.
          </li>
          <li>
            <strong>Tous les visiteurs :</strong> pour limiter le spam et les
            abus sur les pages publiques, une empreinte non réversible de votre
            adresse IP (et, pour la récupération de carte, de votre email) est
            conservée au maximum 24 heures. Elle ne permet pas de vous
            identifier. Les formulaires d’inscription, de connexion et de
            réinitialisation du mot de passe utilisent en outre une
            vérification anti-robot fournie par Cloudflare (voir ci-dessous).
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="Pourquoi ces données sont-elles utilisées ?">
        <ul className="list-disc pl-5">
          <li>
            Créer et gérer votre carte de fidélité, comptabiliser vos passages
            et vous remettre vos récompenses.
          </li>
          <li>
            Enregistrer votre commande, la transmettre au commerce et, si vous
            avez donné votre email, vous prévenir quand elle est prête. Si vous
            l’avez demandé en commandant, chaque commande retirée ajoute un
            passage à votre carte de fidélité.
          </li>
          <li>
            Vous envoyer des messages liés au service : confirmation de création
            de carte, récompense disponible, récupération de votre carte.
          </li>
          <li>
            Vous envoyer des offres du commerce, uniquement si vous avez coché
            la case correspondante lors de votre inscription. Vous pouvez
            retirer ce consentement à tout moment.
          </li>
          <li>
            Assurer la sécurité du service et permettre aux commerçants de
            consulter leurs statistiques.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="Qui peut accéder à vos données ?">
        <p>
          Vos données sont accessibles au commerce auprès duquel vous avez créé
          votre carte. {legal.productName} fait appel aux prestataires suivants
          pour faire fonctionner le service :
        </p>
        <ul className="list-disc pl-5">
          <li>
            Supabase : bases de données (comptes, cartes de fidélité, commandes),
            authentification des commerçants et stockage des images.
          </li>
          <li>
            Cloudflare : vérification anti-robot (Turnstile) sur les formulaires
            d’inscription, de connexion et de mot de passe oublié.
          </li>
          <li>Vercel : hébergement du site.</li>
          <li>
            Resend : envoi des emails (confirmations, cartes de fidélité,
            commande prête).
          </li>
          <li>
            Apple (Apple Wallet) et Google (Google Wallet) : uniquement si le
            client choisit d’ajouter sa carte à son portefeuille numérique. Le
            nom du commerce, le prénom du client, le nombre de passages et, le
            cas échéant, l’offre en cours sont alors transmis à Apple ou à
            Google pour afficher et mettre à jour la carte.
          </li>
          <li>
            Stripe : paiement des abonnements des commerçants et, lorsque le
            commerçant active cette option, paiement en ligne des commandes.{" "}
            {legal.productName} ne reçoit ni ne conserve les données de carte
            bancaire.
          </li>
        </ul>
        <p>
          Certains de ces prestataires peuvent traiter des données en dehors de
          l’Union européenne, dans le cadre de garanties prévues par le
          règlement général sur la protection des données (clauses
          contractuelles types notamment). Vos données ne sont ni vendues ni
          cédées à des tiers à des fins publicitaires.
        </p>
      </LegalSection>

      <LegalSection title="Combien de temps sont-elles conservées ?">
        <p>
          Les données d’un client (carte de fidélité ou commandes) sont
          conservées tant que le commerce utilise le service, puis supprimées
          sur demande auprès du commerce ou de{" "}
          {legal.productName}. Les données d’un commerçant sont conservées
          pendant la durée du compte, puis supprimées à sa clôture.
        </p>
      </LegalSection>

      <LegalSection title="Quels sont vos droits ?">
        <p>
          Vous pouvez demander l’accès à vos données, leur rectification, leur
          effacement, la limitation ou l’opposition à leur traitement, ainsi que
          leur portabilité. Vous pouvez aussi retirer à tout moment votre
          consentement à recevoir des offres.
        </p>
        <p>
          Pour exercer vos droits, adressez-vous au commerce concerné, ou
          écrivez à {legal.contactEmail}. Si vous estimez que vos droits ne sont
          pas respectés, vous pouvez introduire une réclamation auprès de la
          CNIL (www.cnil.fr).
        </p>
      </LegalSection>

      <LegalSection title="Cookies">
        <p>
          Le site utilise uniquement des cookies techniques strictement
          nécessaires, par exemple pour maintenir la connexion d’un commerçant.
          Il n’utilise aucun traceur publicitaire ni outil de mesure d’audience.
          La vérification anti-robot de Cloudflare est un dispositif de
          sécurité : elle peut déposer ou lire des éléments techniques
          nécessaires à son fonctionnement.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
