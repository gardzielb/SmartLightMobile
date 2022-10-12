import SmartLightDevice from './model/SmartLightDevice';
import { SmartLightConfig } from './model/SmartLightConfig';

export type RootStackParams = {
	Main: { addedDevice: SmartLightDevice } | undefined,
	DeviceControl: { device: SmartLightDevice },
	DeviceConfig: undefined,
	MacScanner: SmartLightConfig
}
