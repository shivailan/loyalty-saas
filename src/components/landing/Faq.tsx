import { Reveal } from "./Motion";

export type FaqItem = { question: string; answer: string };

// Questions fréquentes d'une page produit. Les mêmes questions alimentent les
// données structurées lues par Google : le texte affiché et le texte déclaré
// ne peuvent donc pas différer.
export function Faq({ items }: { items: FaqItem[] }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <section className="bg-background py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-3xl font-semibold tracking-tight text-neutral-900 md:text-4xl">
            Questions fréquentes
          </h2>
        </Reveal>
        <div className="mx-auto mt-12 max-w-3xl divide-y divide-neutral-200 rounded-3xl border border-neutral-200 bg-white">
          {items.map((item) => (
            <details key={item.question} className="group px-6 py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left font-heading text-lg font-semibold text-neutral-900 [&::-webkit-details-marker]:hidden">
                {item.question}
                <span
                  aria-hidden="true"
                  className="text-2xl font-normal text-neutral-400 transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mt-3 text-[15px] leading-relaxed text-neutral-500">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
