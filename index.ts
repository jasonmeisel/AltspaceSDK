/// <reference path="typings/threejs/three.d.ts" />
/// <reference path="typings/pleasejs/please.d.ts" />
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
	for (let key of Object.keys(obj))
		out += "\t" + key + ": " + toType(name, key, obj[key], otherTypes) + ";\n";
	out += "}";

	// console.log(obj);
	console.log(out);

	while (otherTypes.length > 0)
	{
		let type = otherTypes.pop();
		type.name[0] = type.name[0].toUpperCase();
		toDeclaration(name + type.name, type.obj, depth + 1);
	}
} 

let sim = altspace.utilities.Simulation();

sim.camera.position.z = 5;
let config = { authorId: 'AltspaceVR', appId: 'TwoRooms' };
let sceneSync;
altspace.utilities.sync.connect(config).then(function(connection : SyncConnection) {
	sceneSync = altspace.utilities.behaviors.SceneSync(connection.instance, {
		instantiators: {'Cube': createCube },
		ready: ready
	});
	sim.scene.addBehavior(sceneSync);
});

function createCube() {
	let url = 'models/cube/altspace-logo.jpg';
	let texture = new THREE.TextureLoader().load(url);
	let geometry = new THREE.BoxGeometry(1, 1, 1);
	let material = new THREE.MeshBasicMaterial({color:'#ffffff', map: texture});
	let cube = new THREE.Mesh(geometry, material);
	(<any>cube).addBehaviors(
		altspace.utilities.behaviors.Object3DSync(),
		altspace.utilities.behaviors.Spin({speed: 0.0005}),
		ChangeColor()
	);

	sim.scene.add(cube);
	return cube;
}

function ready(firstInstance) {
	if (firstInstance) {
		sceneSync.instantiate('Cube');
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
		obj.position.y = 250;
		obj.position.z = 100;
	});

	altspace.getEnclosure().then(function(e : Enclosure) {
	});
}

function ChangeColor() {//define a custom behavior

	let object3d;
	let lastColor;
	let colorRef;

	function awake(o) {
		object3d = o;
		let sync = object3d.getBehaviorByType('Object3DSync');//TODO: better way of doing this
		colorRef = sync.dataRef.child('color');

		colorRef.on('value', function (snapshot) {
			let value = snapshot.val();
			if (!value) return; //we are first to create the cube, no color set yet
			object3d.material.color = new THREE.Color(value);
			object3d.material.needsUpdate = true;//currently required in Altspace
		});

		object3d.addEventListener('cursordown', function() {
			let color = Please.make_color()[0];//random color
			colorRef.set(color);
		});

		if (altspace && altspace.inClient) {
			altspace.getEnclosure().then(function(e) {
				// scale cube so it's 1 meter in Altspace
				object3d.scale.multiplyScalar(e.pixelsPerMeter);
			});
		}

	}

	function update(deltaTime) {
		/* no updating needed, color changes in Firebase 'value' callback above */
	}

	return { awake: awake, update: update };

};