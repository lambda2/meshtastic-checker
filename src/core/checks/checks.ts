import type {
  CheckItem,
  CheckResult,
  ConfigState,
} from "@app/components/PageComponents/ConfigurationCheck/ConfigurationCheck";
import { channelChecks } from "./channel";
import { deviceChecks } from "./device";
import { loraChecks } from "./lora";
import { positionChecks } from "./position";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function _get(object: any, path: string, defval = null) {
  const apath = path.split(".");
  // biome-ignore lint/complexity/useOptionalChain: <explanation>
  const val = apath.reduce(
    (xs, x) => (xs && (xs[x] !== null || xs[x] !== undefined) ? xs[x] : defval),
    object,
  );
  console.debug(`GET ${path}: ${val}`);
  return val;
}

export const checks: { [key: string]: CheckItem[] } = {
  "Configuration de l'appareil": deviceChecks,
  "Configuration de la position": positionChecks,
  "Configuration du lora": loraChecks,
  "Configuration des canaux": channelChecks,
};

export const computeChecks = (
  configuration: ConfigState,
): { [key: string]: CheckResult[] } => {
  console.log("Computing config ", { configuration });
  const entries = Object.keys(checks).map((k) => [
    k,
    checks[k].flatMap((c) => {
      return {
        title: c.title,
        field: c.field,
        value: `${_get(configuration, c.field)}`,
        ...c.check(_get(configuration, c.field), configuration),
      };
    }),
  ]);
  console.log("Got ", { checks: Object.fromEntries(entries) });
  return Object.fromEntries(entries);
};
