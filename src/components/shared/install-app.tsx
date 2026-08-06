"use client";

import { usePwaInstall } from "@/hooks/use-pwa-install";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Smartphone, Share, X } from "lucide-react";
import { useState } from "react";

function IosInstructions() {
  return (
    <div className="flex flex-col gap-3 text-sm text-muted-foreground">
      <p>Install BachatZone on your home screen for the full app experience.</p>
      <ol className="list-decimal space-y-2 pl-5">
        <li>Tap the <span className="inline-flex items-center gap-1 font-medium text-foreground"><Share className="h-3.5 w-3.5" /> Share</span> button in Safari.</li>
        <li>Scroll down and tap <span className="font-medium text-foreground">Add to Home Screen</span>.</li>
        <li>Tap <span className="font-medium text-foreground">Add</span>.</li>
      </ol>
    </div>
  );
}

export function InstallAppMenuItem() {
  const { canInstall, isIos, promptInstall } = usePwaInstall();
  const [showIos, setShowIos] = useState(false);

  if (!canInstall) return null;

  const onSelect = async () => {
    const prompted = await promptInstall();
    if (!prompted && isIos) setShowIos(true);
  };

  return (
    <>
      <DropdownMenuItem onSelect={onSelect}>
        <Smartphone className="h-4 w-4" />
        Install app
      </DropdownMenuItem>
      <Dialog open={showIos} onOpenChange={setShowIos}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Install BachatZone</DialogTitle>
            <DialogDescription>
              Add BachatZone to your home screen to use it like a native app.
            </DialogDescription>
          </DialogHeader>
          <IosInstructions />
          <DialogFooter>
            <Button onClick={() => setShowIos(false)}>Got it</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function InstallAppBanner() {
  const { canInstall, isIos, promptInstall, dismiss } = usePwaInstall();
  const [showIos, setShowIos] = useState(false);

  if (!canInstall) return null;

  const onInstall = async () => {
    const prompted = await promptInstall();
    if (!prompted && isIos) setShowIos(true);
  };

  return (
    <>
      <div className="flex items-center gap-3 rounded-2xl border border-primary/20 bg-primary-soft p-3">
        <span className="mesh-brand flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white">
          <Smartphone className="h-4 w-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[0.8rem] font-semibold">Install the app</p>
          <p className="truncate text-xs text-muted-foreground">
            Add BachatZone to your home screen for one-tap access.
          </p>
        </div>
        <Button size="sm" onClick={onInstall}>
          Install
        </Button>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss install prompt"
          className="shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <Dialog open={showIos} onOpenChange={setShowIos}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Install BachatZone</DialogTitle>
            <DialogDescription>
              Add BachatZone to your home screen to use it like a native app.
            </DialogDescription>
          </DialogHeader>
          <IosInstructions />
          <DialogFooter>
            <Button onClick={() => setShowIos(false)}>Got it</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
