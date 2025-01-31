import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@app/components/UI/Tabs.tsx";

import { CatalogItem } from "@app/components/PageComponents/Catalogs/CatalogItem";
import {
  type CheckResult,
  ConfigurationCheckResult,
} from "@app/components/PageComponents/ConfigurationCheck/ConfigurationCheck";
import { Button } from "@app/components/UI/Button";
import { Code } from "@app/components/UI/Typography/Code";
import { H3 } from "@app/components/UI/Typography/H3";
import { H4 } from "@app/components/UI/Typography/H4";
import { H5 } from "@app/components/UI/Typography/H5";
import { Subtle } from "@app/components/UI/Typography/Subtle";
import { computeChecks } from "@app/core/checks/checks";
import { useAppStore } from "@app/core/stores/appStore";
import { Channel } from "@components/PageComponents/Channel.tsx";
import { PageLayout } from "@components/PageLayout.tsx";
import { Sidebar } from "@components/Sidebar.tsx";
import { useDevice } from "@core/stores/deviceStore.ts";
import { Types } from "@meshtastic/js";
import type { Protobuf } from "@meshtastic/js";
import {
  BatteryMediumIcon,
  CpuIcon,
  ImportIcon,
  QrCodeIcon,
  ZapIcon,
} from "lucide-react";
import { diffCatalog, getCatalog, getCatalogList } from "meshtastic-catalogs";
import type { CatalogDefinition } from "meshtastic-catalogs/dist/types";
import { useEffect, useState } from "react";
import { FaArrowsRotate } from "react-icons/fa6";

const LabelForStatus = {
  "1": "Restarting",
  "2": "Disconnected",
  "3": "Connecting",
  "4": "Reconnecting",
  "5": "Connected",
  "6": "Configuring",
  "7": "Configured",
};
export const PresetsPage = (): JSX.Element => {
  const {
    channels,
    hardware,
    nodes,
    setDialogOpen,
    workingConfig,
    workingModuleConfig,
    connection,
    config,
    status,
    id,
    metadata,
    moduleConfig,
  } = useDevice();
  const { removeDevice } = useAppStore();
  const allChannels = Array.from(channels.values());

  const [checks, setChecks] = useState<{ [key: string]: CheckResult[] }>({});
  const [showAll, setShowAll] = useState(false);

  const myNode = nodes.get(hardware.myNodeNum);
  const myMetadata = metadata.get(0);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    loadCheck();
    return () => {};
  }, [status, config, moduleConfig]);

  const loadCheck = () => {
    const currentconfig = {
      config: { ...config },
      moduleConfig: { ...moduleConfig },
      // channels: { ...allChannels },
      channel_0: allChannels.find((c) => c.index === 0),
      channel_1: allChannels.find((c) => c.index === 1),
      channel_2: allChannels.find((c) => c.index === 2),
    };

    setChecks(computeChecks(currentconfig || {}));

    console.log(currentconfig);
  };

  const onDisconnect = () => {
    connection?.disconnect();
    removeDevice(id);
    if (window) {
      window.location.reload();
    }
  };

  return (
    <>
      <PageLayout
        label={
          <div className="flex gap-3 flex-column justify-center content-center align-center items-baseline">
            <div className="flex gap-1 flex-column justify-center align-center items-center">
              <BatteryMediumIcon size={24} viewBox={"0 0 28 24"} />
              <Subtle>
                {myNode?.deviceMetrics?.batteryLevel
                  ? myNode?.deviceMetrics?.batteryLevel > 100
                    ? "Charging"
                    : myNode?.deviceMetrics?.batteryLevel + "%"
                  : "UNK"}
              </Subtle>
            </div>
            <div className="flex gap-1 flex-column justify-center align-center items-center">
              <ZapIcon size={24} viewBox={"0 0 36 24"} />
              <Subtle>
                {myNode?.deviceMetrics?.voltage?.toPrecision(3) ?? "UNK"} volts
              </Subtle>
            </div>
            <div className="flex gap-1 flex-column justify-center align-center items-center">
              <CpuIcon size={24} viewBox={"0 0 36 24"} />
              <Subtle>v{myMetadata?.firmwareVersion ?? "UNK"}</Subtle>
            </div>
            <div className="flex gap-1 flex-column justify-center align-center items-center">
              <FaArrowsRotate />
              <Subtle>
                {id}: {connection?.connType} - {LabelForStatus[status]}
              </Subtle>
            </div>
          </div>
        }
      >
        <div className="max-w-4xl object-top mx-auto">
          <div className="pt-4 pb-2">
            <H3>Validateur de configuration Meshtastic</H3>
            <Subtle>Sur la configuration Gaulix 868MHz</Subtle>
          </div>

          <div className="flex gap-2 py-2 pt-4 flex-column justify-start align-center items-center">
            <Button
              variant={"outline"}
              color="white"
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? "Masquer les valides" : "Afficher tout"}
            </Button>
            <Button variant={"outline"} onClick={() => loadCheck()}>
              Revérifier
            </Button>
            <Button variant={"destructive"} onClick={() => onDisconnect()}>
              Déconnecter
            </Button>
          </div>

          {status === 7 ? (
            Object.keys(checks).map((k) => {
              const items = checks[k] as CheckResult[];

              return (
                <div key={k}>
                  <div className="mt-2 bg-white rounded-md border border-slate-200 p-6 dark:border-slate-700">
                    <H4 className="font-medium pb-2">{k}</H4>

                    {items.filter((e) => e.status !== "success").length ===
                      0 && <Subtle>Tout est bon 🎉</Subtle>}
                    {items.map((c) => {
                      if (showAll || c.status !== "success") {
                        return (
                          <ConfigurationCheckResult key={c.title} {...c} />
                        );
                      }
                    })}
                  </div>
                </div>
              );
            })
          ) : (
            <Subtle>Chargement...</Subtle>
          )}
        </div>
      </PageLayout>
    </>
  );
};
