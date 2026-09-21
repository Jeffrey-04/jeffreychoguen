"use client";

import { useId, useState } from "react";
import { Plus } from "@/components/ui/Icon";

type Item = { question: string; answer: string };

/**
 * design.md §5.6 — items en cartes blanches, espacement 12px,
 * icône + pivotant à 45°, ouverture animée.
 * Accessibilité : button aria-expanded + région liée par aria-labelledby.
 */
export function Accordion({ items }: { items: Item[] }) {
  const [open, setOpen] = useState<number | null>(0);
  const baseId = useId();

  return (
    <div className="mx-auto flex max-w-[770px] flex-col gap-3">
      {items.map((item, index) => {
        const isOpen = open === index;
        const buttonId = `${baseId}-q-${index}`;
        const panelId = `${baseId}-a-${index}`;

        return (
          <div key={item.question} className="rounded-[16px] border border-gray-200 bg-white">
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : index)}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
              >
                <span className="t-h5">{item.question}</span>
                <Plus
                  className={`shrink-0 text-gray-900 transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}
                />
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              hidden={!isOpen}
              className="px-6 pb-5"
            >
              <p className="t-body">{item.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
