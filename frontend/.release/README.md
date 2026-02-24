# Production Version Management

This directory contains metadata for the CI/CD deployment system.

## production-version.txt

Contains a single numeric value representing the draft version to promote to the Live/Production channel.

**Important constraints:**
- The file must contain exactly one numeric value (no extra whitespace or blank lines)
- Promotion-only deploys must change ONLY this file
- No files under `frontend/src/` may be modified during a promotion-only deploy
- The CI/CD system reads this file as the single source of truth for production promotion

## How it works

1. When `production-version.txt` is updated (e.g., from `72` to `73`), the CI/CD system promotes draft version 73 to the Live/Production channel
2. This is a metadata-only operation that does not rebuild or modify application source code
3. The promotion makes the specified draft version available to end users on the production URL

## Example

To promote draft version 75 to production:
