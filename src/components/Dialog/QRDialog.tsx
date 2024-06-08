import { Field } from "@bufbuild/protobuf";
import { Checkbox } from "@components/UI/Checkbox.js";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@components/UI/Dialog.js";
import { Input } from "@components/UI/Input.js";
import { Label } from "@components/UI/Label.js";
import { Protobuf, Types } from "@meshtastic/js";
import { fromByteArray } from "base64-js";
import { ClipboardIcon, PlusIcon, ReplaceIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { QRCode } from "react-qrcode-logo";
import { DynamicForm } from "../Form/DynamicForm";
import { ToggleFieldProps, ToggleInput } from "../Form/FormToggle";
import { Button } from "../UI/Button";
import { Switch } from "@components/UI/Switch.js";
import { Controller, useForm, useWatch } from "react-hook-form";

export interface QRDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  loraConfig?: Protobuf.Config.Config_LoRaConfig;
  channels: Map<Types.ChannelNumber, Protobuf.Channel.Channel>;
}

export const QRDialog = ({
  open,
  onOpenChange,
  loraConfig,
  channels,
}: QRDialogProps): JSX.Element => {
  const [selectedChannels, setSelectedChannels] = useState<number[]>([0]);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [qrCodeAdd, setQrCodeAdd] = useState<boolean>();

  const allChannels = Array.from(channels.values());

  useEffect(() => {
    const channelsToEncode = allChannels
      .filter((ch) => selectedChannels.includes(ch.index))
      .map((channel) => channel.settings)
      .filter((ch): ch is Protobuf.Channel.ChannelSettings => !!ch);
    const encoded = new Protobuf.AppOnly.ChannelSet(
      new Protobuf.AppOnly.ChannelSet({
        loraConfig,
        settings: channelsToEncode,
      }),
    );
    const base64 = fromByteArray(encoded.toBinary())
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");

    console.log("here ran");
    setQrCodeUrl(`https://meshtastic.org/e/#${base64}${qrCodeAdd ? "?add=true" : ""}`);
  }, [channels, selectedChannels, qrCodeAdd, loraConfig]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generate QR Code</DialogTitle>
          <DialogDescription>
            The current LoRa configuration will also be shared.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex gap-3 px-4 py-5 sm:p-6">
            <div className="flex w-40 flex-col gap-2">
              {allChannels.map((channel) => (
                <div className="flex justify-between" key={channel.index}>
                  <Label>
                    {channel.settings?.name.length
                      ? channel.settings.name
                      : channel.role === Protobuf.Channel.Channel_Role.PRIMARY
                        ? "Primary"
                        : `Channel: ${channel.index}`}
                  </Label>
                  <Checkbox
                    key={channel.index}
                    checked={selectedChannels.includes(channel.index)}
                    onCheckedChange={() => {
                      if (selectedChannels.includes(channel.index)) {
                        setSelectedChannels(
                          selectedChannels.filter((c) => c !== channel.index),
                        );
                      } else {
                        setSelectedChannels([
                          ...selectedChannels,
                          channel.index,
                        ]);
                      }
                    }}
                  />
                </div>
              ))}
            </div>
            <QRCode value={qrCodeUrl} size={200} qrStyle="dots" />
          </div>
          <div className="flex justify-center">
            <button
              type="button" 
              className={ qrCodeAdd ? "border-black border-t border-l border-b rounded-l px-7 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-green-800 focus:ring-offset-2 dark:hover:bg-green-800 dark:hover:text-slate-100 disabled:opacity-50 dark:focus:ring-slate-400 disabled:pointer-events-none dark:focus:ring-offset-green-800 data-[state=open]:bg-slate-100 dark:data-[state=open]:bg-green-800 bg-green-800 text-white hover:bg-green-800 dark:bg-slate-50 dark:text-green-800 h-10 py-2 px-4" : "border-black border-t border-l border-b rounded-l px-7 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 dark:hover:bg-slate-400 dark:hover:text-slate-100 disabled:opacity-50 dark:focus:ring-slate-400 disabled:pointer-events-none dark:focus:ring-offset-slate-400 data-[state=open]:bg-slate-100 dark:data-[state=open]:bg-slate-400 bg-slate-400 text-white hover:bg-green-600 dark:bg-slate-50 dark:text-slate-400 h-10 py-2 px-4" }
              onClick={() => setQrCodeAdd(true)}
              >
                Add Channels
            </button>
            <button
              type="button" 
              className={ !qrCodeAdd ? "border-black border-t border-r border-b rounded-r text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-green-800 focus:ring-offset-2 dark:hover:bg-green-800 dark:hover:text-slate-100 disabled:opacity-50 dark:focus:ring-slate-400 disabled:pointer-events-none dark:focus:ring-offset-green-800 data-[state=open]:bg-slate-100 dark:data-[state=open]:bg-green-800 bg-green-800 text-white hover:bg-green-800 dark:bg-slate-50 dark:text-green-800 h-10 py-2 px-4" : "border-black border-t border-r border-b rounded-r text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 dark:hover:bg-slate-400 dark:hover:text-slate-100 disabled:opacity-50 dark:focus:ring-slate-400 disabled:pointer-events-none dark:focus:ring-offset-slate-400 data-[state=open]:bg-slate-100 dark:data-[state=open]:bg-slate-400 bg-slate-400 text-white hover:bg-green-600 dark:bg-slate-50 dark:text-slate-400 h-10 py-2 px-4" }
              onClick={() => setQrCodeAdd(false)}
              >
                Replace Channels
            </button>
          </div>
        </div>
        <DialogFooter>
          <Label>Sharable URL</Label>
          <Input
            value={qrCodeUrl}
            disabled={true}
            action={{
              icon: ClipboardIcon,
              onClick() {
                void navigator.clipboard.writeText(qrCodeUrl);
              },
            }}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
