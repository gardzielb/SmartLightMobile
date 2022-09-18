import SmartLightDevice from './model/SmartLightDevice';

export type RootStackParams = {
	Main: { addedDevice: SmartLightDevice } | undefined,
	DeviceSetup: { deviceName: string },
	DeviceControl: { device: SmartLightDevice }
}
