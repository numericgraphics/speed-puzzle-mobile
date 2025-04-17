import * as Device from "expo-device";

export const isTablet = () => {
  return Device.deviceType === Device.DeviceType.TABLET || false;
};
