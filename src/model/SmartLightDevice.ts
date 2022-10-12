class SmartLightDevice {
	name: string;
	mac: string;

	constructor(name: string, mac: string) {
		this.name = name;
		this.mac = mac;
	}

	toString() {
		return `${this.name}(${this.mac})`;
	}
}

export default SmartLightDevice;
