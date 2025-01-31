import { useDevice } from "@core/stores/deviceStore.ts";
import { PresetsPage } from "./pages/Presets";

export const PageRouter = (): JSX.Element => {
  const { activePage } = useDevice();
  return <>{activePage === "presets" && <PresetsPage />}</>;
};
