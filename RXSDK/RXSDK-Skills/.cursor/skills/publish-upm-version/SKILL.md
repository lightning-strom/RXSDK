---
name: publish-upm-version
description: Publish RuiXue UnitySDK UPM packages to the private registry, including auth checks, dry-run, full release, single-package release, and npm failure triage. Use when the user asks to publish a new SDK version, run scripts/publish-upm.sh, release com.ruixue packages, or troubleshoot UPM publish/auth errors.
---

# Publish UPM Version

Use this skill for the repo's UPM release workflow based on `scripts/publish-upm.sh`.

## Quick Start

Before running anything, confirm:

1. Target version, such as `1.6.18`
2. Scope: all packages or one package
3. Mode: `--dry-run` or real publish

If the user asks for a real publish and auth is uncertain, check first:

```bash
npm whoami --registry http://60.205.123.114:4873/
```

If that fails, stop and fix auth before publishing.

## Registry And Auth

- Default registry: `http://60.205.123.114:4873`
- `REGISTRY_URL` can override the default
- Prefer token auth via project `.npmrc`
- Never commit `.npmrc` or any token to git

Recommended `.npmrc` format:

```ini
registry=http://60.205.123.114:4873/
//60.205.123.114:4873/:_authToken=YOUR_TOKEN
always-auth=true
```

## Commands

Publish all packages:

```bash
./scripts/publish-upm.sh --version 1.6.18
```

Dry-run all packages:

```bash
./scripts/publish-upm.sh --version 1.6.18 --dry-run
```

Publish one package:

```bash
./scripts/publish-upm.sh --version 1.6.18 com.ruixue.unitysdk.base
```

Dry-run one package:

```bash
./scripts/publish-upm.sh --version 1.6.18 --dry-run com.ruixue.unitysdk.base
```

## Execution Workflow

1. Confirm the user wants a real publish, not just a dry-run.
2. Check whether another release command is already running in an existing terminal.
3. Verify auth with `npm whoami --registry http://60.205.123.114:4873/` when needed.
4. Run the selected command from the repo root.
5. Monitor the command until it exits or reaches a clear steady state.
6. Summarize the result for the user:
   - target version
   - published scope
   - success or failure
   - important warnings
   - local file changes left behind

## Important Script Behavior

- Full release requires `--version`
- Full release rewrites every `Packages/com.ruixue.*` `package.json` version before publish
- Those version changes remain in the working tree after success or failure
- Single-package release with `--version` only updates that package's `package.json`
- Dry-run uses `npm pack` and removes generated `com.ruixue.*.tgz`
- Full release publishes `com.ruixue.unitysdk.base` first, then the rest

## Success Signals

Treat the release as successful only when:

- the command exits with code `0`
- full release output contains `全部发布完成。`
- package publish output contains `+ com.ruixue...@<version>`

## Common Failure Rules

- If auth fails, do not keep retrying blindly
- If `npm whoami` returns `ENEEDAUTH`, fix auth before rerunning publish
- If `npm login` or `npm adduser` returns `E401`, prefer token auth in `.npmrc`
- If a publish fails after version bumping, tell the user that local `package.json` files were already modified

## Common Warnings

`npm WARN publish Removed invalid "scripts"` is a warning seen during publish. If the package still prints `+ com.ruixue...@<version>`, the publish succeeded.

## References

- Script overview: `scripts/README.md`
- Publish entrypoint: `scripts/publish-upm.sh`
- Failure details and handling: [troubleshooting.md](troubleshooting.md)
