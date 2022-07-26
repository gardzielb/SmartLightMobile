import SmartLightDevice from './model/SmartLightDevice';

export type RootStackParams = {
	Main: undefined,
	DeviceControl: { device: SmartLightDevice }
}
