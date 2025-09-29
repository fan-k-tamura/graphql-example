# Repository Guidelines
## Project Structure & Module Organization
`src/server.ts` boots Apollo Server with generated schema assets. Feature folders live under `src/gql/schema`, each pairing `schema.graphql` with resolvers and loaders; generated outputs (`*.generated.*`) sit at the root of that tree—never edit them. Data adapters and pseudo SQL live in `src/data/db`. Shared tooling sits in `scripts/`, while codegen plugins live in `src/codegen/plugins/`, and docs in `docs/`. Add new feature code beside its schema so codegen can wire it automatically.

## Build, Test, and Development Commands
- `pnpm install` syncs dependencies defined in `pnpm-lock.yaml`.
- `pnpm dev` runs `ts-node-dev` with hot reload on http://localhost:4000/.
- `pnpm start` launches a single `ts-node` process for smoke checks.
- `pnpm codegen` processes `src/codegen.ts` to refresh types, resolvers, and node registry files.
- `pnpm lint` runs Biome linting with repository defaults.
- `pnpm format` previews Biome formatting; use `pnpm format:write` to apply edits.

## Coding Style & Naming Conventions
Stick to strict TypeScript with Biome-enforced 2-space indentation. Use `camelCase` for variables, `PascalCase` for GraphQL types, and kebab-case filenames for SDL (e.g., `schema.graphql`). Co-locate resolvers in `schema/<feature>/resolvers/<Type>/` and expose loaders through `create<Domain>Loaders`. After touching SDL or loader contracts, rerun `pnpm codegen` to sync generated artifacts.

## Testing Guidelines
Formal tests are light; validate schema behavior with `pnpm ts-node scripts/check-queries.ts`, extending the `cases` array when introducing new operations. For exploratory testing, hit the Playground at http://localhost:4000/ and capture the exact query or mutation in your PR notes.

## Commit & Pull Request Guidelines
With no legacy history, adopt concise, imperative commit titles (`Add vendor pagination edge cases`) and include rationale plus follow-up steps in the body as needed. PRs should describe the feature scope, call out schema or data changes, link issues, and attach example GraphQL operations or screenshots that prove the change. Re-run `pnpm codegen` before pushing so reviewers do not chase stale generated diffs.

## Codegen & Generated Files
Treat everything matching `*.generated.*` as read-only. If codegen behavior must change, adjust `src/codegen.ts` or `src/codegen/plugins/node-resolvers.js` and commit the regenerated output. Keep generated files in the same PR as the source change to preserve reproducibility for other agents.
