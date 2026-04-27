"use client";

import { useEffect } from "react";

import { DEVICE_PREFERENCE_KEY } from "@/lib/prototype";
import { DevicePreference } from "@/types/cyber";

type DevicePreferenceSyncProps = {
  device: DevicePreference;
};

export function DevicePreferenceSync({ device }: DevicePreferenceSyncProps) {
  useEffect(() => {
    window.localStorage.setItem(DEVICE_PREFERENCE_KEY, device);
  }, [device]);

  return null;
}
