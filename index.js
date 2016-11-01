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
// sim.camera.position.z = 5;
var config = { authorId: 'whatisjason', appId: 'TwoRooms' };
var sceneSync;
var sim;
altspace.utilities.sync.connect(config).then(function (connection) {
    sim = altspace.utilities.Simulation();
    sceneSync = altspace.utilities.behaviors.SceneSync(connection.instance, {
        instantiators: { 'Cube': createCube },
        ready: ready
    });
    sim.scene.addBehavior(sceneSync);
});
function createCube(args) {
    var url = './examples/models/cube/altspace-logo.jpg';
    var texture = new THREE.TextureLoader().load(url);
    var geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
    var material = new THREE.MeshBasicMaterial({ color: '#ffffff', map: texture });
    var cube = new THREE.Mesh(geometry, material);
    cube.addBehaviors(altspace.utilities.behaviors.Object3DSync({
        position: true,
        scale: true,
        rotation: true
    }), altspace.utilities.behaviors.Spin({ speed: 0.0001 }));
    altspace.getUser().then(function (user) {
        if (user.userId == args.user) {
            cube.addBehavior(new FollowPlayerBehaviour());
        }
    });
    cube.position.set(0, 0, 0);
    sim.scene.add(cube);
    return cube;
}
function ready(firstInstance) {
    console.log("ready! " + firstInstance);
    altspace.getUser().then(function (user) { return sceneSync.instantiate('Cube', { user: user.userId }); });
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
        obj.position.y = 0;
        obj.position.z = 0;
    });
    altspace.getThreeJSTrackingSkeleton().then(function (skeleton) { return loadBomb(skeleton.trackingJoints.CenterHead0.position); });
}
function loadBomb(pos) {
    var loader = new THREE.JSONLoader();
    loader.load("./res/bomb.json", function (geo, mats) {
        var material = new THREE.MeshLambertMaterial({ map: THREE.ImageUtils.loadTexture("./res/bomb.png") });
        var obj = new THREE.Mesh(geo, material);
        sim.scene.add(obj);
        obj.position.copy(pos);
        obj.position.x += 10;
        obj.scale.set(10, 10, 10);
    });
}
var FollowPlayerBehaviour = (function () {
    function FollowPlayerBehaviour() {
    }
    FollowPlayerBehaviour.prototype.awake = function (o) {
        var _this = this;
        this.object3d = o;
        var sync = this.object3d.getBehaviorByType("Object3DSync");
        if (altspace && altspace.inClient) {
            altspace.getEnclosure().then(function (e) {
                // scale cube so it's 1 meter in Altspace
                _this.object3d.scale.multiplyScalar(e.pixelsPerMeter);
                _this.enclosure = e;
            });
            altspace.getThreeJSTrackingSkeleton().then(function (skeleton) { return _this.skeleton = skeleton; });
        }
    };
    FollowPlayerBehaviour.prototype.update = function (dt) {
        if (this.skeleton) {
            var target = this.skeleton.trackingJoints.CenterHead0.position.clone();
            var toTarget = target.clone().sub(this.object3d.position);
            if (toTarget.length() > 5) {
                toTarget.clampLength(0, dt * 0.1);
                this.object3d.position.add(toTarget);
            }
        }
    };
    return FollowPlayerBehaviour;
}());
//# sourceMappingURL=index.js.map