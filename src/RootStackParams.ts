import SmartLightDevice from './model/SmartLightDevice';

export type RootStackParams = {
	Main: undefined,
	DeviceSetup: undefined,
	DeviceControl: { device: SmartLightDevice }
}
