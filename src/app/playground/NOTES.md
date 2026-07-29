# NOTES.md — Hand-built components vs. shadcn/ui

## Setup

```bash
npx shadcn@latest init
npx shadcn@latest add dialog tabs
```

This drops `components/ui/dialog.tsx` and `components/ui/tabs.tsx` into the
project. Both are thin, styled wrappers around **Radix UI primitives**
(`Dialog` and `Tabs` from the `radix-ui` package, as of the current
"new-york" style) — shadcn's own files contain almost no interaction logic.
`TabsTrigger` and `TabsContent` are `RadixTabsPrimitive.Trigger` /
`.Content` with Tailwind classes attached via `cva`; `DialogContent` is
`DialogPrimitive.Content` wrapped in Radix's `Portal`. Reading the generated
source really means reading `@radix-ui/react-dialog` and
`@radix-ui/react-tabs`, since that's where the actual ARIA/keyboard
engineering lives.

## Gaps between my version and shadcn's (Radix's)

### 1. My modal doesn't hide the rest of the page from assistive tech

My focus trap stops a **keyboard** user (Tab/Shift+Tab) from leaving the
dialog, but it does nothing about a **screen reader's virtual cursor**,
which browses the accessibility tree independently of keyboard focus. A
screen reader user could still swipe/arrow through page content behind the
open modal. Radix's `Dialog.Content` solves this by marking everything
outside the dialog `aria-hidden="true"` while it's open (an "inert
background" / focus-scope technique), then removing it on close. That's a
real, user-facing gap in my implementation, not just a nice-to-have.

**Fix for mine:** on open, walk `document.body`'s direct children other
than the portal root and toggle `aria-hidden="true"` on them (or use the
native `inert` attribute where supported), and reverse it on close.

### 2. My scroll lock causes layout shift; Radix's doesn't

I lock scrolling with `document.body.style.overflow = "hidden"`. If the
page had a visible scrollbar, this removes it and the page content
horizontally shifts underneath the modal. Radix uses `react-remove-scroll`
under the hood, which additionally pads the body by the scrollbar's width
so nothing jumps. I noticed this only by opening my modal on a page long
enough to scroll and watching the content twitch on open/close.

### 3. My tabs only support one activation mode and one orientation

I hard-coded **automatic activation** (arrow keys both move focus and
select the panel) and horizontal Left/Right navigation. Radix's `Tabs`
exposes an `activationMode` prop (`automatic` vs `manual`, where manual
requires Enter/Space to actually select a focused-but-not-yet-active tab —
useful when activating a tab is expensive) and an `orientation` prop that
remaps the relevant arrow keys to Up/Down for vertical tab lists. My
component would need real rework, not just a config flag, to support
either.

### 4. My tabs don't defend against dynamic tab lists as robustly

Radix computes the focusable/enabled tab set through its own internal
registration system (`useCollection`), so tabs that mount/unmount
dynamically, or whose `disabled` state changes after render, stay correct
without extra bookkeeping. Mine derives `enabledIndices` fresh from the
`items` prop on every keydown, which works for my static demo list but
would need testing against tabs added/removed at runtime — a case I didn't
build or test for.

## What I verified working correctly by hand in mine

- Modal: focus is trapped inside on open, Escape closes it, focus returns
  to the triggering element on close, background click closes when enabled.
- Tabs: roving tabindex (only the selected tab is Tab-reachable), Left/
  Right/Home/End all work and wrap correctly, disabled tabs are skipped by
  arrow navigation.
- Disclosure: `aria-expanded` stays in sync, content is fully removed from
  the accessibility tree and tab order via the `hidden` attribute when
  collapsed (not just visually hidden), native button gives Enter/Space for
  free.

## Takeaway

Building these by hand surfaced two categories of things Radix (and by
extension shadcn) does that I wouldn't have known to check for from the APG
patterns alone: **hiding inert content from assistive tech during a modal**
(a screen-reader-only concern that's invisible if you only test with a
keyboard and eyes), and **layout stability during scroll lock** (a visual
polish issue with no ARIA angle at all). Both are the kind of thing you'd
ship without noticing unless you specifically test with a screen reader or
on a scrollable page — exactly the review skill this exercise is for.
