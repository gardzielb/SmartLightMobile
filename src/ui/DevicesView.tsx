import React from "react";
import { FlatList, StyleSheet, TextInput } from "react-native";
import { Button, Card, Modal, Paragraph, Portal, Provider, Text, Title } from "react-native-paper";
import SmartLightDevice from "../model/SmartLightDevice";
import DeviceRepository from '../data/DeviceRepository';
import MainScreen from './MainScreen';

type DevicesViewProps = {
	parent: MainScreen
}

type DevicesViewState = {
	devices: Array<SmartLightDevice>,
	addDevice: boolean
}

class DevicesView extends React.Component<DevicesViewProps, DevicesViewState> {
	constructor(props: DevicesViewProps) {
		super(props);
		this.state = {
			devices: new Array<SmartLightDevice>(),
			addDevice: false
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
		this.setState({ devices: await this.deviceRepository.getAll() });
	}

	render() {
		console.log(this.state.devices)
		return (
			<Provider>
				<Portal>
					<Modal visible={this.state.addDevice} onDismiss={() => this.showAddDeviceModal(false)}
						   contentContainerStyle={this.styles.modal}>
						<Text>Device name</Text>
						<TextInput/>
						<Button onPress={this.addDevice}>Add</Button>
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

	private renderDeviceCard(item: SmartLightDevice) {
		return (
			<Card mode="outlined" style={this.styles.deviceCard}
				  onLongPress={() => console.log(`${item.name} selected`)}
				  onPress={() => this.props.parent.goToDeviceControlScreen(item)}>

				<Card.Content style={{ alignItems: "center" }}>
					<Title>{item.name}</Title>
					<Paragraph style={{ fontSize: 9 }}>{item.id}</Paragraph>
				</Card.Content>

			</Card>
		);
	}

	private showAddDeviceModal = (visible: boolean) => {
		this.setState((current) => ({ ...current, addDevice: visible }));
	}

	private addDevice = () => {
		this.setState((current) => ({ ...current, addDevice: false }));
		this.props.parent.goToDeviceSetupScreen();
	}
}

export default DevicesView;
