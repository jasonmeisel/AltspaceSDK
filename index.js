/// <reference path="typings/threejs/three.d.ts" />
/// <reference path="typings/pleasejs/please.d.ts" />
var Enclosure = (function () {
    function Enclosure() {
    }
    return Enclosure;
}());
function toDeclaration(obj) {
    var out = "class Foo {\n";
    for (var key in obj)
        out += "\t" + key + ": " + typeof (obj[key]) + "\n";
    out += "}";
    console.log(out);
}
var sim = altspace.utilities.Simulation();
sim.camera.position.z = 5;
var config = { authorId: 'AltspaceVR', appId: 'TwoRooms' };
var sceneSync;
altspace.utilities.sync.connect(config).then(function (connection) {
    sceneSync = altspace.utilities.behaviors.SceneSync(connection.instance, {
        instantiators: { 'Cube': createCube },
        ready: ready
    });
    sim.scene.addBehavior(sceneSync);
});
function createCube() {
    var url = 'models/cube/altspace-logo.jpg';
    var texture = new THREE.TextureLoader().load(url);
    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var material = new THREE.MeshBasicMaterial({ color: '#ffffff', map: texture });
    var cube = new THREE.Mesh(geometry, material);
    cube.addBehaviors(altspace.utilities.behaviors.Object3DSync(), altspace.utilities.behaviors.Spin({ speed: 0.0005 }), ChangeColor());
    sim.scene.add(cube);
    return cube;
}
function ready(firstInstance) {
    if (firstInstance) {
        sceneSync.instantiate('Cube');
    }
    var fontSrc = "./Roboto_Regular.js";
    var fontLoader = new THREE.FontLoader();
    fontLoader.load(fontSrc, function (font) {
        var geo = new THREE.TextGeometry("Two Rooms...", {
            bevelEnabled: true,
            bevelSize: 1,
            bevelThickness: 1,
            curveSegments: 12,
            font: font,
            height: 2,
            size: 50
        });
        var material = new THREE.MeshBasicMaterial({ color: '#ffffff' });
        var obj = new THREE.Mesh(geo, material);
        // (<any>obj).addBehaviors(
        // 	altspace.utilities.behaviors.Object3DSync(),
        // 	altspace.utilities.behaviors.Spin({speed: 0.0005})
        // );
        sim.scene.add(obj);
        obj.position.y = 250;
        obj.position.z = 100;
    });
    altspace.getEnclosure().then(function (e) {
        // console.log(e);
        toDeclaration(e);
    });
}
function ChangeColor() {
    var object3d;
    var lastColor;
    var colorRef;
    function awake(o) {
        object3d = o;
        var sync = object3d.getBehaviorByType('Object3DSync'); //TODO: better way of doing this
        colorRef = sync.dataRef.child('color');
        colorRef.on('value', function (snapshot) {
            var value = snapshot.val();
            if (!value)
                return; //we are first to create the cube, no color set yet
            object3d.material.color = new THREE.Color(value);
            object3d.material.needsUpdate = true; //currently required in Altspace
        });
        object3d.addEventListener('cursordown', function () {
            var color = Please.make_color()[0]; //random color
            colorRef.set(color);
        });
        if (altspace && altspace.inClient) {
            altspace.getEnclosure().then(function (e) {
                // scale cube so it's 1 meter in Altspace
                object3d.scale.multiplyScalar(e.pixelsPerMeter);
            });
        }
    }
    function update(deltaTime) {
        /* no updating needed, color changes in Firebase 'value' callback above */
    }
    return { awake: awake, update: update };
}
;
//# sourceMappingURL=index.js.map