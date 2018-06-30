var three = require('three');
var View = require('threejs-managed-view').View;
var CameraControllerFPS = require('./');
var view = new View({
	useRafPolyfill: false
});
var scene = view.scene;

var sphereGeometry = new three.SphereGeometry(1.5);
var size = 500;
var sizeHalf = size * .5;
var bounds = new three.Box3(
	new three.Vector3(-sizeHalf, -sizeHalf, -sizeHalf),
	new three.Vector3(sizeHalf, sizeHalf, sizeHalf)
)
var random = new three.Vector3();
var boundSize = bounds.size();
for (var i = 0; i < 1200; i++) {
	var ball = new three.Mesh(sphereGeometry);
	scene.add(ball);
	random.set(
		Math.random(),
		Math.random(),
		Math.random()
	);
	ball.position.copy(bounds.min).add(random.multiply(boundSize));
};

var fpsController = new CameraControllerFPS(view.camera, view.canvasContainer);

fpsController.onPointerLockAttainSignal.add(function(){
	console.log('attained pointerlock');
})
fpsController.onPointerLockReleaseSignal.add(function(){
	console.log('released pointerlock');
})

view.renderManager.onEnterFrame.add(function() {
	fpsController.update();
})
