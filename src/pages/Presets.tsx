import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@app/components/UI/Tabs.tsx";

import { Code } from "@app/components/UI/Typography/Code";
import { H4 } from "@app/components/UI/Typography/H4";
import { Subtle } from "@app/components/UI/Typography/Subtle";
import { Channel } from "@components/PageComponents/Channel.tsx";
import { PageLayout } from "@components/PageLayout.tsx";
import { Sidebar } from "@components/Sidebar.tsx";
import { useDevice } from "@core/stores/deviceStore.ts";
import { Types } from "@meshtastic/js";
import type { Protobuf } from "@meshtastic/js";
import { ImportIcon, QrCodeIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { H5 } from "@app/components/UI/Typography/H5";
import { Button } from "@app/components/UI/Button";
import { CatalogItem } from "@app/components/PageComponents/Catalogs/CatalogItem";
import type { CatalogDefinition } from "meshtastic-catalogs/dist/types";
import { getCatalogList, getCatalog } from "meshtastic-catalogs";

const LabelForStatus = {
  '1': 'Restarting',
  '2': 'Disconnected',
  '3': 'Connecting',
  '4': 'Reconnecting',
  '5': 'Connected',
  '6': 'Configuring',
  '7': 'Configured'
}
export const PresetsPage = (): JSX.Element => {
  const d = useDevice();
  const { channels, setDialogOpen, workingConfig, workingModuleConfig, connection, config, status, id, metadata, moduleConfig } = useDevice();
  const allChannels = Array.from(channels.values());

  const [selectedCatalog, setSelectedCatalog] = useState<string>();
  const [activeChanges, setActiveChanges] = useState({});

  useEffect(() => {

    if (selectedCatalog) {
      const catalog = getCatalog(selectedCatalog ?? '');

      const currentconfig: CatalogDefinition = {
        id: 'current',
        config: config,
        moduleConfig: moduleConfig,
        channels: allChannels,
      }

      setActiveChanges();
    }

    return () => { }
  }, [selectedCatalog, config, moduleConfig, allChannels])


    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    (window['d' as any] as any) = d;

  return (
    <>
      <Sidebar />
      <PageLayout
        label={`${id}: ${connection?.connType} - ${LabelForStatus[status]}`}
        actions={[
          {
            icon: ImportIcon,
            onClick() {
              setDialogOpen("import", true);
            },
          },
          {
            icon: QrCodeIcon,
            onClick() {
              setDialogOpen("QR", true);
            },
          },
        ]}
      >
        <Tabs defaultValue="currentconfig">
          <TabsList>
            <TabsTrigger key='currentconfig' value={'currentconfig'}>
              Current
            </TabsTrigger>
          </TabsList>
          <TabsContent key={'currentconfig'} value={'currentconfig'.toString()}>

            <div>
              <H4 className="font-medium">Catalogs</H4>
            </div>
            <div className="flex flex-row gap-4">
              {getCatalogList().map((catalog: CatalogDefinition) => (<CatalogItem onClick={setSelectedCatalog} key={catalog.metadata.name} catalog={catalog} />))}
            </div>

            <div>
              <H4 className="font-medium">{'config'}</H4>
              {/* <Subtle>{}</Subtle> */}
            </div>
            <div>
              <pre>
                <Code>{JSON.stringify(config, null, 2)}</Code>
              </pre>
            </div>

            <div>
              <H4 className="font-medium">{'moduleConfig'}</H4>
              {/* <Subtle>{}</Subtle> */}
            </div>
            <div>
              <pre>
                <Code>{JSON.stringify(moduleConfig, null, 2)}</Code>
              </pre>
            </div>

            <div>
              <H4 className="font-medium">{'workingConfig'}</H4>
              {/* <Subtle>{}</Subtle> */}
            </div>
            <div>

              <pre>
                <Code>{JSON.stringify(workingConfig, null, 2)}</Code>
              </pre>
            </div>

            <div>
              <H4 className="font-medium">{'workingModuleConfig'}</H4>
              {/* <Subtle>{}</Subtle> */}
            </div>
            <div>

              <pre>
                <Code>{JSON.stringify(workingModuleConfig, null, 2)}</Code>
              </pre>
            </div>

            <div>
              <H4 className="font-medium">{'allChannels'}</H4>
              {/* <Subtle>{}</Subtle> */}
            </div>
            <div>

              <pre>
                <Code>{JSON.stringify(allChannels, null, 2)}</Code>
              </pre>
            </div>

            <div>
              <H4 className="font-medium">{'metadata'}</H4>
              {/* <Subtle>{}</Subtle> */}
            </div>
            <div>

              <pre>
                <Code>{JSON.stringify(metadata, null, 2)}</Code>
              </pre>
            </div>
          </TabsContent>
        </Tabs>
      </PageLayout>
    </>
  );
};
