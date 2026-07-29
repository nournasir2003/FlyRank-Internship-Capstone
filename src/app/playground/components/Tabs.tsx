"use client";

import React, { useId, useRef, useState } from "react";

export interface TabItem {
  /** Unique key for this tab, also used to derive ids */
  id: string;
  /** Visible tab label */
  label: string;
  /** Panel content for this tab */
  content: React.ReactNode;
  /** Disable this tab (skipped by arrow-key navigation) */
  disabled?: boolean;
}

export interface TabsProps {
  /** Tab items in display order */
  items: TabItem[];
  /** Id of the initially selected tab. Defaults to the first non-disabled tab. */
  defaultSelectedId?: string;
  /** Accessible label for the tablist (required unless ariaLabelledBy is given) */
  ariaLabel?: string;
  /** Id of an element that labels the tablist, as an alternative to ariaLabel */
  ariaLabelledBy?: string;
}

/**
 * Tabs — implements https://www.w3.org/WAI/ARIA/apg/patterns/tabs/
 * (horizontal, automatic activation).
 *
 * Roles: tablist / tab / tabpanel.
 * Keyboard:
 *  - ArrowRight / ArrowLeft: move focus to next/previous tab, wrapping. Moving
 *    focus also activates the tab (automatic activation model).
 *  - Home / End: move focus (and activate) the first / last tab.
 *  - Tab: leaves the tablist entirely (roving tabindex — only the selected
 *    tab is in the normal tab order).
 */
export function Tabs({
  items,
  defaultSelectedId,
  ariaLabel,
  ariaLabelledBy,
}: TabsProps) {
  const baseId = useId();
  const enabledItems = items.filter((item) => !item.disabled);
  const initialId =
    defaultSelectedId ?? enabledItems[0]?.id ?? items[0]?.id ?? "";

  const [selectedId, setSelectedId] = useState<string>(initialId);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const tabId = (itemId: string) => `${baseId}-tab-${itemId}`;
  const panelId = (itemId: string) => `${baseId}-panel-${itemId}`;

  const focusAndSelect = (itemId: string) => {
    setSelectedId(itemId);
    tabRefs.current[itemId]?.focus();
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    currentIndex: number,
  ) => {
    const enabledIndices = items
      .map((item, index) => ({ item, index }))
      .filter(({ item }) => !item.disabled)
      .map(({ index }) => index);

    if (enabledIndices.length === 0) return;

    const currentEnabledPos = enabledIndices.indexOf(currentIndex);

    const moveTo = (enabledPos: number) => {
      const wrapped =
        ((enabledPos % enabledIndices.length) + enabledIndices.length) %
        enabledIndices.length;
      const targetIndex = enabledIndices[wrapped];
      focusAndSelect(items[targetIndex].id);
    };

    switch (event.key) {
      case "ArrowRight":
        event.preventDefault();
        moveTo(currentEnabledPos + 1);
        break;
      case "ArrowLeft":
        event.preventDefault();
        moveTo(currentEnabledPos - 1);
        break;
      case "Home":
        event.preventDefault();
        moveTo(0);
        break;
      case "End":
        event.preventDefault();
        moveTo(enabledIndices.length - 1);
        break;
      default:
        break;
    }
  };

  return (
    <div className="w-full">
      <div
        role="tablist"
        aria-label={ariaLabelledBy ? undefined : ariaLabel}
        aria-labelledby={ariaLabelledBy}
        className="flex gap-1 border-b border-gray-200"
      >
        {items.map((item, index) => {
          const isSelected = item.id === selectedId;
          return (
            <button
              key={item.id}
              ref={(el) => {
                tabRefs.current[item.id] = el;
              }}
              role="tab"
              id={tabId(item.id)}
              aria-selected={isSelected}
              aria-controls={panelId(item.id)}
              aria-disabled={item.disabled || undefined}
              disabled={item.disabled}
              tabIndex={isSelected ? 0 : -1}
              onClick={() => !item.disabled && focusAndSelect(item.id)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              className={
                "px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 " +
                (isSelected
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-800")
              }
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {items.map((item) => (
        <div
          key={item.id}
          role="tabpanel"
          id={panelId(item.id)}
          aria-labelledby={tabId(item.id)}
          tabIndex={0}
          hidden={item.id !== selectedId}
          className="p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}
