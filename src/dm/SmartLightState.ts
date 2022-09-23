export type SmartLightState = {
	lightOn: boolean,
	lightColor: { r: number, g: number, b: number },
	lightAlpha: number,
	fadeOut: boolean,
	fadeDuration: number,
	executionDelay: number
};
