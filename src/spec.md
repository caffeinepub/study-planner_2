# Specification

## Summary
**Goal:** Replace the Notes Cleaner's bullet splitting engine with intelligent semantic analysis that preserves scientific compound terms and only splits at logical phrase boundaries.

**Planned changes:**
- Remove all existing bullet point splitting logic (convertToParagraphToPoints, convertToBulletPoints, definition style formatting)
- Implement semantic phrase detection that keeps scientific compound terms intact (e.g., "carbon dioxide and water", "semi permeable membrane", "low solute concentration")
- Add smart splitting logic that only creates multiple bullets when 2+ standalone technical phrases appear sequentially WITHOUT conjunctions
- Preserve complete sentences as single bullets when they contain subject + verb + descriptive clause or process explanation
- Add validation rules to prevent single-word bullets, conjunction-led bullets, and modifier-separated bullets
- Apply semantic grouping before bullet conversion across all three conversion modes (Convert Paragraph to Points, Convert to Bullet Points, Definition Style Format)

**User-visible outcome:** The Notes Cleaner will produce more academically accurate bullet points that preserve the meaning of scientific content, avoid fragmenting compound terms, and respect logical phrase boundaries instead of mechanically splitting on conjunctions.
