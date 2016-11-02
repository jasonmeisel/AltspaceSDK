/// <reference path="firebase/firebase.d.ts" />

declare class Enclosure {
	innerWidth: number;
	innerHeight: number;
	innerDepth: number;
	pixelsPerMeter: number;
	hasFocus: boolean;
}

declare class Altspace {
	_internal: any;
	getUser: () => PromiseLike<AltspaceUser>;
	getSpace: () => any;
	addEventListener: (type ?: any, listener ?: any) => any;
	hasEventListener: (type ?: any, listener ?: any) => any;
	removeEventListener: (type ?: any, listener ?: any) => any;
	dispatchEvent: (event ?: any) => any;
	getThreeJSRenderer: (options ?: any) => any;
	setHighPerfMode: (enabled ?: any) => any;
	inClient: boolean;
	utilities: AltspaceUtilities;
	getEnclosure: () => PromiseLike<Enclosure>;
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

declare class Scene extends THREE.Scene {
	updateAllBehaviors: () => void;
	addBehavior: (beh: any) => void;
}

declare class AltspaceUtilities {
	shims: AltspaceUtilitiesShims;
	behaviors: AltspaceUtilitiesBehaviors;
	sync: AltspaceUtilitiesSync;
	codePen: AltspaceUtilitiesCodePen;
	Simulation: (t ?: any) => Simulation;
	multiloader: AltspaceUtilitiesMultiloader;
}

declare class Simulation {
	scene: Scene;
	camera : THREE.Camera;
	renderer : THREE.WebGLRenderer;
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
	Object3DSync: (config ?: {
		position ?: boolean;
		rotation ?: boolean;
		scale ?: boolean;
		auto ?: boolean;
		world ?: boolean;
	}) => any;
	Bob: (t ?: any) => any;
	ButtonStateStyle: (t ?: any) => any;
	Drag: (t ?: any) => any;
	GamepadControls: (t ?: any) => any;
	HoverColor: (t ?: any) => any;
	SceneSync: (syncInstance : Firebase, config : {
		instantiators ?: { [syncType : string] : (args ?: any) => Object3D };
		destroyers ?: { [syncType : string] : (obj : Object3D) => boolean };
		ready ?: (firstInstance : boolean) => void;
	}) => SceneSync;
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
	instance: Firebase;
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
	addBehavior: (behavior : Behavior) => any;
	addBehaviors: (...behaviors: Behavior[]) => any;
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

declare class SceneSync {
	awake: (r ?: any, o ?: any) => any;
	instantiate: (syncType : string, initData ?: Object, destroyOnDisconnect ?: boolean) => any;
	destroy: (object3d : Object) => any;
	type: string;
}

declare class Object3DSync {
	awake: (t ?: any, e ?: any) => any;
	update: (t ?: any) => any;
	type: string;
	link: (t ?: any, e ?: any) => any;
	autoSend: () => any;
	takeOwnership: () => any;
	dataRef: any;
}

declare interface Behavior {
	awake ?: (obj : Object3D) => void;
	update ?: (dt : number) => void;
}

declare class AltspaceUser {
	userId: string;
	isLocal: boolean;
	isModerator: boolean;
	displayName: string;
}
