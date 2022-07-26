import React from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParams } from "../RootStackParams";
import { TabView, SceneMap } from "react-native-tab-view";
import DevicesView from "./DevicesView";
import GroupsView from "./GroupsView";

const renderScene = SceneMap({
	devices: DevicesView,
	groups: GroupsView,
});

type MainScreenProps = NativeStackScreenProps<RootStackParams, "Main">;

class MainScreen extends React.Component<MainScreenProps, any> {
	render() {
		const index = 0;
		const routes = [
			{ key: "devices", title: "Devices" },
			{ key: "groups", title: "Groups" },
		];

		return (
			<TabView
				navigationState={{ index, routes }}
				renderScene={renderScene}
				onIndexChange={number => {
					console.log(number);
				}} />
		);
	}
}

export default MainScreen;
