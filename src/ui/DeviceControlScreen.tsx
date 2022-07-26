import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParams } from '../RootStackParams';
import { TabView } from 'react-native-tab-view';
import { Text } from 'react-native';

type DevControlScreenProps = NativeStackScreenProps<RootStackParams, 'DeviceControl'>

export default class DeviceControlScreen extends React.Component<DevControlScreenProps, any> {
	render() {
		return (
			<Text>{this.props.route.params.device.name}</Text>
		);
	}
}
