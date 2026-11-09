import { Reveal, RevealGroup, RevealItem } from "./Motion";

const steps = [
  {
    title: "Vous créez votre page",
    description:
      "En quelques minutes : votre SIRET, vos couleurs, votre carte et vos prix.",
  },
  {
    title: "Vos clients commandent",
    description:
      "Depuis leur téléphone, sur votre page ou en scannant le QR code du comptoir. Sans compte ni application.",
  },
  {
    title: "La commande arrive en cuisine",
    description:
      "En direct sur votre écran, avec une alerte sonore. Le ticket peut s'imprimer tout seul.",
  },
  {
    title: "Le client est prévenu",
    description:
      "Un e-mail lui indique quand sa commande est prête : il passe la retirer, sans attendre.",
  },
];

// Le parcours d'une commande, de la création de la page au retrait.
export function OrderSteps() {
  return (
    <section className="bg-neutral-50 py-24">
      <div className="px-6 lg:px-20">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-3xl font-semibold tracking-tight text-neutral-900 md:text-4xl">
            Comment ça marche
          </h2>
          <p className="mt-4 text-lg text-neutral-500">
            De la page de commande au retrait, en quatre étapes.
          </p>
        </Reveal>
        <RevealGroup className="mx-auto mt-14 grid max-w-5xl gap-5 sm:grid-cols-2">
          {steps.map((step, index) => (
            <RevealItem
              key={step.title}
              className="rounded-3xl border border-neutral-200 bg-white p-8"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-yellow-400 text-sm font-semibold text-neutral-900">
                {index + 1}
              </span>
              <h3 className="mt-5 font-heading text-xl font-semibold tracking-tight text-neutral-900">
                {step.title}
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed text-neutral-500">
                {step.description}
              </p>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
