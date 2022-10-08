import { SmartLightState } from './SmartLightState';
import MQTT, { IMqttClient } from 'sp-react-native-mqtt';
import uuid from 'react-native-uuid';
import { MQTT_BROKER_URL, MQTT_USER, MQTT_PASSWD } from '@env';

export default class DeviceController {
	private mqttClient: IMqttClient | undefined

	private constructor() {
		MQTT.createClient({
			uri: MQTT_BROKER_URL,
			clientId: uuid.v4().toString(),
			user: MQTT_USER,
			pass: MQTT_PASSWD,
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
