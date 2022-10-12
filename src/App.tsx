import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParams } from './RootStackParams';
import MainScreen from './ui/MainScreen';
import DeviceControlScreen from './ui/DeviceControlScreen';
import MacScannerScreen from './ui/MacScannerScreen';
import DeviceConfigScreen from './ui/DeviceConfigScreen';

const Stack = createNativeStackNavigator<RootStackParams>();

export default class App extends React.Component<any, any> {
	render() {
		return (
			<NavigationContainer>
				<Stack.Navigator>
					<Stack.Screen name="Main" component={MainScreen}/>
					<Stack.Screen name="DeviceControl" component={DeviceControlScreen}/>
					<Stack.Screen name="DeviceConfig" component={DeviceConfigScreen}/>
					<Stack.Screen name="MacScanner" component={MacScannerScreen}/>
				</Stack.Navigator>
			</NavigationContainer>
		);
	}
}
