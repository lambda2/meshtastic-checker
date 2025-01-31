// biome-ignore lint/style/useImportType: <explanation>
import { CheckItem } from "@app/components/PageComponents/ConfigurationCheck/ConfigurationCheck";
import { Protobuf } from "@meshtastic/js";

export const positionChecks: CheckItem[] = [
  {
    title: "Partage de la position",
    check: (value, config) => {
      if (Number.parseInt(`${value}`) > 0) {
        return {
          status: "success",
          message: `Transmission toutes les ${Number.parseInt(`${value}`) / 60} min`,
        };
      }
      return { status: "warn", message: "Personne ne pourra vous localiser" };
    },
    field: "config.position.positionBroadcastSecs",
  },
];
