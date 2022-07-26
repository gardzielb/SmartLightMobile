import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParams } from "./RootStackParams";
import MainScreen from "./ui/MainScreen";
import DeviceControlScreen from './ui/DeviceControlScreen';

const Stack = createNativeStackNavigator<RootStackParams>();

const App = () => {
	return (
		<NavigationContainer>
			<Stack.Navigator>
				<Stack.Screen name="Main" component={MainScreen}/>
				<Stack.Screen name="DeviceControl" component={DeviceControlScreen}/>
			</Stack.Navigator>
		</NavigationContainer>
	);
};

export default App;
