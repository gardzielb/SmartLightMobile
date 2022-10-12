import BleManager from 'react-native-ble-manager';
import { NativeEventEmitter, NativeModules, Platform } from 'react-native';
import { SmartLightConfig } from '../model/SmartLightConfig';
// @ts-ignore
import { convertString, stringToBytes } from 'convert-string';
// @ts-ignore
import { MQTT_BROKER_URL, MQTT_USER_DEVICE, MQTT_PASSWD_DEVICE } from '@env';

function sleep(ms: number) {
	return new Promise((resolve) => {
		// @ts-ignore
		setTimeout(resolve, ms);
	});
}

// TODO: error handling

const CORE_SETUP_SERVICE = 'b8e70000-88ed-4923-b7de-8df7ef31860d';
const WIFI_SSID_CHARACTERISTIC = 'b8e70001-88ed-4923-b7de-8df7ef31860d';
const WIFI_PASSWD_CHARACTERISTIC = 'b8e70003-88ed-4923-b7de-8df7ef31860d';
const WORK_MODE_CHARACTERISTIC = 'b8e70005-88ed-4923-b7de-8df7ef31860d';
const SETUP_CP_CHARACTERISTIC = 'b8e70007-88ed-4923-b7de-8df7ef31860d';

const MQTT_SETUP_SERVICE = '10590000-6481-4786-beb7-691d20f9ef77';
const MQTT_USER_CHARACTERISTIC = '10590001-6481-4786-beb7-691d20f9ef77';
const MQTT_PASSWD_CHARACTERISTIC = '10590003-6481-4786-beb7-691d20f9ef77';
const MQTT_BROKER_IP_CHARACTERISTIC = '10590005-6481-4786-beb7-691d20f9ef77';
const MQTT_BROKER_PORT_CHARACTERISTIC = '10590007-6481-4786-beb7-691d20f9ef77';
const MQTT_NAME_CHARACTERISTIC = '10590009-6481-4786-beb7-691d20f9ef77';

enum SetupCP {
	IN_PROGRESS,
	READY,
	WIFI_CONNECTING,
	WIFI_CONNECTED,
	DONE
}

export default class BleSetupController {
	private bleManagerEmitter = new NativeEventEmitter(NativeModules.BleManager);
	private readonly callback: () => void;
	private cpVal = SetupCP.IN_PROGRESS;

	constructor(callback: () => void) {
		this.callback = callback;
	}

	public setupDevice(deviceMac: string, config: SmartLightConfig) {
		BleManager
			.start({ showAlert: false })
			.then(() => {
				if (Platform.OS === 'android' && Platform.Version >= 23) {
					BleManager
						.enableBluetooth()
						.then(() => {
							console.log('BLE enabled');
							this.startBleCommunication(deviceMac, config);
						});
				}
				else {
					this.startBleCommunication(deviceMac, config);
				}
			});
	}

	private startBleCommunication(deviceMac: string, config: SmartLightConfig) {
		BleManager
			.connect(deviceMac)
			.then(() => {
				BleManager
					.getConnectedPeripherals([])
					.then(connectedDevices => {
						if (connectedDevices.length == 1) {
							this.performDeviceSetup(connectedDevices[0].id, config);
						}
						else {
							throw Error('Device not connected');
						}
					});
			});
	}

	private performDeviceSetup(deviceId: string, config: SmartLightConfig) {
		BleManager
			.retrieveServices(deviceId)
			.then(services => {
				this.bleManagerEmitter.addListener(
					'BleManagerDidUpdateValueForCharacteristic',
					({ value, peripheral, characteristic, service }) => {
						console.log(`Received ${value} for characteristic ${characteristic}`);
						this.cpVal = Number(value);
					}
				);

				BleManager
					.startNotification(deviceId, CORE_SETUP_SERVICE, SETUP_CP_CHARACTERISTIC)
					.then(() => this.writeDeviceConfig(deviceId, config));
			});
	}

	private async writeDeviceConfig(deviceId: string, config: SmartLightConfig) {
		await this.writeCoreConfig(deviceId, config);
		await this.waitForWifiConnection();
		await this.writeMqttConfig(deviceId, config.deviceName);
		this.callback();
	}

	private async waitForWifiConnection() {
		while (this.cpVal !== SetupCP.WIFI_CONNECTED) {
			await sleep(1000);
		}
	}

	private async writeCoreConfig(deviceId: string, config: SmartLightConfig): Promise<boolean> {
		try {
			await BleManager.write(
				deviceId, CORE_SETUP_SERVICE, WIFI_SSID_CHARACTERISTIC, stringToBytes(config.wifiSSID)
			);
			console.log('Written WiFi SSID');

			await BleManager.write(
				deviceId, CORE_SETUP_SERVICE, WIFI_PASSWD_CHARACTERISTIC, stringToBytes(config.wifiPassword)
			);
			console.log('Written WiFi password');

			await BleManager.write(deviceId, CORE_SETUP_SERVICE, WORK_MODE_CHARACTERISTIC, [0]);
			console.log('Written work mode');

			this.cpVal = SetupCP.READY;
			await BleManager.write(deviceId, CORE_SETUP_SERVICE, SETUP_CP_CHARACTERISTIC, [SetupCP.READY]);
		}
		catch (error) {
			console.error(`Failed to write core config data: ${error}`);
			return false;
		}

		return true;
	}

	private async writeMqttConfig(deviceId: string, deviceName: string): Promise<boolean> {
		try {
			await BleManager.write(deviceId, MQTT_SETUP_SERVICE, MQTT_USER_CHARACTERISTIC, stringToBytes(MQTT_USER_DEVICE));
			await BleManager.write(
				deviceId, MQTT_SETUP_SERVICE, MQTT_PASSWD_CHARACTERISTIC, stringToBytes(MQTT_PASSWD_DEVICE)
			);

			let brokerIp = MQTT_BROKER_URL.split('://')[1].split(':')[0];
			await BleManager.write(deviceId, MQTT_SETUP_SERVICE, MQTT_BROKER_IP_CHARACTERISTIC, stringToBytes(brokerIp));
			console.log('Written MQTT broker IP');

			// await BleManager.write(deviceId, MQTT_SETUP_SERVICE, MQTT_BROKER_PORT_CHARACTERISTIC, [Number(brokerUrl[1])]);

			await BleManager.write(
				deviceId, MQTT_SETUP_SERVICE, MQTT_NAME_CHARACTERISTIC, stringToBytes(deviceName.toLowerCase())
			);
			console.log('Written MQTT device name');

			this.cpVal = SetupCP.DONE;
			await BleManager.write(deviceId, CORE_SETUP_SERVICE, SETUP_CP_CHARACTERISTIC, [SetupCP.DONE]);
		}
		catch (error) {
			console.error(error);
			return false;
		}

		return true;
	}
}
