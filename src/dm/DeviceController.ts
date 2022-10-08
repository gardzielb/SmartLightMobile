import { SmartLightState } from './SmartLightState';
import MQTT, { IMqttClient } from 'sp-react-native-mqtt';
import uuid from 'react-native-uuid';

export default class DeviceController {
	private mqttClient: IMqttClient | undefined

	private constructor() {
		MQTT.createClient({
			uri: 'mqtt://192.168.1.105:1883',
			clientId: uuid.v4().toString(),
			user: 'bartosz',
			pass: 'dupa123',
			auth: true
		}).then(client => {
			client.on('connect', () => {
				console.log('MQTT client connected');
				this.mqttClient = client;
			});

			client.on('error', error => {
				console.log(`MQTT error: ${error}`);
				client.connect();
			});

			client.connect();
		});
	}

	public applyState(deviceName: string, targetState: SmartLightState) {
		console.log(targetState);
		let topic = `/smart_light/${deviceName.toLowerCase().replace(' ', '-')}`;
		this.mqttClient?.publish(topic, JSON.stringify(targetState), 0, false);
	}

	private static instance: DeviceController | null = null

	public static get() {
		if (this.instance === null) {
			this.instance = new DeviceController();
		}
		return this.instance;
	}
}
