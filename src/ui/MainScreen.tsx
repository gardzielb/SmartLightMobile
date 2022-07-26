import React from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParams } from "../RootStackParams";
import { TabView, SceneMap } from "react-native-tab-view";
import DevicesView from "./DevicesView";
import GroupsView from "./GroupsView";
import SmartLightDevice from '../model/SmartLightDevice';

type MainScreenProps = NativeStackScreenProps<RootStackParams, "Main">;

class MainScreen extends React.Component<MainScreenProps, any> {
	private renderScene = SceneMap({
		devices: () => (<DevicesView parent={this}/>),
		groups: GroupsView
	});

	goToDeviceControlScreen(device: SmartLightDevice) {
		this.props.navigation.navigate('DeviceControl', { device: device })
	}

	render() {
		const index = 0;
		const routes = [
			{ key: "devices", title: "Devices" },
			{ key: "groups", title: "Groups" }
		];

		return (
			<TabView
				navigationState={{ index, routes }}
				renderScene={this.renderScene}
				onIndexChange={number => {
					console.log(number);
				}}/>
		);
	}
}

export default MainScreen;
