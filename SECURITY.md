# Security Policy

## Supported Versions

Security fixes are made on top of the latest release. Please upgrade to the
latest version before reporting an issue.

## Reporting a Vulnerability

To report security vulnerabilities, please send an email to:
- `security@blockstream.com`

Note: This email address is exclusively for vulnerability reporting.
Please do not open a public GitHub issue for security problems.

For all other inquiries/communication, please open an issue at
https://github.com/ElementsProject/cln-application/issues.

## Signatures For Releases

The following keys may be used to communicate sensitive information to
developers, and to validate signatures on releases:

| Name | Email | Fingerprint | Used for |
|------|-------|-------------|----------|
| Shahana Farooqui | `sfarooqui@blockstream.com` | 0CCA 8183 C13A 2389 A9C5  FD29 BFB0 1536 0049 CB56 | GitHub releases |

The public keys are also checked in under [`contrib/keys/`](contrib/keys/).

You can import a key by running the following command with that individual's fingerprint:
`gpg --keyserver hkps://keys.openpgp.org --recv-keys "<fingerprint>"`.
Ensure that you put quotes around fingerprints containing spaces.

Alternatively, import the checked-in copy:
`gpg --import contrib/keys/sfarooqui.txt`.

## Verifying a Release

Each GitHub release ships a `SHA256SUMS` file and a detached signature
`SHA256SUMS.asc`. To verify a downloaded release archive:

```
gpg --verify SHA256SUMS.asc SHA256SUMS
sha256sum --check --ignore-missing SHA256SUMS
```

To verify the signed git tag for a release:

```
git tag -v v26.04
```
