import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SettingsForm, {
  validateFullName,
  validateEmail,
  validatePassword,
} from "./SettingsForm";

// --- Pure validation function tests ---

describe("validateFullName", () => {
  it("rejects an empty value", () => {
    expect(validateFullName("")).toMatch(/required/i);
  });

  it("rejects a single name with no last name", () => {
    expect(validateFullName("Jane")).toMatch(/first and last/i);
  });

  it("accepts a first and last name", () => {
    expect(validateFullName("Jane Doe")).toBe("");
  });

  it("accepts a full name with extra whitespace", () => {
    expect(validateFullName("  Jane   Doe  ")).toBe("");
  });
});

describe("validateEmail", () => {
  it("rejects an empty value", () => {
    expect(validateEmail("")).toMatch(/required/i);
  });

  it("rejects a value with no @ symbol", () => {
    expect(validateEmail("jane.doe.example.com")).toMatch(/valid email/i);
  });

  it("rejects a value with no domain", () => {
    expect(validateEmail("jane@doe")).toMatch(/valid email/i);
  });

  it("accepts a well-formed email", () => {
    expect(validateEmail("jane@example.com")).toBe("");
  });
});

describe("validatePassword", () => {
  it("rejects an empty value", () => {
    expect(validatePassword("")).toMatch(/required/i);
  });

  it("rejects passwords shorter than 8 characters", () => {
    expect(validatePassword("abc123")).toMatch(/8 characters/i);
  });

  it("rejects passwords with non-alphanumeric characters", () => {
    expect(validatePassword("abcd123!")).toMatch(/letters and numbers/i);
  });

  it("accepts an 8+ character alphanumeric password", () => {
    expect(validatePassword("abcd1234")).toBe("");
  });
});

// --- Component behavior tests ---

describe("SettingsForm component", () => {
  it("renders all three fields with accessible labels", () => {
    render(<SettingsForm />);
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it("disables the Save button when the form is empty", () => {
    render(<SettingsForm />);
    expect(screen.getByRole("button", { name: /save changes/i })).toBeDisabled();
  });

  it("shows a validation message below a field after it is touched and left invalid", async () => {
    render(<SettingsForm />);
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: "not-an-email" } });
    fireEvent.blur(emailInput);
    expect(await screen.findByText(/valid email address/i)).toBeInTheDocument();
  });

  it("does not show a validation message before a field is touched", () => {
    render(<SettingsForm />);
    expect(screen.queryByText(/full name is required/i)).not.toBeInTheDocument();
  });

  it("enables the Save button once all fields are valid", async () => {
    const user = userEvent.setup();
    render(<SettingsForm />);

    await user.type(screen.getByLabelText(/full name/i), "Jane Doe");
    await user.type(screen.getByLabelText(/email/i), "jane@example.com");
    await user.type(screen.getByLabelText(/password/i), "abcd1234");

    expect(screen.getByRole("button", { name: /save changes/i })).toBeEnabled();
  });

  it("shows a success message after saving a valid form", async () => {
    const user = userEvent.setup();
    render(<SettingsForm />);

    await user.type(screen.getByLabelText(/full name/i), "Jane Doe");
    await user.type(screen.getByLabelText(/email/i), "jane@example.com");
    await user.type(screen.getByLabelText(/password/i), "abcd1234");
    await user.click(screen.getByRole("button", { name: /save changes/i }));

    expect(await screen.findByText(/settings saved/i)).toBeInTheDocument();
  });

  it("does not show a success message when the form has not been saved", () => {
    render(<SettingsForm />);
    expect(screen.queryByText(/settings saved/i)).not.toBeInTheDocument();
  });
});
