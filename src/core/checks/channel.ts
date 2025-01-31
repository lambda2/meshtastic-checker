// biome-ignore lint/style/useImportType: <explanation>
import { CheckItem } from "@app/components/PageComponents/ConfigurationCheck/ConfigurationCheck";
import { Protobuf } from "@meshtastic/js";

const primaryValues = [
  ["Index primaire", "role", 1, "error"],
  ["Numéro de canal primaire", "settings.channelNum", 0, "error"],
  ["Clé de canal primaire", "settings.psk", 1, "error"],
  ["Canal primaire", "settings.name", "Fr_Balise", "error"],
  ["Id de canal primaire", "settings.id", 0, "error"],
  ["Envoi MQTT", "settings.uplinkEnabled", true, "warn"],
  ["Réception MQTT", "settings.downlinkEnabled", true, "warn"],
];

const secondaryValues = [
  ["Index secondaire", "role", 2, "error"],
  ["Numéro de canal secondaire", "settings.channelNum", 0, "error"],
  ["Clé de canal secondaire", "settings.psk", 1, "error"],
  ["Canal secondaire", "settings.name", "Fr_EMCOM", "error"],
  ["Id de canal secondaire", "settings.id", 0, "error"],
  ["Envoi MQTT", "settings.uplinkEnabled", true, "warn"],
  ["Réception MQTT", "settings.downlinkEnabled", true, "warn"],
];

const thirdValues = [
  ["Index secondaire", "role", 2, "error"],
  ["Numéro de canal secondaire", "settings.channelNum", 0, "error"],
  ["Clé de canal secondaire", "settings.psk", 1, "error"],
  ["Canal secondaire", "settings.name", "Fr_BlaBla", "error"],
  ["Id de canal secondaire", "settings.id", 0, "error"],
  ["Envoi MQTT", "settings.uplinkEnabled", true, "warn"],
  ["Réception MQTT", "settings.downlinkEnabled", true, "warn"],
];

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const genericCheck = (
  label: any,
  name: any,
  expectedValue: { toString: () => any },
  level: any,
) => {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  return (value: any, config: any) => {
    if (value?.toString() === expectedValue?.toString()) {
      return { status: "success", message: `${label} valide` };
    }
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    return {
      status: (level as any) ?? "error",
      message: `${label} invalide (${value}), définir ${name} sur ${expectedValue}`,
    };
  };
};

const additionalChecks = [primaryValues, secondaryValues, thirdValues].flatMap(
  (values, index) => {
    return values.map(([label, name, expectedValue, level]) => ({
      title: `Canal ${index}: Valeur de ${name}`,
      check: genericCheck(label, name, expectedValue, level),
      field: `channel_${index}.${name}`,
    }));
  },
);

export const channelChecks: CheckItem[] = [...additionalChecks];
