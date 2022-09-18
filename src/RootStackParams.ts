import SmartLightDevice from './model/SmartLightDevice';

export type RootStackParams = {
	Main: { newDeviceName: string } | undefined,
	DeviceSetup: undefined,
	DeviceControl: { device: SmartLightDevice }
}
