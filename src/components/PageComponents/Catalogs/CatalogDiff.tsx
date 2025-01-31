import { Button } from "@app/components/UI/Button";
import { H5 } from "@app/components/UI/Typography/H5";
import type { CatalogDefinition } from "meshtastic-catalogs";

export interface CatalogItemProps {
  catalog: CatalogDefinition;
  onClick?: (catalogId: string) => void;
}

export const CatalogItem = ({
  catalog,
  onClick,
}: CatalogItemProps): JSX.Element => {
  return (
    <div
      key={catalog.metadata.name}
      className="rounded-md p-2 bg-gray-50 gap-2 flex flex-col"
    >
      <div className="p-2 gap-2 flex flex-row">
        <div className="">
          <img
            src={catalog.metadata?.logo}
            className="object-scale-down h-24 w-24 "
            alt="logo"
            style={{ maxWidth: "100px" }}
          />
        </div>
        <div className="">
          <H5>{catalog.metadata.name}</H5>
          <p>{catalog.metadata?.description}</p>
        </div>
      </div>
      <div className="w-full flex-1">
        <Button
          onClick={() => (onClick ? onClick(catalog.id) : null)}
          className="w-full flex-1"
        >
          Compare
        </Button>
      </div>
    </div>
  );
};
