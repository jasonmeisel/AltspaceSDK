declare var altspace : any;

var sim = altspace.utilities.Simulation();
sim.camera.position.z = 5;
var config = { authorId: 'AltspaceVR', appId: 'TwoRooms' };
var sceneSync;
altspace.utilities.sync.connect(config).then(function(connection) {
	sceneSync = altspace.utilities.behaviors.SceneSync(connection.instance, {
		instantiators: {'Cube': createCube },
		ready: ready
	});
	sim.scene.addBehavior(sceneSync);
});

function createCube() {
	var url = 'models/cube/altspace-logo.jpg';
	var texture = new THREE.TextureLoader().load(url);
	var geometry = new THREE.BoxGeometry(1, 1, 1);
	var material = new THREE.MeshBasicMaterial({color:'#ffffff', map: texture});
	var cube = new THREE.Mesh(geometry, material);
	cube.addBehaviors(
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

	altspace.getEnclosure().then(function(e) {
		
	});
}

function ChangeColor() {//define a custom behavior

	var object3d;
	var lastColor;
	var colorRef;

	function awake(o) {
		object3d = o;
		var sync = object3d.getBehaviorByType('Object3DSync');//TODO: better way of doing this
		colorRef = sync.dataRef.child('color');

		colorRef.on('value', function (snapshot) {
			var value = snapshot.val();
			if (!value) return; //we are first to create the cube, no color set yet
			object3d.material.color = new THREE.Color(value);
			object3d.material.needsUpdate = true;//currently required in Altspace
		});

		object3d.addEventListener('cursordown', function() {
			var color = Please.make_color()[0];//random color
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