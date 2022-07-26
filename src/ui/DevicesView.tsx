import React from "react";
import { FlatList, View } from "react-native";
import { Button, Card, Paragraph, Text, Title } from "react-native-paper";
import SmartLightDevice from "../model/SmartLightDevice";

const data = [
	new SmartLightDevice("Meraxes"),
	new SmartLightDevice("Balerion"),
	new SmartLightDevice("Caraxes"),
	new SmartLightDevice("Vermithor"),
];

class DevicesView extends React.Component<any, any> {
	render() {
		return (
			<View>
				<FlatList
					data={data}
					renderItem={({ item }) => (
						<Card
							mode="outlined"
							style={{ marginLeft: "2%", marginTop: "2%", width: "47%" }}
							onLongPress={() => console.log(`${item.name} selected`)}>

							<Card.Content style={{ alignItems: "center" }}>
								<Title>{item.name}</Title>
								<Paragraph>{item.name}</Paragraph>
							</Card.Content>

						</Card>
					)}
					numColumns={2}
					keyExtractor={(item, index) => index.toString()}
				/>
			</View>
		);
	}
}

export default DevicesView;
