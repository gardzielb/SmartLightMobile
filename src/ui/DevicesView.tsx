import React from "react";
import { FlatList, StyleSheet } from "react-native";
import { Button, Card, Modal, Paragraph, Portal, Provider, Title, TextInput } from "react-native-paper";
import SmartLightDevice from "../model/SmartLightDevice";
import DeviceRepository from '../data/DeviceRepository';
import MainScreen from './MainScreen';

type DevicesViewProps = {
	parent: MainScreen
}

type DevicesViewState = {
	devices: Array<SmartLightDevice>,
	addDevice: boolean,
	addDeviceName: string
}

class DevicesView extends React.Component<DevicesViewProps, DevicesViewState> {
	constructor(props: DevicesViewProps) {
		super(props);
		this.state = {
			devices: new Array<SmartLightDevice>(),
			addDevice: false,
			addDeviceName: ''
		};
	}

	private deviceRepository = new DeviceRepository();
	private styles = StyleSheet.create({
		deviceCard: {
			marginLeft: '2%',
			marginTop: '2%',
			width: '47%'
		},
		modal: {
			backgroundColor: 'white',
			padding: 20
		}
	});

	async componentDidMount() {
		console.log('Mounted devices view');
		this.setState({ devices: await this.deviceRepository.getAll() });
	}

	addDeviceUpdateState(device: SmartLightDevice) {
		this.deviceRepository.addDevice(
			device,
			device => {
				let devices = this.state.devices;
				devices.push(device);
				this.setState({ devices: devices });
			}
		).then();
	}

	render() {
		return (
			<Provider>
				<Portal>
					<Modal visible={this.state.addDevice} onDismiss={() => this.showAddDeviceModal(false)}
						   contentContainerStyle={this.styles.modal}>
						<TextInput mode="outlined" label="Device name" value={this.state.addDeviceName}
								   onChangeText={this.updateNewDeviceName}/>
						<Button onPress={this.initDeviceSetup}>Add</Button>
					</Modal>
				</Portal>
				<FlatList
					data={this.state.devices}
					renderItem={({ item }) => this.renderDeviceCard(item)}
					numColumns={2}
					keyExtractor={(item, index) => index.toString()}/>

				<Button onPress={() => this.showAddDeviceModal(true)}>Add device</Button>
			</Provider>
		);
	}

	private renderDeviceCard(device: SmartLightDevice) {
		return (
			<Card mode="outlined" style={this.styles.deviceCard}
				  onLongPress={() => console.log(`${device.name} selected`)}
				  onPress={() => this.props.parent.goToDeviceControlScreen(device)}>

				<Card.Content style={{ alignItems: "center" }}>
					<Title>{device.name}</Title>
					<Paragraph style={{ fontSize: 9 }}>{device.mac}</Paragraph>
				</Card.Content>

			</Card>
		);
	}

	private showAddDeviceModal = (visible: boolean) => {
		this.setState((current) => ({ ...current, addDevice: visible }));
	}

	private initDeviceSetup = () => {
		this.setState((current) => ({ ...current, addDevice: false }));
		this.props.parent.goToDeviceSetupScreen(this.state.addDeviceName);
	}

	private updateNewDeviceName = (name: string) => {
		this.setState((current) => ({
			...current,
			addDeviceName: name
		}));
	}
}

export default DevicesView;
