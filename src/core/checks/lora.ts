// biome-ignore lint/style/useImportType: <explanation>
import { CheckItem } from "@app/components/PageComponents/ConfigurationCheck/ConfigurationCheck";
import { Protobuf } from "@meshtastic/js";

const defaultValues = [
  ["usePreset", true],
  ["bandwidth", 0],
  ["spreadFactor", 0],
  ["codingRate", 0],
  ["frequencyOffset", 0],
  ["txEnabled", true],
  ["channelNum", 0],
];

const additionalChecks: CheckItem[] = defaultValues.map(
  ([name, expectedValue]) => ({
    title: `Valeur de ${name}`,
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    check: (value: any, config: any) => {
      if (value === expectedValue) {
        return { status: "success", message: "" };
      }
      return {
        status: "error",
        message: `${name} invalide (${value}), définir sur ${expectedValue}`,
      };
    },
    field: `config.lora.${name}`,
  }),
);

export const loraChecks: CheckItem[] = [
  {
    title: "Fréquence correcte",
    check: (value, config) => {
      if (Number.parseFloat(`${value}`) === 869.4625244140625) {
        return {
          status: "success",
          message: "Fréquence définie sur 869.4625 MHz",
        };
      }
      return {
        status: "error",
        message: `Fréquence définie sur ${Number.parseFloat(`${value}`)} MHz au lieu de 869.4625244140625 MHz`,
      };
    },
    field: "config.lora.overrideFrequency",
  },
  {
    title: "Preset correct",
    check: (value, config) => {
      if (
        value === Protobuf.Config.Config_LoRaConfig_ModemPreset.LONG_MODERATE
      ) {
        return { status: "success", message: "Preset en LONG_MODERATE" };
      }
      return {
        status: "error",
        message: `Preset invalide: ${Protobuf.Config.Config_LoRaConfig_ModemPreset[value]}, passez en LONG_MODERATE`,
      };
    },
    field: "config.lora.modemPreset",
  },
  {
    title: "Région correcte",
    check: (value, config) => {
      if (value === Protobuf.Config.Config_LoRaConfig_RegionCode.EU_868) {
        return { status: "success", message: "Région EU_868" };
      }
      return {
        status: "error",
        message: `Région invalide: ${Protobuf.Config.Config_LoRaConfig_RegionCode[value]}, passez en EU_868`,
      };
    },
    field: "config.lora.region",
  },
  {
    title: "Autorisation MQTT",
    check: (value, config) => {
      if (value === true) {
        return {
          status: "success",
          message: "Vous autorisez vos messages à rentrer sur un MQTT",
        };
      }
      return {
        status: "info",
        message: "Vos messages ne rentreront pas sur MQTT",
      };
    },
    field: "config.lora.configOkToMqtt",
  },
  {
    title: "Forward MQTT",
    check: (value, config) => {
      if (value === true) {
        return {
          status: "success",
          message: "Vous transferez les messages venant de MQTT sur le mesh",
        };
      }
      return {
        status: "info",
        message:
          "Les messages MQTT que vous recevrez ne seront pas transférés sur le mesh",
      };
    },
    field: "config.lora.ignoreMqtt",
  },
  ...additionalChecks,
];
