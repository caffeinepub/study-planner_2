# Specification

## Summary
**Goal:** Add a post-cleaning pass that splits long bullet points with multiple actions into separate bullets.

**Planned changes:**
- Implement a second processing pass after initial cleaning but before display output
- Detect bullets with 10+ words, multiple action phrases, and no commas/conjunctions
- Split detected bullets into multiple action-based bullets using verb changes and noun phrase boundaries
- Apply splitting only to "Convert Paragraph to Points" and "Definition Style Format" modes
- Recognize academic action keywords: helps, removal, distribution, movement, absorption, transport, formation, release, regulation, maintenance

**User-visible outcome:** Long bullet points containing multiple actions are automatically split into clearer, separate action-based bullets in Convert Paragraph to Points and Definition Style Format modes.
