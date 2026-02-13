# Production Version Release Metadata

This directory contains deployment metadata used by the CI/CD system to promote draft versions to the live production channel.

## Files

### production-version.txt
Contains a single numeric value indicating which draft version is currently promoted to the Live/Production channel.

**Current value:** The number in this file represents the draft version that should be served to end users.

## Usage

The deployment system reads `production-version.txt` as the single source of truth for determining which draft build to promote to production.

**Important:** This is a promotion-only operation. Do not modify application source files (under `frontend/src/`) as part of the promotion process. The promotion step should only update this metadata file to reference an existing, tested draft build.

## Process

1. Test the draft version thoroughly
2. Update `production-version.txt` with the draft version number
3. Commit and deploy
4. The CI/CD system will promote that draft to the live channel

No code changes, rebuilds, or recompilation should occur during promotion.
