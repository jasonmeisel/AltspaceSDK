declare class Enclosure {
	innerWidth: number;
	innerHeight: number;
	innerDepth: number;
	pixelsPerMeter: number;
	hasFocus: boolean;
}

declare class Altspace {
	_internal: any;
	getUser: () => any;
	getSpace: () => any;
	addEventListener: (type ?: any, listener ?: any) => any;
	hasEventListener: (type ?: any, listener ?: any) => any;
	removeEventListener: (type ?: any, listener ?: any) => any;
	dispatchEvent: (event ?: any) => any;
	getThreeJSRenderer: (options ?: any) => any;
	setHighPerfMode: (enabled ?: any) => any;
	inClient: boolean;
	utilities: AltspaceUtilities;
	getEnclosure: () => any;
	_listeners: AltspaceListeners;
	getThreeJSDebugInfo: () => any;
	getGamepads: () => any;
	getDocument: () => any;
	getThreeJSTrackingSkeleton: () => any;
	instantiateNativeObject: (path ?: any) => any;
	open: (url ?: any, target ?: any, opts ?: any) => any;
}

declare class AltspaceListeners {
	listeneradded: any;
	listenerremoved: any;
}

declare class AltspaceUtilities {
	shims: AltspaceUtilitiesShims;
	behaviors: AltspaceUtilitiesBehaviors;
	sync: AltspaceUtilitiesSync;
	codePen: AltspaceUtilitiesCodePen;
	Simulation: (t ?: any) => any;
	multiloader: AltspaceUtilitiesMultiloader;
}

declare class AltspaceUtilitiesMultiloader {
	init: (t ?: any) => any;
	load: (e ?: any, n ?: any) => any;
	LoadRequest: () => any;
}

declare class AltspaceUtilitiesCodePen {
	inTile: string;
	inVR: boolean;
	inCodePen: boolean;
	ensureInVR: () => any;
	setName: (t ?: any) => any;
	getPenId: () => any;
	getAuthorId: () => any;
	printDebugInfo: () => any;
}

declare class AltspaceUtilitiesSync {
	connect: (e ?: any) => any;
	getInstance: (t ?: any) => any;
	authenticate: (t ?: any) => any;
}

declare class AltspaceUtilitiesBehaviors {
	Object3DSync: (e ?: any) => any;
	Bob: (t ?: any) => any;
	ButtonStateStyle: (t ?: any) => any;
	Drag: (t ?: any) => any;
	GamepadControls: (t ?: any) => any;
	HoverColor: (t ?: any) => any;
	SceneSync: (t ?: any, e ?: any) => any;
	Spin: (t ?: any) => any;
	TouchpadRotate: (t ?: any) => any;
	Layout: (e ?: any) => any;
	SteamVRInput: () => any;
	SteamVRTrackedObject: (e ?: any) => any;
}

declare class AltspaceUtilitiesShims {
	OBJMTLLoader: () => any;
	cursor: any;
} 

declare var altspace : Altspace;
