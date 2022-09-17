import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParams } from "./RootStackParams";
import MainScreen from "./ui/MainScreen";
import DeviceControlScreen from './ui/DeviceControlScreen';
import DeviceConfigurationScreen from './ui/DeviceConfigurationScreen';

const Stack = createNativeStackNavigator<RootStackParams>();

const App = () => {
	return (
		<NavigationContainer>
			<Stack.Navigator>
				<Stack.Screen name="Main" component={MainScreen}/>
				<Stack.Screen name="DeviceSetup" component={DeviceConfigurationScreen}/>
				<Stack.Screen name="DeviceControl" component={DeviceControlScreen}/>
			</Stack.Navigator>
		</NavigationContainer>
	);
};

export default App;
