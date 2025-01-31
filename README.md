# Meshtastic checker

## Overview

Checks that a Meshtatstic device is properly configured for the french [Gaulix](https://gaulix.fr) 868 MHz network.

- [Gaulix settings](https://gaulix.fr/documentations/parametrages-de-votre-noeud/)
- [QR codes](https://gaulix.fr/les-qr-codes-de-parametrages-rapides-2/)

Forked from the official [Meshtastic](https://meshtastic.org) web interface, that can be hosted or served from a node.

## Development & Building

### Building and Packaging

Build the project:

```bash
pnpm build
```

GZip the output:

```bash
pnpm package
```

### Development

Install the dependencies.

```bash
pnpm i
```

Start the development server:

```bash
pnpm dev
```
