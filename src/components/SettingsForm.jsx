import { useState, useEffect, useRef } from "react";
import { User, Bell, Shield, Trash2, Check, ChevronRight } from "lucide-react";

/**
 * Settings form — styled like a spec sheet / instrument panel.
 * Left rail = numbered index of sections. Right pane = the fields.
 * Bottom bar behaves like a status readout: idle / unsaved / saved.
 */

const SECTIONS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
  { id: "danger", label: "Danger zone", icon: Trash2 },
];

const initialState = {
  name: "Jordan Blake",
  email: "jordan@studio.io",
  handle: "jblake",
  bio: "Product designer, mostly nocturnal.",
  emailUpdates: true,
  productNews: false,
  weeklyDigest: true,
  mentionAlerts: true,
  twoFactor: false,
  sessionTimeout: "30",
  visibility: "team",
};

function Field({ label, hint, children }) {
  return (
    <label className="block">
      <span className="block text-[13px] font-medium text-[#1B1A17] mb-1.5">
        {label}
      </span>
      {children}
      {hint && (
        <span className="block text-[12px] text-[#8B877E] mt-1.5 leading-relaxed">
          {hint}
        </span>
      )}
    </label>
  );
}

function TextInput(props) {
  return (
    <input
      {...props}
      className="w-full h-10 rounded-[6px] border border-[#E3DFD5] bg-white px-3 text-[14px] text-[#1B1A17] placeholder:text-[#B4AFA4] outline-none transition-colors focus:border-[#2F5D50] focus:ring-2 focus:ring-[#2F5D50]/15"
    />
  );
}

function TextArea(props) {
  return (
    <textarea
      {...props}
      className="w-full rounded-[6px] border border-[#E3DFD5] bg-white px-3 py-2.5 text-[14px] text-[#1B1A17] placeholder:text-[#B4AFA4] outline-none resize-none transition-colors focus:border-[#2F5D50] focus:ring-2 focus:ring-[#2F5D50]/15"
    />
  );
}

