"use client";

import { Button } from "@/components/ui/Button";

// Bouton « Passer à Business » : demande confirmation avant d'envoyer le
// formulaire, en disant clairement ce qui sera facturé et quand. Doit être
// placé à l'intérieur du <form>.
export function UpgradeToBusinessButton({
  price,
  trialing,
}: {
  price: string;
  trialing: boolean;
}) {
  const message = trialing
    ? `Passer à Business (${price} €/mois) ?\n\nBusiness est débloqué tout de suite. Vous êtes en essai gratuit : rien n'est prélevé maintenant, et ${price} €/mois sera facturé à la fin de l'essai, à la place d'Essentiel.`
    : `Passer à Business (${price} €/mois) ?\n\nBusiness est débloqué tout de suite. La différence avec votre formule actuelle est facturée au prorata sur votre prochaine facture.`;

  return (
    <Button
      type="submit"
      onClick={(event) => {
        if (!window.confirm(message)) event.preventDefault();
      }}
    >
      Passer à Business · {price} €/mois
    </Button>
  );
}
