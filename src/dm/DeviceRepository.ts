import 'react-native-get-random-values';
import Realm, { Object } from 'realm';
import SmartLightDevice from '../model/SmartLightDevice';

const DeviceSchema = {
	name: 'Device',
	properties: {
		name: 'string',
		mac: 'string'
	},
	primaryKey: 'mac'
};

export default class DeviceRepository {
	async addDevice(device: SmartLightDevice, callback: (device: SmartLightDevice) => void) {
		let realm = await this.openRealm();
		realm.write(() => {
			let deviceEntity = realm.create(
				'Device',
				{
					// _id: new ObjectId(),
					... device
				}
			);
			callback(this.processEntity(deviceEntity));
		});
		realm.close();
	}

	async getAll() {
		let realm = await this.openRealm();
		let devices = realm.objects('Device').map((dev) => this.processEntity(dev));

		realm.close();
		return devices;
	}

	async removeDevice(device: SmartLightDevice) {
		let realm = await this.openRealm();
		let deviceEntity = realm.objectForPrimaryKey('Device', device.mac);
		realm.write(() => realm.delete(deviceEntity));
		realm.close();
	}

	private async openRealm() {
		return Realm.open({
			path: 'smart-light-realm',
			schema: [DeviceSchema]
		});
	}

	private processEntity(deviceEntity: Object) {
		let devProps = deviceEntity.entries();
		let devName = devProps.filter(prop => prop[0] == 'name').map(prop => prop[1])[0];
		let devMac = devProps.filter(prop => prop[0] == 'mac').map(prop => prop[1])[0];
		return new SmartLightDevice(devName, devMac);
	}
}
