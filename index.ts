/// <reference path="typings/threejs/three.d.ts" />
/// <reference path="typings/pleasejs/please.d.ts" />
/// <reference path="typings/jquery/jquery.d.ts" />
/// <reference path="typings/underscore/underscore.d.ts" />
/// <reference path="typings/altspace.d.ts" />

let STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
let ARGUMENT_NAMES = /([^\s,]+)/g;
function getParamNames(func : Function) {
	let fnStr = func.toString().replace(STRIP_COMMENTS, '');
	let result = fnStr.slice(fnStr.indexOf('(')+1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
	if (result === null)
		result = [];
	return result.map(p => p);
}

function toType(prefix : string, name : string, obj : any, otherTypes : any[])
{
	if (obj instanceof Function)
	{
		let params = getParamNames(obj as Function);
		let paramList = params.map(p => `${p} ?: any`).join(", ");
		return `(${paramList}) => any`;
	}

	if (obj instanceof Object)
	{
		name = name.replace("_", "");
		name = name[0].toUpperCase() + name.substr(1);
		otherTypes.push({
			name : name,
			obj : obj
		});
		return prefix + name;
	}

	return typeof(obj);
}

function toDeclaration(name : string, obj : any, depth : number = 0)
{
	if (depth > 2)
		return;

	let otherTypes = [];

	let out = "declare class " + name + " {\n";
	for (let key of Object.keys(obj).concat(_.functions(obj)))
		out += "\t" + key + ": " + toType(name, key, obj[key], otherTypes) + ";\n";
	out += "}";

	// console.log(obj);
	console.log(out);
	otherTypes = $.unique(otherTypes);
	
	while (otherTypes.length > 0)
	{
		let type = otherTypes.pop();
		type.name[0] = type.name[0].toUpperCase();
		toDeclaration(name + type.name, type.obj, depth + 1);
	}
}

// sim.camera.position.z = 5;
let config = { authorId: 'whatisjason', appId: 'TwoRooms' };
let sceneSync : SceneSync;

let sim : Simulation;

altspace.utilities.sync.connect(config).then(function(connection : SyncConnection) {
	sim = altspace.utilities.Simulation();
	sceneSync = altspace.utilities.behaviors.SceneSync(connection.instance, {
		instantiators: { 'Cube': createCube },
		ready: ready
	});
	sim.scene.addBehavior(sceneSync);
});

function createCube(args) {
	let url = './examples/models/cube/altspace-logo.jpg';
	let texture = new THREE.TextureLoader().load(url);
	let geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
	let material = new THREE.MeshBasicMaterial({color:'#ffffff', map: texture});
	let cube = <Object3D & THREE.Mesh> new THREE.Mesh(geometry, material);
	cube.addBehaviors(
		altspace.utilities.behaviors.Object3DSync({
			position : true,
			scale : true,
			rotation : true
		}),
		altspace.utilities.behaviors.Spin({speed: 0.0001})
	);

	altspace.getUser().then(user => {
		if (user.userId == args.user)
		{
			cube.addBehavior(new FollowPlayerBehaviour());
		}
	});

	cube.position.set(0,0,0);

	sim.scene.add(cube);
	return cube;
}

function ready(firstInstance : boolean) {
	if (firstInstance)
	{
		altspace.getUser().then(user => sceneSync.instantiate('Cube', { user: user.userId }));
	}

	let fontSrc = "./Roboto_Regular.js";
	let fontLoader = new THREE.FontLoader();
	fontLoader.load(fontSrc, (font) => {
		let geo = new THREE.TextGeometry("Two Rooms...", {
			bevelEnabled: true,
			bevelSize: 1,
			bevelThickness: 1,
			curveSegments: 12,
			font: <THREE.Font><any>font,
			height: 2,
			size: 50
		});
		let material = new THREE.MeshBasicMaterial({color:'#ffffff'});
		let obj = new THREE.Mesh(geo, material);
		// (<any>obj).addBehaviors(
		// 	altspace.utilities.behaviors.Object3DSync(),
		// 	altspace.utilities.behaviors.Spin({speed: 0.0005})
		// );
		sim.scene.add(obj);
		obj.position.y = 0;
		obj.position.z = 0;
	});

	altspace.getThreeJSTrackingSkeleton().then(skeleton => loadBomb(skeleton.trackingJoints.CenterHead0.position));
}

function loadBomb(pos : THREE.Vector3)
{
	let loader = new THREE.JSONLoader();
	loader.load("./res/bomb.json", (geo, mats) => {
		let material = new THREE.MeshLambertMaterial( { map: THREE.ImageUtils.loadTexture("./res/bomb.png") } );
		let obj = new THREE.Mesh(geo, material);
		sim.scene.add(obj);
		obj.position.copy(pos);
		obj.position.x += 10;
		obj.scale.set(10, 10, 10);
	});
}

class FollowPlayerBehaviour implements Behavior
{
	object3d : Object3D;
	lastColor : any;
	colorRef : any;

	skeleton : TrackingSkeleton;
	enclosure : Enclosure;

	awake(o : Object3D)
	{
		this.object3d = o;
		let sync = <Object3DSync> this.object3d.getBehaviorByType("Object3DSync");

		if (altspace && altspace.inClient)
		{
			altspace.getEnclosure().then(e =>
			{
				// scale cube so it's 1 meter in Altspace
				this.object3d.scale.multiplyScalar(e.pixelsPerMeter);
				this.enclosure = e;
			});

			altspace.getThreeJSTrackingSkeleton().then(skeleton => this.skeleton = skeleton);
		}
	}

	update(dt : number)
	{
		if (this.skeleton)
		{
			let target = this.skeleton.trackingJoints.CenterHead0.position.clone();
			let toTarget = target.clone().sub(this.object3d.position);

			if (toTarget.length() > 5)
			{
				toTarget.clampLength(0, dt * 0.1);
				this.object3d.position.add(toTarget);
			}
		}
	}
}
