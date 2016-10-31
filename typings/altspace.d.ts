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
	getThreeJSTrackingSkeleton: () => PromiseLike<TrackingSkeleton>;
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

declare class SyncConnection {
	app: SyncConnectionApp;
	space: SyncConnectionSpace;
	user: SyncConnectionUser;
	instance: SyncConnectionInstance;
}

declare class SyncConnectionInstance {
	path: string;
}

declare class SyncConnectionUser {
	path: string;
}

declare class SyncConnectionSpace {
	path: string;
}

declare class SyncConnectionApp {
	path: string;
}

declare class TrackingSkeleton {
	uuid: string;
	name: string;
	type: string;
	parent: any;
	children: TrackingJoint[];
	up: THREE.Vector3;
	position: THREE.Vector3;
	rotation: Rotation;
	quaternion: Quaternion;
	scale: THREE.Vector3;
	rotationAutoUpdate: boolean;
	matrix: Matrix;
	matrixWorld: Matrix;
	matrixAutoUpdate: boolean;
	matrixWorldNeedsUpdate: boolean;
	layers: Layers;
	visible: boolean;
	castShadow: boolean;
	receiveShadow: boolean;
	frustumCulled: boolean;
	renderOrder: number;
	userData: any;
	trackingJoints: TrackingSkeletonTrackingJoints;
}

declare class TrackingSkeletonTrackingJoints {
	LeftEye0: TrackingJoint;
	RightEye0: TrackingJoint;
	CenterHead0: TrackingJoint;
	CenterNeck0: TrackingJoint;
	CenterSpine0: TrackingJoint;
	CenterSpine1: TrackingJoint;
	CenterSpine2: TrackingJoint;
	CenterHips0: TrackingJoint;
	CenterEye0: TrackingJoint;
}

declare class Layers {
	mask: number;
}

declare class Matrix {
	elements: number[];
}

declare class Quaternion {
	_x: number;
	_y: number;
	_z: number;
	_w: number;
	onChangeCallback: () => any;
}

declare class Rotation {
	_x: number;
	_y: number;
	_z: number;
	_order: string;
	onChangeCallback: () => any;
}

declare class TrackingJoint {
	uuid: string;
	name: string;
	type: string;
	parent: TrackingJoint;
	children: TrackingJoint[];
	up: TrackingJoint;
	position: THREE.Vector3;
	rotation: Rotation;
	quaternion: Quaternion;
	scale: THREE.Vector3;
	rotationAutoUpdate: boolean;
	matrix: Matrix;
	matrixWorld: Matrix;
	matrixAutoUpdate: boolean;
	matrixWorldNeedsUpdate: boolean;
	layers: Layers;
	visible: boolean;
	castShadow: boolean;
	receiveShadow: boolean;
	frustumCulled: boolean;
	renderOrder: number;
	userData: any;
	confidence: number;
	location: string;
}

declare class Object3D extends THREE.Object3D {
	addBehavior: () => any;
	addBehaviors: () => any;
	getBehaviorByType: (t ?: any) => any;
	getMorphTargetIndexByName: (a ?: any) => any;
	removeAllBehaviors: () => any;
	removeBehavior: (t ?: any) => any;
	setDrawMode: (a ?: any) => any;
	updateBehaviors: (t ?: any, e ?: any) => any;
	updateMorphTargets: () => any;
	geometry: THREE.Geometry;
	material: THREE.Material;
}
