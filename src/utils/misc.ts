export const isEnvBrowser = (): boolean => !(window as any).invokeNative;

export const getResourceName = () =>
	(window as any).GetParentResourceName ? (window as any)?.GetParentResourceName() : 'npwd';