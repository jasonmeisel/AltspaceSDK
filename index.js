/// <reference path="typings/threejs/three.d.ts" />
/// <reference path="typings/pleasejs/please.d.ts" />
/// <reference path="typings/jquery/jquery.d.ts" />
/// <reference path="typings/underscore/underscore.d.ts" />
/// <reference path="typings/altspace.d.ts" />
var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
var ARGUMENT_NAMES = /([^\s,]+)/g;
function getParamNames(func) {
    var fnStr = func.toString().replace(STRIP_COMMENTS, '');
    var result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
    if (result === null)
        result = [];
    return result.map(function (p) { return p; });
}
function toType(prefix, name, obj, otherTypes) {
    if (obj instanceof Function) {
        var params = getParamNames(obj);
        var paramList = params.map(function (p) { return (p + " ?: any"); }).join(", ");
        return "(" + paramList + ") => any";
    }
    if (obj instanceof Object) {
        name = name.replace("_", "");
        name = name[0].toUpperCase() + name.substr(1);
        otherTypes.push({
            name: name,
            obj: obj
        });
        return prefix + name;
    }
    return typeof (obj);
}
function toDeclaration(name, obj, depth) {
    if (depth === void 0) { depth = 0; }
    if (depth > 2)
        return;
    var otherTypes = [];
    var out = "declare class " + name + " {\n";
    for (var _i = 0, _a = Object.keys(obj).concat(_.functions(obj)); _i < _a.length; _i++) {
        var key = _a[_i];
        out += "\t" + key + ": " + toType(name, key, obj[key], otherTypes) + ";\n";
    }
    out += "}";
    // console.log(obj);
    console.log(out);
    otherTypes = $.unique(otherTypes);
    while (otherTypes.length > 0) {
        var type = otherTypes.pop();
        type.name[0] = type.name[0].toUpperCase();
        toDeclaration(name + type.name, type.obj, depth + 1);
    }
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
    var geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
    var material = new THREE.MeshBasicMaterial({ color: '#ffffff', map: texture });
    var cube = new THREE.Mesh(geometry, material);
    cube.addBehaviors(altspace.utilities.behaviors.Object3DSync({ position: true }), altspace.utilities.behaviors.Spin({ speed: 0.0001 }), followPlayerBehaviour());
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
    });
}
function followPlayerBehaviour() {
    var object3d;
    var lastColor;
    var colorRef;
    var m_skeleton;
    var m_enclosure;
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
                m_enclosure = e;
            });
            altspace.getThreeJSTrackingSkeleton().then(function (skeleton) { return m_skeleton = skeleton; });
        }
    }
    function update(deltaTime) {
        if (m_skeleton) {
            object3d.position.copy(m_skeleton.trackingJoints.CenterHead0.position);
            object3d.position.x += 5;
        }
    }
    return { awake: awake, update: update };
}
;
//# sourceMappingURL=index.js.map