function Toggle({ checked, onChange, label, description }) {
  return (
    <div className="flex items-start justify-between gap-6 py-3.5 border-b border-[#EFEBE1] last:border-b-0">
      <div>
        <p className="text-[14px] font-medium text-[#1B1A17]">{label}</p>
        {description && (
          <p className="text-[12px] text-[#8B877E] mt-0.5 leading-relaxed max-w-[420px]">
            {description}
          </p>
        )}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`relative shrink-0 w-[38px] h-[22px] rounded-full transition-colors mt-0.5 ${
          checked ? "bg-[#2F5D50]" : "bg-[#DFDAD0]"
        }`}
      >
        <span
          className={`absolute top-[3px] left-[3px] w-[16px] h-[16px] rounded-full bg-white shadow-sm transition-transform ${
            checked ? "translate-x-[16px]" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}

export default function SettingsForm() {
  const [active, setActive] = useState("profile");
  const [saved, setSaved] = useState(initialState);
  const [draft, setDraft] = useState(initialState);
  const [status, setStatus] = useState("idle"); // idle | unsaved | saved
  const savedTimer = useRef(null);

  const dirty = JSON.stringify(saved) !== JSON.stringify(draft);

  useEffect(() => {
    if (dirty) setStatus("unsaved");
    else if (status !== "saved") setStatus("idle");
  }, [dirty]); // eslint-disable-line react-hooks/exhaustive-deps

  const set = (key) => (value) =>
    setDraft((d) => ({
      ...d,
      [key]:
        typeof value === "object" && value?.target ? value.target.value : value,
    }));

  const handleSave = () => {
    setSaved(draft);
    setStatus("saved");
    clearTimeout(savedTimer.current);
    savedTimer.current = setTimeout(() => setStatus("idle"), 2200);
  };

  const handleDiscard = () => setDraft(saved);

  const sectionIndex = SECTIONS.findIndex((s) => s.id === active) + 1;

  return (
    <div className="min-h-[600px] w-full bg-[#FAF9F5] flex justify-center px-4 py-10 font-sans">
      <div className="w-full max-w-[880px]">
        {/* Header */}
        <div className="mb-8">
          <p
            className="text-[11px] tracking-[0.14em] text-[#8B877E] uppercase mb-1.5"
            style={{ fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}
          >
            Account / Preferences
          </p>
          <h1 className="text-[26px] font-semibold text-[#1B1A17] tracking-tight">
            Settings
          </h1>
        </div>

        <div className="flex gap-8 items-start">
          {/* Left index rail */}
          <nav className="w-[196px] shrink-0 sticky top-6">
            <ul className="space-y-0.5">
              {SECTIONS.map((s, i) => {
                const Icon = s.icon;
                const isActive = s.id === active;
                return (
                  <li key={s.id}>
                    <button
                      onClick={() => setActive(s.id)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-[6px] text-left transition-colors ${
                        isActive
                          ? "bg-white border border-[#E3DFD5]"
                          : "border border-transparent hover:bg-white/60"
                      }`}
                    >
                      <span
                        className={`text-[11px] w-4 shrink-0 ${
                          isActive ? "text-[#2F5D50]" : "text-[#B4AFA4]"
                        }`}
                        style={{
                          fontFamily:
                            "'IBM Plex Mono', ui-monospace, monospace",
                        }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <Icon
                        size={15}
                        className={
                          isActive ? "text-[#2F5D50]" : "text-[#8B877E]"
                        }
                      />
                      <span
                        className={`text-[13.5px] ${
                          isActive
                            ? "text-[#1B1A17] font-medium"
                            : "text-[#5C584F]"
                        } ${s.id === "danger" ? "text-[#B23A2E]" : ""}`}
                      >
                        {s.label}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Content panel */}
          <div className="flex-1 min-w-0 bg-white border border-[#E7E4DC] rounded-[10px] p-7 pb-8">
            <div className="flex items-center gap-2 mb-6">
              <span
                className="text-[11px] text-[#B4AFA4]"
                style={{
                  fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
                }}
              >
                {String(sectionIndex).padStart(2, "0")}
              </span>
              <ChevronRight size={12} className="text-[#D6D1C5]" />
              <span className="text-[13px] font-medium text-[#1B1A17]">
                {SECTIONS.find((s) => s.id === active)?.label}
              </span>
            </div>

            {active === "profile" && (
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-5">
                  <Field label="Full name">
                    <TextInput
                      value={draft.name}
                      onChange={(e) => set("name")(e.target.value)}
                    />
                  </Field>
                  <Field label="Handle">
                    <TextInput
                      value={draft.handle}
                      onChange={(e) => set("handle")(e.target.value)}
                    />
                  </Field>
                </div>
                <Field
                  label="Email"
                  hint="Used for sign-in and account notices."
                >
                  <TextInput
                    type="email"
                    value={draft.email}
                    onChange={(e) => set("email")(e.target.value)}
                  />
                </Field>
                <Field label="Bio">
                  <TextArea
                    rows={3}
                    value={draft.bio}
                    onChange={(e) => set("bio")(e.target.value)}
                  />
                </Field>
                <Field label="Profile visibility">
                  <select
                    value={draft.visibility}
                    onChange={(e) => set("visibility")(e.target.value)}
                    className="w-full h-10 rounded-[6px] border border-[#E3DFD5] bg-white px-3 text-[14px] text-[#1B1A17] outline-none focus:border-[#2F5D50] focus:ring-2 focus:ring-[#2F5D50]/15"
                  >
                    <option value="public">Public — anyone can view</option>
                    <option value="team">Team — only your workspace</option>
                    <option value="private">Private — only you</option>
                  </select>
                </Field>
              </div>
            )}

            {active === "notifications" && (
              <div>
                <Toggle
                  label="Email updates"
                  description="Account activity and important changes."
                  checked={draft.emailUpdates}
                  onChange={set("emailUpdates")}
                />
                <Toggle
                  label="Product news"
                  description="Occasional notes about new features."
                  checked={draft.productNews}
                  onChange={set("productNews")}
                />
                <Toggle
                  label="Weekly digest"
                  description="A summary of activity every Monday."
                  checked={draft.weeklyDigest}
                  onChange={set("weeklyDigest")}
                />
                <Toggle
                  label="Mention alerts"
                  description="Notify me when someone mentions me directly."
                  checked={draft.mentionAlerts}
                  onChange={set("mentionAlerts")}
                />
              </div>
            )}

            {active === "security" && (
              <div className="space-y-5">
                <Toggle
                  label="Two-factor authentication"
                  description="Require a code from your device at sign-in."
                  checked={draft.twoFactor}
                  onChange={set("twoFactor")}
                />
                <Field
                  label="Session timeout"
                  hint="Automatically sign out after this many minutes of inactivity."
                >
                  <select
                    value={draft.sessionTimeout}
                    onChange={(e) => set("sessionTimeout")(e.target.value)}
                    className="w-full h-10 rounded-[6px] border border-[#E3DFD5] bg-white px-3 text-[14px] text-[#1B1A17] outline-none focus:border-[#2F5D50] focus:ring-2 focus:ring-[#2F5D50]/15"
                  >
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="60">1 hour</option>
                    <option value="never">Never</option>
                  </select>
                </Field>
                <Field label="Password">
                  <button
                    type="button"
                    className="h-10 px-4 rounded-[6px] border border-[#E3DFD5] text-[13.5px] font-medium text-[#1B1A17] hover:bg-[#FAF9F5] transition-colors"
                  >
                    Change password
                  </button>
                </Field>
              </div>
            )}

            {active === "danger" && (
              <div className="space-y-4">
                <div className="rounded-[8px] border border-[#F0D9D4] bg-[#FBF1EE] p-4">
                  <p className="text-[14px] font-medium text-[#8A2E23]">
                    Deactivate account
                  </p>
                  <p className="text-[12.5px] text-[#9A6156] mt-1 leading-relaxed max-w-[440px]">
                    Your profile and data are hidden immediately. You can
                    reactivate by signing back in within 30 days.
                  </p>
                  <button
                    type="button"
                    className="mt-3 h-9 px-4 rounded-[6px] border border-[#DEA79C] text-[13px] font-medium text-[#8A2E23] hover:bg-white transition-colors"
                  >
                    Deactivate account
                  </button>
                </div>
                <div className="rounded-[8px] border border-[#F0D9D4] bg-[#FBF1EE] p-4">
                  <p className="text-[14px] font-medium text-[#8A2E23]">
                    Delete account
                  </p>
                  <p className="text-[12.5px] text-[#9A6156] mt-1 leading-relaxed max-w-[440px]">
                    Permanently removes your account and all associated data.
                    This cannot be undone.
                  </p>
                  <button
                    type="button"
                    className="mt-3 h-9 px-4 rounded-[6px] bg-[#B23A2E] text-[13px] font-medium text-white hover:bg-[#9A3226] transition-colors"
                  >
                    Delete account
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Status / save bar */}
        <div className="mt-5 flex items-center justify-between rounded-[8px] border border-[#E7E4DC] bg-white px-4 py-3">
          <div className="flex items-center gap-2">
            <span
              className={`w-[7px] h-[7px] rounded-full ${
                status === "unsaved"
                  ? "bg-[#C58A1F] animate-pulse"
                  : status === "saved"
                    ? "bg-[#2F5D50]"
                    : "bg-[#D6D1C5]"
              }`}
            />
            <span
              className="text-[11px] tracking-[0.08em] uppercase text-[#8B877E]"
              style={{ fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}
            >
              {status === "unsaved"
                ? "Unsaved changes"
                : status === "saved"
                  ? "All changes saved"
                  : "Up to date"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {dirty && (
              <button
                type="button"
                onClick={handleDiscard}
                className="h-8 px-3.5 rounded-[6px] text-[13px] font-medium text-[#5C584F] hover:bg-[#FAF9F5] transition-colors"
              >
                Discard
              </button>
            )}
            <button
              type="button"
              onClick={handleSave}
              disabled={!dirty}
              className={`h-8 px-4 rounded-[6px] text-[13px] font-medium flex items-center gap-1.5 transition-colors ${
                dirty
                  ? "bg-[#2F5D50] text-white hover:bg-[#264C42]"
                  : "bg-[#F1EFE8] text-[#B4AFA4] cursor-not-allowed"
              }`}
            >
              {status === "saved" && <Check size={13} />}
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
