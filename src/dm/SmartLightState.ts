export type SmartLightState = {
	on?: boolean,
	color?: string,
	alpha?: number,
	fade?: number, // 0 - don't fade, > 0 - duration period in seconds
	delay?: number,
	reset?: boolean // reset configuration
};
