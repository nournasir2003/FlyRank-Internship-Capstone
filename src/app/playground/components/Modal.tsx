"use client";

import React, { useEffect, useId, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

export interface ModalProps {
  /** Controlling state of the modal */
  isOpen: boolean;
  /** Callback fired when the modal wants to close (via close button, Escape, backdrop click) */
  onClose: () => void;
  /** Accessible title for the modal */
  title: string;
  /** Optional accessible description for the modal */
  description?: string;
  /** Main content of the modal */
  children: React.ReactNode;
  /** Whether clicking the backdrop overlay closes the modal. Defaults to true. */
  closeOnOverlayClick?: boolean;
}

// No-op subscribe: "are we mounted on the client" never changes after the
// initial client render, so there's nothing to subscribe to — we only need
// useSyncExternalStore for its server/client snapshot split.
function subscribe() {
  return () => {};
}
function getClientSnapshot() {
  return true;
}
function getServerSnapshot() {
  return false;
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  closeOnOverlayClick = true,
}: ModalProps) {
  // Replaces the old `mounted` state + effect. This is the React-sanctioned
  // way to know "has the client taken over from the server render yet"
  // without calling setState synchronously inside an effect.
  const mounted = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot,
  );

  const modalContainerRef = useRef<HTMLDivElement>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);

  // useId() generates a stable id that matches between server and client
  // render, so there's no hydration mismatch and no need to generate it
  // client-side inside an effect.
  const reactId = useId();
  const titleId = `modal-title-${reactId}`;
  const descriptionId = `modal-desc-${reactId}`;

  // Helper to query all focusable elements within the modal
  const getFocusableElements = (container: HTMLElement): HTMLElement[] => {
    const selectors = [
      "a[href]",
      "area[href]",
      'input:not([disabled]):not([type="hidden"])',
      "select:not([disabled])",
      "textarea:not([disabled])",
      "button:not([disabled])",
      "iframe",
      "object",
      "embed",
      "[contenteditable]",
      '[tabindex]:not([tabindex="-1"])',
    ].join(",");

    const elements = Array.from(
      container.querySelectorAll<HTMLElement>(selectors),
    );
    return elements.filter((el) => {
      const style = window.getComputedStyle(el);
      return (
        style.display !== "none" &&
        style.visibility !== "hidden" &&
        el.getAttribute("aria-hidden") !== "true" &&
        !el.hasAttribute("disabled")
      );
    });
  };

  // Focus management: when modal opens or closes
  useEffect(() => {
    if (!mounted || !isOpen) return;

    // Save current active element before shifting focus
    previousActiveElementRef.current =
      document.activeElement as HTMLElement | null;

    // Delay focus slightly to ensure render and transition finish
    const focusTimeout = setTimeout(() => {
      if (modalContainerRef.current) {
        const focusable = getFocusableElements(modalContainerRef.current);
        if (focusable.length > 0) {
          focusable[0].focus();
        } else {
          // Fallback: focus the modal container itself
          modalContainerRef.current.focus();
        }
      }
    }, 50);

    // Prevent body scroll when modal is open
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";

    return () => {
      clearTimeout(focusTimeout);
      document.body.style.overflow = originalStyle;
      // Restore focus to previous active element on unmount or close
      if (
        previousActiveElementRef.current &&
        typeof previousActiveElementRef.current.focus === "function"
      ) {
        previousActiveElementRef.current.focus();
      }
    };
  }, [isOpen, mounted]);

  // Handle all keyboard interactions (Escape and Tab trapping)
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!isOpen) return;

    if (event.key === "Escape") {
      event.preventDefault();
      onClose();
      return;
    }

    if (event.key === "Tab") {
      if (!modalContainerRef.current) return;

      const focusable = getFocusableElements(modalContainerRef.current);
      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }

      const firstElement = focusable[0];
      const lastElement = focusable[focusable.length - 1];
      const activeElement = document.activeElement;

      if (event.shiftKey) {
        // Shift + Tab: trap focus and cycle backwards
        if (
          activeElement === firstElement ||
          !focusable.includes(activeElement as HTMLElement)
        ) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab: trap focus and cycle forwards
        if (
          activeElement === lastElement ||
          !focusable.includes(activeElement as HTMLElement)
        ) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    }
  };

  // Handle clicking outside the modal content to close
  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnOverlayClick && event.target === event.currentTarget) {
      onClose();
    }
  };

  if (!mounted || !isOpen) return null;

  const modalMarkup = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs transition-opacity duration-300"
      onClick={handleOverlayClick}
      data-testid="modal-overlay"
    >
      <div
        ref={modalContainerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        tabIndex={-1}
        className="relative w-full max-w-md p-6 bg-white rounded-lg shadow-xl outline-hidden focus:ring-2 focus:ring-blue-500"
        onKeyDown={handleKeyDown}
        data-testid="modal-content"
      >
        {/* Header containing Accessible Title */}
        <div className="flex items-start justify-between mb-4">
          <h2 id={titleId} className="text-xl font-bold text-gray-900">
            {title}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Accessible Description */}
        {description && (
          <p id={descriptionId} className="mb-4 text-sm text-gray-500">
            {description}
          </p>
        )}

        {/* Modal Main Content */}
        <div className="mt-2 text-gray-700">{children}</div>
      </div>
    </div>
  );

  return createPortal(modalMarkup, document.body);
}
