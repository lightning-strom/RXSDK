# UPM Publish Troubleshooting

## Auth Checks

Check whether the current machine is authenticated:

```bash
npm whoami --registry http://60.205.123.114:4873/
```

If this succeeds, publish can proceed.

If this fails with `ENEEDAUTH`, the machine is not logged in or has no valid token.

## E401 During `npm login` Or `npm adduser`

Symptoms:

- `npm ERR! code E401`
- `Unable to authenticate, your authentication token seems to be invalid.`
- registry responses mention `Basic, Bearer`

Recommended response:

1. Stop retrying the same login command without new information.
2. Prefer a registry token in project `.npmrc`.
3. Ask the registry admin for a new publish token if the password is unknown or expired.
4. Re-run `npm whoami --registry http://60.205.123.114:4873/` after updating auth.

Suggested `.npmrc`:

```ini
registry=http://60.205.123.114:4873/
//60.205.123.114:4873/:_authToken=YOUR_TOKEN
always-auth=true
```

Do not commit `.npmrc` with secrets.

## Publish Failed After Version Bump

The script bumps versions before publishing all packages:

```bash
./scripts/publish-upm.sh --version 1.6.18
```

That means an auth failure can still leave many `Packages/com.ruixue.* / package.json` files modified locally.

When reporting a failure, explicitly tell the user:

- no package may have been published
- local version files were already changed
- they can fix auth and rerun the same command

## Validating A Successful Release

Look for all of the following:

1. Exit code `0`
2. Full release output contains `全部发布完成。`
3. Published packages print lines like `+ com.ruixue.unitysdk.base@1.6.18`

## Warnings That Do Not Necessarily Block Release

This warning alone is not a failure:

```text
npm WARN publish Removed invalid "scripts"
```

If the package still prints `+ com.ruixue...@<version>`, publish succeeded and the warning can be reported as non-blocking.
