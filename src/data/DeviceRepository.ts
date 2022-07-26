import 'react-native-get-random-values';
import Realm, { Object } from 'realm';
import SmartLightDevice from '../model/SmartLightDevice';

const { ObjectId } = Realm.BSON;
const DeviceSchema = {
	name: 'Device',
	properties: {
		_id: 'objectId',
		name: 'string'
	},
	primaryKey: '_id'
};

export default class DeviceRepository {
	async addDevice(deviceName: string, callback: (device: SmartLightDevice) => void) {
		let realm = await this.openRealm();
		realm.write(() => {
			let deviceEntity = realm.create(
				'Device',
				{
					_id: new ObjectId(),
					name: deviceName
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

	private async openRealm() {
		return Realm.open({
			path: 'smart-light-realm',
			schema: [DeviceSchema]
		});
	}

	private processEntity(deviceEntity: Object) {
		let devProps = deviceEntity.entries();
		let devName = devProps.filter(prop => prop[0] == 'name').map(prop => prop[1])[0];
		let devId = devProps.filter(prop => prop[0] == '_id').map(prop => prop[1])[0]
		return new SmartLightDevice(devId.toString(), devName);
	}
}
