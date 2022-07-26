import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { Button, Card, Paragraph, Title } from "react-native-paper";
import SmartLightDevice from "../model/SmartLightDevice";
import DeviceRepository from '../data/DeviceRepository';
import MainScreen from './MainScreen';

type DevicesViewProps = {
	parent: MainScreen
}

class DevicesView extends React.Component<DevicesViewProps, any> {
	state = {
		devices: new Array<SmartLightDevice>()
	}

	private deviceRepository = new DeviceRepository();
	private styles = StyleSheet.create({
		deviceCard: {
			marginLeft: '2%',
			marginTop: '2%',
			width: '47%'
		}
	});

	async componentDidMount() {
		this.setState({ devices: await this.deviceRepository.getAll() });
	}

	render() {
		console.log(this.state.devices)
		return (
			<View>
				<FlatList
					data={this.state.devices}
					renderItem={({ item }) => this.renderDeviceCard(item)}
					numColumns={2}
					keyExtractor={(item, index) => index.toString()}/>

				<Button onPress={() => this.addDevice()}>Add device</Button>
			</View>
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

	private devNameIndex = 0

	private async addDevice() {
		let names = ['Balerion', 'Meraxes', 'Caraxes', 'Vermithor', 'Dreamfyre']

		await this.deviceRepository.addDevice(
			names[this.devNameIndex],
			device => {
				let devices = this.state.devices;
				devices.push(device);
				this.setState({ devices: devices });
				this.render();
			}
		)

		this.devNameIndex = (this.devNameIndex + 1) % names.length
	}
}

export default DevicesView;
