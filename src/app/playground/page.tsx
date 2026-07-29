"use client";

import React, { useState } from "react";
import { Modal } from "./components/Modal";
import { Tabs } from "./components/Tabs";
import { Disclosure } from "./components/Disclosure";

export default function PlaygroundPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <main className="max-w-2xl mx-auto p-8 space-y-12">
      <h1 className="text-2xl font-bold">Accessible Components Playground</h1>

      {/* --- Modal --- */}
      <section>
        <h2 className="text-lg font-semibold mb-2">Modal</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer"
        >
          Open modal
        </button>
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Example modal"
          description="Tab should cycle only within this dialog, and Escape should close it."
        >
          <label className="block mb-2 text-sm">
            Name
            <input
              type="text"
              className="mt-1 block w-full border rounded-md px-2 py-1"
            />
          </label>
          <button className="px-3 py-1.5 bg-gray-100 rounded-md cursor-pointer">
            A focusable button inside the modal
          </button>
        </Modal>
      </section>

      {/* --- Tabs --- */}
      <section>
        <h2 className="text-lg font-semibold mb-2">Tabs</h2>
        <Tabs
          ariaLabel="Example tabs"
          items={[
            {
              id: "profile",
              label: "Profile",
              content: <p>Profile panel content.</p>,
            },
            {
              id: "settings",
              label: "Settings",
              content: <p>Settings panel content.</p>,
            },
            {
              id: "billing",
              label: "Billing",
              content: <p>Billing panel content.</p>,
              disabled: true,
            },
            { id: "help", label: "Help", content: <p>Help panel content.</p> },
          ]}
        />
      </section>

      {/* --- Disclosure --- */}
      <section>
        <h2 className="text-lg font-semibold mb-2">Disclosure</h2>
        <Disclosure summary="What is an ARIA disclosure?">
          <p>
            A disclosure is a button that shows or hides a section of content.
            This one uses a single native button, aria-expanded, and the
            `hidden` attribute — no extra keyboard handling needed.
          </p>
        </Disclosure>
      </section>
    </main>
  );
}
