import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Switch, Text, Button, Card, Modal, Paragraph, Portal, Provider, Title } from 'react-native-paper';
import SmartLightDevice from '../model/SmartLightDevice';
import DeviceRepository from '../dm/DeviceRepository';
import MainScreen from './MainScreen';
import DeviceController from '../dm/DeviceController';
import { SLStyle } from './styles';

type DevicesViewProps = {
	parent: MainScreen
}

type DevicesViewState = {
	devices: Array<SmartLightDevice>,
	removeDevice: SmartLightDevice | undefined,
	removeResetConfig: boolean
}

class DevicesView extends React.Component<DevicesViewProps, DevicesViewState> {
	constructor(props: DevicesViewProps) {
		super(props);
		this.state = {
			devices: new Array<SmartLightDevice>(),
			removeDevice: undefined,
			removeResetConfig: false
		};
	}

	private deviceRepository = new DeviceRepository();
	private styles = StyleSheet.create({
		deviceCard: {
			marginLeft: '2%',
			marginTop: '2%',
			width: '47%'
		},
		modalTitle: {
			fontSize: 20,
			fontWeight: 'bold',
			marginBottom: 20
		},
		modalText: {
			fontSize: 16
		},
		row: {
			flexDirection: 'row',
			marginBottom: 10
		},
		switch: {
			alignSelf: 'flex-end',
			marginLeft: 30
		}
	});

	async componentDidMount() {
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
					<Modal visible={this.state.removeDevice !== undefined}
						   onDismiss={() => this.initRemoveDevice(undefined)}
						   contentContainerStyle={SLStyle.modal}>

						<Text
							style={this.styles.modalTitle}>{`Remove device ${this.state.removeDevice?.name}?`}</Text>
						<View style={this.styles.row}>
							<Text style={this.styles.modalText}>Reset configuration</Text>
							<Switch style={this.styles.switch} value={this.state.removeResetConfig}
									onValueChange={this.onResetConfigChange}/>
						</View>
						<Button style={SLStyle.button} onPress={this.removeDevice}>Remove</Button>

					</Modal>
				</Portal>
				<FlatList
					data={this.state.devices}
					renderItem={({ item }) => this.renderDeviceCard(item)}
					numColumns={2}
					keyExtractor={(item, index) => index.toString()}/>

				<Button style={{ ...SLStyle.button, marginBottom: 20 }} onPress={this.initDeviceSetup}>
					Add device
				</Button>
			</Provider>
		);
	}

	private renderDeviceCard(device: SmartLightDevice) {
		return (
			<Card mode="outlined" style={this.styles.deviceCard}
				  onLongPress={() => this.initRemoveDevice(device)}
				  onPress={() => this.props.parent.goToDeviceControlScreen(device)}>

				<Card.Content style={{ alignItems: 'center' }}>
					<Title>{device.name}</Title>
					<Paragraph style={{ fontSize: 9 }}>{device.mac}</Paragraph>
				</Card.Content>

			</Card>
		);
	}

	private initDeviceSetup = () => {
		this.props.parent.goToDeviceSetupScreen();
	};

	private initRemoveDevice = (target: SmartLightDevice | undefined) => {
		this.setState((current) => ({
			...current,
			removeDevice: target,
			removeResetConfig: false
		}));
	};

	private onResetConfigChange = (resetConfig: boolean) => {
		this.setState((current) => ({
			...current,
			removeResetConfig: resetConfig
		}));
	};

	private removeDevice = () => {
		if (this.state.removeDevice === undefined) {
			return;
		}

		this.deviceRepository.removeDevice(this.state.removeDevice).then(() => {
			let devices = this.state.devices;
			let removedDevice = this.state.removeDevice;
			if (removedDevice === undefined) {
				return;
			}

			if (this.state.removeResetConfig) {
				DeviceController.get().applyState(removedDevice.name, { reset: true });
			}

			this.setState((current) => ({
				...current,
				devices: devices.filter(device => device.mac !== removedDevice?.mac),
				removeDevice: undefined,
				removeResetConfig: false
			}));
		});
	};
}

export default DevicesView;
