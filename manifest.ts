import { createExtension } from '@jshookmcp/extension-sdk/plugin';
import type {
  PluginLifecycleContext,
  ToolArgs,
  ToolResponse,
} from '@jshookmcp/extension-sdk/plugin';

const PLUGIN_SLUG = 'script-presets';
const PRESET_PACKS = [
  'auth_extract',
  'bundle_search',
  'react_fill_form',
  'dom_find_upgrade_buttons',
] as const;

function jsonResponse(payload: Record<string, unknown>, isError = false): ToolResponse {
  return {
    content: [{ type: 'text', text: JSON.stringify(payload, null, 2) }],
    isError,
  };
}

function isPluginEnabled(ctx: PluginLifecycleContext): boolean {
  const value = ctx.getConfig(`plugins.${PLUGIN_SLUG}.enabled`, true);
  return typeof value === 'boolean' ? value : true;
}

async function handleHealth(_args: ToolArgs, ctx: PluginLifecycleContext) {
  return jsonResponse({
    success: true,
    pluginId: ctx.pluginId,
    loadedAt: ctx.getRuntimeData('loadedAt') ?? null,
    enabled: isPluginEnabled(ctx),
    mode: ctx.getConfig(`plugins.${PLUGIN_SLUG}.mode`, 'scaffold'),
    presetPackCount: PRESET_PACKS.length,
  });
}

async function handleCatalog(_args: ToolArgs, ctx: PluginLifecycleContext) {
  return jsonResponse({
    success: true,
    pluginId: ctx.pluginId,
    externalizationTarget: 'built-in page_script presets',
    packs: PRESET_PACKS.map((name) => ({
      name,
      status: 'planned',
      source: 'core/page_script_register',
    })),
  });
}

export default createExtension('io.github.vmoranv.script-presets', '0.1.0')
  .compatibleCore('>=0.2.0')
  .configDefault(`plugins.${PLUGIN_SLUG}.enabled`, true)
  .configDefault(`plugins.${PLUGIN_SLUG}.mode`, 'scaffold')
  .metric(['script_presets_health_calls_total', 'script_presets_catalog_calls_total'])
  .tool(
    'script_presets_health',
    'Return scaffold status for the script presets plugin repository.',
    {},
    handleHealth,
  )
  .tool(
    'script_presets_catalog',
    'List the built-in preset packs targeted for future externalization from jshookmcp core.',
    {},
    handleCatalog,
  )
  .onLoad((ctx) => {
    ctx.setRuntimeData('loadedAt', new Date().toISOString());
  })
  .onValidate((ctx: PluginLifecycleContext) => {
    const enabled = isPluginEnabled(ctx);
    if (!enabled) return { valid: false, errors: ['Plugin disabled by config'] };
    return { valid: true, errors: [] };
  });
