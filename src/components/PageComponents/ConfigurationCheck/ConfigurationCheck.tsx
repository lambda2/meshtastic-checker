import { Button } from "@app/components/UI/Button";
import { Code } from "@app/components/UI/Typography/Code";
import { H5 } from "@app/components/UI/Typography/H5";
import { Subtle } from "@app/components/UI/Typography/Subtle";
// biome-ignore lint/style/useImportType: <explanation>
import { Protobuf } from "@meshtastic/js";
import { FaRegCircleCheck } from "react-icons/fa6";
import {
  PiInfoDuotone,
  PiSealQuestionDuotone,
  PiWarningDuotone,
} from "react-icons/pi";

export interface ConfigState {
  config?: Partial<Protobuf.LocalOnly.LocalConfig>;
  moduleConfig?: Partial<Protobuf.LocalOnly.LocalModuleConfig>;
  channel_0?: Partial<Protobuf.Channel.Channel>;
  channel_1?: Partial<Protobuf.Channel.Channel>;
  channel_2?: Partial<Protobuf.Channel.Channel>;
}

export interface CheckOutput {
  status: "success" | "warn" | "error" | "info";
  message?: string;
}

export interface CheckResult extends CheckOutput {
  title: string;
  field: string;
  value: string;
}

export interface CheckItem {
  title: string;
  field: string;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  check: (value: any, config: ConfigState) => CheckOutput;
}

export interface ConfigurationCheckProps {
  config: ConfigState;
  onClick?: (catalogId: string) => void;
}

export const ConfigurationCheckResult = ({
  title,
  field,
  value,
  status,
  message,
}: CheckResult): JSX.Element => {
  const colors = {
    success: "text-green-600",
    warn: "text-orange-600",
    error: "text-red-600",
    info: "text-blue-600",
  };
  const results = {
    success: <FaRegCircleCheck />,
    error: <PiWarningDuotone />,
    warn: <PiSealQuestionDuotone />,
    info: <PiInfoDuotone />,
  };

  const color = colors[status];
  const result = results[status];

  return (
    <div className="">
      <div className="py-1 gap-1 flex flex-row">
        <div className="flex gap-1 flex-column justify-center align-center items-baseline">
          <H5
            className={`text-md ${color} flex gap-1 flex-column justify-center align-center items-baseline`}
          >
            {result} {title}
          </H5>
          <Subtle>{message}</Subtle>
          {/* <Code>{field} = {value}</Code> */}
        </div>
      </div>
    </div>
  );
};
