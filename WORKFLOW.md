# AI Workflow Comparison

## Overview

For this exercise, I implemented the same **Settings Form** feature using two different prompting approaches with Claude.

The first implementation was generated using a single, simple prompt with almost "no project context". I accepted the generated code with minimal guidance.

The second implementation used a much more detailed prompt that included project constraints, file references, validation requirements, accessibility considerations, CSS-only styling, verification steps, and a request for self-review.

## Comparison

The differences between the two implementations were clear.

The first version produced a basic implementation that did not fully satisfy the project requirements. It generated only a single JSX file without separate CSS, validation, or testing files, which made the code harder to maintain and required additional manual fixes. However, the overall logic was working as a "Settings form".

The second version followed the project requirements much more closely. Validation logic was separated into reusable utility functions, the component became easier to read, and the project structure was cleaner and easier to maintain. Claude also generated unit tests and provided a self-review, making the implementation easier to verify. Also better UX in general.

## Correctness

The second implementation produced more reliable code. The Save button remained disabled until all validation rules passed, validation messages appeared correctly, and the form behaved as expected after submission.

After fixing a few generated issues , infact they were not much, the application compiled successfully and worked correctly in my React + Vite project.

## Accessibility

Accessibility was noticeably better in the second implementation. Every input was connected to a proper label, suitable HTML input types were used, and accessibility attributes such as `aria-invalid`, `aria-describedby`, and `role="alert"` were included.

These improvements make the form easier to use with assistive technologies and improve the overall user experience.

## Edge Cases

The second prompt handled more edge cases than the first implementation.

It correctly validated:

- Empty fields
- Invalid email addresses
- Passwords shorter than eight characters
- Missing first or last names

The form also prevented submission while invalid and displayed clear validation messages to the user.

## Review Effort and AI Mistakes

The first implementation required considerably more manual review because it did not follow all project constraints.

One issue I found was that Claude exported helper validation functions from the React component, which triggered the React Fast Refresh ESLint rule. I fixed this by moving the validation functions into a separate `validation.js` file.

I also corrected an incorrect import path after reorganizing the files, which prevented Vite from compiling successfully.

Although the second prompt took longer to write, it reduced the overall debugging and review time.

## Lessons Learned

This exercise showed me that investing more time in writing a detailed prompt produces significantly better results.

Providing clear constraints, expected behavior, file organization, and verification steps helped Claude generate cleaner and more maintainable code.

I also learned that AI-generated code should never be accepted without verification. Running the application, checking ESLint, reviewing the generated code, and fixing any issues are essential parts of an effective AI-assisted development workflow.
