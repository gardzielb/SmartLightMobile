import React, { ReactNode } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParams } from '../RootStackParams';
import { StyleSheet, Text, View } from 'react-native';
import { Button, Switch } from 'react-native-paper';
import Slider from '@react-native-community/slider';

type DevControlScreenProps = NativeStackScreenProps<RootStackParams, 'DeviceControl'>

type DevControlScreenState = {
	lightOn: boolean,
	lightColor: string,
	lightAlpha: number,
	fadeOut: boolean,
	fadeDuration: number,
	executionTime: Date | null
}

const styles = StyleSheet.create({
	grid: {
		flex: 2, // the number of columns you want to devide the screen into
		marginHorizontal: '5%'
	},
	row: {
		flexDirection: 'row',
		marginTop: '10%'
	},
	text: {
		fontSize: 16,
		color: "#000000"
	},
	switch: {
		marginBottom: -10
	}
});

type ColumnProps = {
	span: number
	children: ReactNode
}

const Column = ({ span, children }: ColumnProps) => {
	return (
		<View style={{ flex: span }}>{children}</View>
	)
}

type RowProps = {
	children: ReactNode,
}

const Row = ({ children }: RowProps) => (
	<View style={styles.row}>{children}</View>
)

export default class DeviceControlScreen extends React.Component<DevControlScreenProps, DevControlScreenState> {
	constructor(props: DevControlScreenProps) {
		super(props);
		this.state = {
			lightOn: false,
			lightColor: '#ff00ff',
			lightAlpha: 50,
			fadeOut: false,
			fadeDuration: 10,
			executionTime: null
		};
	}

	onLightToggled = (on: boolean) => {
		this.setState((current) => ({ ...current, lightOn: on }));
	}

	chooseColor = () => {
		console.log('Selecting color');
	}

	onAlphaChange = (alpha: number) => {
		this.setState((current) => ({ ...current, lightAlpha: alpha }));
	}

	onFadeToggled = (on: boolean) => {
		this.setState((current) => ({ ...current, fadeOut: on }));
	}

	onFadeDurationChange = (duration: number) => {
		this.setState((current) => ({ ...current, fadeDuration: duration }));
	}

	render() {
		return (
			<View style={styles.grid}>
				<Row>
					<Column span={1}>
						<Text style={styles.text}>Light on</Text>
					</Column>
					<Column span={1}>
						<Switch style={styles.switch} value={this.state.lightOn} onValueChange={this.onLightToggled}/>
					</Column>
				</Row>
				<Row>
					<Column span={1}>
						<Text style={styles.text}>Color</Text>
					</Column>
					<Column span={1}>
						<Text style={{ textAlign: 'center', backgroundColor: this.state.lightColor }}
							  onPress={this.chooseColor}>
							{this.state.lightColor.toUpperCase()}
						</Text>
					</Column>
				</Row>
				<Row>
					<Column span={1}>
						<Text style={styles.text}>Intensity</Text>
					</Column>
					<Column span={1}>
						<Slider minimumValue={5} maximumValue={100} step={5} value={this.state.lightAlpha}
								onValueChange={this.onAlphaChange}/>
					</Column>
				</Row>
				<Row>
					<Column span={1}>
						<Text style={styles.text}>Fade out</Text>
					</Column>
					<Column span={1}>
						<Switch style={styles.switch} value={this.state.fadeOut} onValueChange={this.onFadeToggled}/>
					</Column>
				</Row>
				<Row>
					<Column span={1}>
						<Text style={styles.text}>Fading duration</Text>
					</Column>
					<Column span={1}>
						<Slider minimumValue={3} maximumValue={15} step={1} value={this.state.fadeDuration}
								onValueChange={this.onFadeDurationChange}/>
					</Column>
				</Row>
				<Row>
					<Column span={1}>
						<Text style={styles.text}>Delay execution</Text>
					</Column>
					<Column span={1}>
						<Switch style={styles.switch} value={this.state.executionTime != null}/>
					</Column>
				</Row>
				<Row>
					<Column span={2}>
						<Button>Execute</Button>
					</Column>
				</Row>
			</View>
		);
	}
}
