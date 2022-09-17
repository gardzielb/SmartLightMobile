import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParams } from '../RootStackParams';
import { Text } from 'react-native-paper';

type DevSetupScreenProps = NativeStackScreenProps<RootStackParams, 'DeviceSetup'>

export default class DeviceConfigurationScreen extends React.Component<DevSetupScreenProps, any> {
	render() {
		return (
			<Text>Setup</Text>
		)
	}
}
