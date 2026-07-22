export function validateFullName(value) {
  const trimmed = value.trim();

  if (!trimmed) {
    return "Full name is required.";
  }

  const parts = trimmed.split(/\s+/);

  if (parts.length < 2) {
    return "Enter both a first and last name.";
  }

  return "";
}

export function validateEmail(value) {
  const trimmed = value.trim();

  if (!trimmed) {
    return "Email is required.";
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(trimmed)) {
    return "Enter a valid email address.";
  }

  return "";
}

export function validatePassword(value) {
  if (!value) {
    return "Password is required.";
  }

  const alphanumericPattern = /^[A-Za-z0-9]+$/;

  if (!alphanumericPattern.test(value)) {
    return "Password must contain only letters and numbers.";
  }

  if (value.length < 8) {
    return "Password must be at least 8 characters long.";
  }

  return "";
}
