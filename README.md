# jshook_plugin_script_presets

TypeScript-first scaffold repository for externalizing built-in page script preset packs from `jshookmcp` core.

## Current scope

- preserve a dedicated plugin repo with the correct naming/package baseline
- expose a tiny catalog surface so runtime can verify the repo loads
- keep the actual preset migration for a later implementation pass

## Included right now

- `manifest.ts`: scaffold plugin entrypoint
- `meta.yaml`: local plugin metadata
- `docs/agent-recipes.md`: notes for future preset extraction work
- `dist/manifest.js`: generated locally by `pnpm run build` and ignored by Git

## Scaffold tools

- `script_presets_health`
- `script_presets_catalog`

## Dependency model

```json
{
  "@jshookmcp/extension-sdk": "^0.2.0"
}
```

## Install and build

```bash
pnpm install
pnpm run build
pnpm run check
```

## Load the plugin into jshook

```bash
MCP_PLUGIN_ROOTS=D:\\coding\\reverse\\jshook_plugin_script_presets
```

Then run:

1. `extensions_reload`
2. `extensions_list`
3. `search_tools`

## Next implementation targets

1. move built-in page script presets out of core
2. define preset pack format and validation
3. replace the scaffold catalog tool with real preset install/list logic
