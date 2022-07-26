import React, { ReactNode } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParams } from '../RootStackParams';
import { StyleSheet, Text, View } from 'react-native';
import { Button, Switch } from 'react-native-paper';
import Slider from '@react-native-community/slider';
import { TimePicker } from 'react-native-simple-time-picker';
import ColorPicker from 'react-native-wheel-color-picker';
import DeviceController from '../dm/DeviceController';
import { SLStyle } from './styles';

type DevControlScreenProps = NativeStackScreenProps<RootStackParams, 'DeviceControl'>

type TimeDelay = {
	hours: number,
	minutes: number,
	seconds: number
}

type DevControlScreenState = {
	lightOn: boolean,
	lightColor: string,
	pickColor: boolean,
	lightAlpha: number,
	fadeOut: boolean,
	fadeDuration: number,
	delayExecution: boolean,
	executionDelay: TimeDelay
}

type ColumnProps = {
	span: number
	children: ReactNode
}

const Column = ({ span, children }: ColumnProps) => {
	return (
		<View style={{ flex: span }}>{children}</View>
	);
};

type RowProps = {
	children: ReactNode,
}

const Row = ({ children }: RowProps) => (
	<View style={{ flexDirection: 'row', marginTop: '13%' }}>
		{children}
	</View>
);

export default class DeviceControlScreen extends React.Component<DevControlScreenProps, DevControlScreenState> {
	private deviceController = DeviceController.get();
	private styles = StyleSheet.create({
		grid: {
			flex: 2, // the number of columns you want to devide the screen into
			marginHorizontal: '5%'
		},
		text: {
			fontSize: 16,
			color: '#000000'
		},
		switch: {
			marginBottom: -10
		},
		colorButton: {
			position: 'absolute',
			marginTop: -10,
			height: 40,
			borderRadius: 10,
			borderWidth: 1,
			borderStyle: 'solid',
			borderColor: '#000000',
			width: 80,
			alignSelf: 'flex-end',
			paddingTop: 10,
			textAlign: 'center'
		}
	});

	constructor(props: DevControlScreenProps) {
		super(props);
		this.state = {
			lightOn: false,
			lightColor: '#ffffff',
			pickColor: false,
			lightAlpha: 50,
			fadeOut: false,
			fadeDuration: 10,
			delayExecution: false,
			executionDelay: {
				hours: 0,
				minutes: 0,
				seconds: 0
			}
		};
	}

	private onLightToggled = (on: boolean) => {
		this.setState((current) => ({ ...current, lightOn: on }));
	};

	private onAlphaChange = (alpha: number) => {
		this.setState((current) => ({ ...current, lightAlpha: alpha }));
	};

	private onFadeToggled = (on: boolean) => {
		this.setState((current) => ({ ...current, fadeOut: on }));
	};

	private onFadeDurationChange = (duration: number) => {
		this.setState((current) => ({ ...current, fadeDuration: duration }));
	};

	private onDelayToggled = (delay: boolean) => {
		this.setState((current) => ({ ...current, delayExecution: delay }));
	};

	private onExecutionDelayChange = (delay: TimeDelay) => {
		this.setState((current) => ({ ...current, executionDelay: delay }));
	};

	private showColorPicker = (show: boolean) => {
		this.setState((current) => ({ ...current, pickColor: show }));
	};

	private onColorChange = (color: string) => {
		this.setState((current) => ({ ...current, lightColor: color }));
	};

	private execute = () => {
		let execDelay = this.state.executionDelay;
		let execDelaySec = execDelay.hours * 3600 + execDelay.minutes * 60 + execDelay.seconds;

		this.deviceController.applyState(
			this.props.route.params.device.name,
			{
				on: this.state.lightOn,
				color: this.state.lightColor,
				alpha: this.state.lightAlpha,
				fade: this.state.fadeOut ? this.state.fadeDuration : undefined,
				delay: execDelaySec != 0 ? execDelaySec : undefined
			}
		);
	};

	private FadeDurationRow = () => {
		if (!this.state.fadeOut) {
			return null;
		}

		return (
			<Row>
				<Column span={1}>
					<Text style={this.styles.text}>Fading duration</Text>
				</Column>
				<Column span={1}>
					<Slider minimumValue={3} maximumValue={15} step={1} value={this.state.fadeDuration}
							onValueChange={this.onFadeDurationChange}/>
				</Column>
			</Row>
		);
	};

	private ExecutionDelayRow = () => {
		if (!this.state.delayExecution) {
			return null;
		}

		return (
			<Row>
				<Column span={2}>
					<TimePicker value={this.state.executionDelay}
								pickerShows={['hours', 'minutes', 'seconds']}
								hoursUnit="h" minutesUnit="m" secondsUnit="s"
								onChange={this.onExecutionDelayChange}/>
				</Column>
			</Row>
		);
	};

	private ColorPickerView = () => {
		return (
			<View style={{ position: 'absolute', paddingLeft: 20, paddingRight: 30 }}>
				<ColorPicker
					color={this.state.lightColor}
					onColorChangeComplete={this.onColorChange}
					thumbSize={40}
					sliderSize={40}
					noSnap={false}
				/>
				<Button style={SLStyle.button} onPress={() => this.showColorPicker(false)}>Submit</Button>
			</View>
		);
	};

	private DeviceControlView = () => {
		return (
			<View style={this.styles.grid}>
				<Row>
					<Column span={1}>
						<Text style={this.styles.text}>Light on</Text>
					</Column>
					<Column span={1}>
						<Switch style={this.styles.switch} value={this.state.lightOn}
								onValueChange={this.onLightToggled}/>
					</Column>
				</Row>
				<Row>
					<Column span={1}>
						<Text style={this.styles.text}>Color</Text>
					</Column>
					<Column span={1}>
						<Text style={{ ...this.styles.colorButton, backgroundColor: this.state.lightColor }}
							  onPress={() => this.showColorPicker(true)}>
							{this.state.lightColor.toUpperCase()}
						</Text>
					</Column>
				</Row>
				<Row>
					<Column span={1}>
						<Text style={this.styles.text}>Intensity</Text>
					</Column>
					<Column span={1}>
						<Slider minimumValue={5} maximumValue={100} step={5} value={this.state.lightAlpha}
								onValueChange={this.onAlphaChange}/>
					</Column>
				</Row>
				<Row>
					<Column span={1}>
						<Text style={this.styles.text}>Fade out</Text>
					</Column>
					<Column span={1}>
						<Switch style={this.styles.switch} value={this.state.fadeOut}
								onValueChange={this.onFadeToggled}/>
					</Column>
				</Row>
				<this.FadeDurationRow/>
				<Row>
					<Column span={1}>
						<Text style={this.styles.text}>Delay execution</Text>
					</Column>
					<Column span={1}>
						<Switch style={this.styles.switch} value={this.state.delayExecution}
								onValueChange={this.onDelayToggled}/>
					</Column>
				</Row>
				<this.ExecutionDelayRow/>
				<Row>
					<Column span={2}>
						<Button style={SLStyle.button} onPress={this.execute}>Execute</Button>
					</Column>
				</Row>
			</View>
		);
	};

	render() {
		return this.state.pickColor ? (<this.ColorPickerView/>) : (<this.DeviceControlView/>);
	}
}
