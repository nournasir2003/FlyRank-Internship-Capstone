"use client";

import React, { useId, useState } from "react";

export interface DisclosureProps {
  /** Text shown on the trigger button */
  summary: string;
  /** Content revealed when expanded */
  children: React.ReactNode;
  /** Whether the disclosure starts expanded. Defaults to false. */
  defaultExpanded?: boolean;
}

/**
 * Disclosure — implements https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/
 *
 * The pattern is intentionally minimal: a single native <button> with
 * aria-expanded/aria-controls toggling a content region. No custom key
 * handling is required — Enter and Space already activate a native
 * <button>, and Tab moves in and out of the widget like any other control.
 * The only jobs of the component are (1) keep aria-expanded in sync with
 * visibility, and (2) actually hide the content (not just visually collapse
 * it) so it's removed from the accessibility tree and tab order when closed.
 */
export function Disclosure({
  summary,
  children,
  defaultExpanded = false,
}: DisclosureProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const baseId = useId();
  const contentId = `${baseId}-content`;

  return (
    <div className="w-full">
      <button
        type="button"
        aria-expanded={expanded}
        aria-controls={contentId}
        onClick={() => setExpanded((prev) => !prev)}
        className="flex w-full items-center gap-2 py-2 text-left text-sm font-semibold text-gray-900 cursor-pointer"
      >
        <svg
          className={
            "w-4 h-4 shrink-0 transition-transform " +
            (expanded ? "rotate-90" : "rotate-0")
          }
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
        {summary}
      </button>

      {/* `hidden` removes the region from the accessibility tree and tab
          order entirely when collapsed — a visual-only collapse (e.g.
          max-height: 0) would leave focusable content reachable by Tab
          while invisible, which is the most common disclosure bug. */}
      <div
        id={contentId}
        hidden={!expanded}
        className="pb-3 pl-6 text-sm text-gray-700"
      >
        {children}
      </div>
    </div>
  );
}
