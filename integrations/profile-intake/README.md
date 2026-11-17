# Professional profile intake

Hosted companion: https://hwcpa-profile-intake.talwa3.chatgpt.site

This source mirrors the deployed Worker. The Sites project provisions a D1 binding named DB and applies the Drizzle migrations. Runtime secrets INTAKE_SECRET and OWNER_EMAIL are managed outside source. Never put link keys, tokens or secrets in Git.

Four personal forms: nitai, smadar, chen, eitan. Share links from the owner-only /manage page. A link grants access to that person’s answers; do not publish it in a public directory. Each submission is versioned. The short form explains that professional answers are for the public profile; submitting it makes those fields available from /api/profiles. There are no approval checkboxes or required individual questions. At least one answer is needed. Private notes and document links stay out of that endpoint. Hebrew fields update Hebrew profiles; English appears only when separately supplied. The site renders plain text and keeps verified existing credentials. There is no direct ChatGPT inbox, AI invocation, automatic translation or automatic review of uploaded credentials.

The reserved qa profile is excluded from the public endpoint. Browser submission and server readback were verified. Run npm ci, then node scripts/check-intake.mjs for SQLite integration checks. These checks cover the four people, validation, cross-person access, public/private separation, legacy publication withdrawal and owner-only management.
