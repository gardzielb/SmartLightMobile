import { SmartLightState } from './SmartLightState';
import MQTT, { IMqttClient } from 'sp-react-native-mqtt';
import uuid from 'react-native-uuid';

export default class DeviceController {
	private mqttClient: IMqttClient | undefined

	constructor() {
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

	public applyState(targetState: SmartLightState) {
		console.log(targetState);
		this.mqttClient?.publish('/smart_light/deana', JSON.stringify(targetState), 0, false);
	}
}
