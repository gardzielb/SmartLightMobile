import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParams } from '../RootStackParams';
import { Text } from 'react-native-paper';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { BarCodeReadEvent, RNCamera } from 'react-native-camera';
import { StyleSheet } from 'react-native';
import SmartLightDevice from '../model/SmartLightDevice';

type MacScannerScreenProps = NativeStackScreenProps<RootStackParams, 'MacScanner'>

export default class MacScannerScreen extends React.Component<MacScannerScreenProps, any> {
	private styles = StyleSheet.create({
		centerText: {
			flex: 1,
			fontSize: 18,
			padding: 32,
			color: '#000'
		}
	});

	private onSuccess = async (event: BarCodeReadEvent) => {
		let devConfig = this.props.route.params;
		let addedDevice = new SmartLightDevice(devConfig.deviceName, event.data);
		console.log(`Adding device ${addedDevice} with WiFi config '${devConfig.wifiSSID}:${devConfig.wifiPassword}'`);
		this.props.navigation.navigate('Main', { addedDevice: addedDevice });
	};

	render() {
		return (
			<QRCodeScanner
				onRead={this.onSuccess}
				flashMode={RNCamera.Constants.FlashMode.auto}
				topContent={
					<Text style={this.styles.centerText}>
						Scan QR code from the device
					</Text>
				}
			/>
		);
	}
}
