import { Metadata } from "next";

import { DeviceGateway } from "@/components/device-gateway";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: `بوابة الأجهزة | ${siteConfig.name}`,
  description: "اختيار مسار الجوال أو الكمبيوتر داخل Cyvero.",
};

export default function DeviceGatewayPage() {
  return <DeviceGateway />;
}
