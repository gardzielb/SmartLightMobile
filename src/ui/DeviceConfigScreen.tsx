import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParams } from '../RootStackParams';
import { View } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { SLStyle } from './styles';
import { SmartLightConfig } from '../model/SmartLightConfig';

type ConfigScreenProps = NativeStackScreenProps<RootStackParams, 'DeviceConfig'>

export default class DeviceConfigScreen extends React.Component<ConfigScreenProps, SmartLightConfig> {
	constructor(props: ConfigScreenProps) {
		super(props);
		this.state = {
			deviceName: 'Deana',
			wifiSSID: 'MinasTirith',
			wifiPassword: 'TwarzCzyDupa123'
		};
	}

	private onDeviceNameInput = (deviceName: string) => {
		this.setState((current) => ({
			...current,
			deviceName: deviceName
		}));
	};

	private onWifiSSIDInput = (wifiSSID: string) => {
		this.setState((current) => ({
			...current,
			wifiSSID: wifiSSID
		}));
	};

	private onWifiPasswdInput = (wifiPassword: string) => {
		this.setState((current) => ({
			...current,
			wifiPassword: wifiPassword
		}));
	};

	private setupDevice = () => {
		this.props.navigation.navigate(
			'MacScanner', {
				deviceName: this.state.deviceName.trim(),
				wifiSSID: this.state.wifiSSID.trim(),
				wifiPassword: this.state.wifiPassword
			}
		);
	};

	render() {
		return (
			<View>
				<TextInput mode="flat" style={SLStyle.textInput} label="Device name"
						   value={this.state.deviceName} onChangeText={this.onDeviceNameInput}/>

				<TextInput mode="flat" style={SLStyle.textInput} label="WiFi SSID"
						   value={this.state.wifiSSID} onChangeText={this.onWifiSSIDInput}/>

				<TextInput mode="flat" style={SLStyle.textInput} label="WiFi password" secureTextEntry={true}
						   value={this.state.wifiPassword} onChangeText={this.onWifiPasswdInput}/>

				<Button style={SLStyle.button} onPress={this.setupDevice}>Add</Button>
			</View>
		);
	}
}
