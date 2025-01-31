// biome-ignore lint/style/useImportType: <explanation>
import { CheckItem } from "@app/components/PageComponents/ConfigurationCheck/ConfigurationCheck";
import { Protobuf } from "@meshtastic/js";

export const deviceChecks: CheckItem[] = [
  {
    title: "Role correctement configuré",
    check: (value, config) => {
      if (value === Protobuf.Config.Config_DeviceConfig_Role.CLIENT) {
        return {
          status: "warn",
          message:
            "Si votre noeud est dans un espace clos, le rôle CLIENT_MUTE est recommandé",
        };
      }
      if (value === Protobuf.Config.Config_DeviceConfig_Role.CLIENT_MUTE) {
        return {
          status: "success",
          message: "Role CLIENT_MUTE correctement configuré",
        };
      }
      return {
        status: "error",
        message:
          "Si votre noeud est dans un espace clos, le rôle CLIENT_MUTE est recommandé",
      };
    },
    field: "config.device.role",
  },
  {
    title: "Partage des infos du node",
    check: (value, config) => {
      if (Number.parseInt(`${value}`) > 0) {
        return {
          status: "success",
          message: `Transmission toutes les ${Number.parseInt(`${value}`) / 60} min`,
        };
      }
      return { status: "warn", message: "Personne ne pourra vous identifier" };
    },
    field: "config.device.nodeInfoBroadcastSecs",
  },
];
