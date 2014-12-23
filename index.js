var Keyboard = require('game-keyboard');
var keyMap = require("game-keyboard/key_map")["US"];
var PointerTrap = require('pointer-trap-relative');
var Mousewheel = require('input-mousewheel');
function FPSCameraController(camera, element, options) {
	this.camera = camera;
	this.keyboard = new Keyboard(keyMap);
	this.movementSpeed = .1;
	this.rotationSpeed = .001;
	this.minFov = 10;
	this.maxFov = 100;
	this.pointerTrap = new PointerTrap(element);
	var _this = this;
	this.pointerTrap.on('data', function(pos) {
		_this.camera.rotateY(pos.x * -_this.rotationSpeed);
		_this.camera.rotateX(pos.y * -_this.rotationSpeed);
	})
	var zoomSpeed = .1;
	Mousewheel.onMouseWheelSignal.add(function(val) {
		var zoom = val * .001;
		var fov = _this.camera.fov;
		fov *= (1+zoom);
		fov = Math.min(_this.maxFov, Math.max(_this.minFov, fov))
		_this.camera.fov = fov;
		_this.camera.updateProjectionMatrix();
	});
}

FPSCameraController.prototype = {
	update: function() {
		if(this.keyboard.isPressed('a')) {
			this.camera.translateX(-this.movementSpeed);
		}
		if(this.keyboard.isPressed('d')) {
			this.camera.translateX(this.movementSpeed);
		}
		if(this.keyboard.isPressed('w')) {
			this.camera.translateZ(-this.movementSpeed);
		}
		if(this.keyboard.isPressed('s')) {
			this.camera.translateZ(this.movementSpeed);
		}
		if(this.keyboard.isPressed('left')) {
			this.camera.rotateY(this.rotationSpeed);
		}
		if(this.keyboard.isPressed('right')) {
			this.camera.rotateY(-this.rotationSpeed);
		}
		if(this.keyboard.isPressed('up')) {
			this.camera.rotateX(this.rotationSpeed);
		}
		if(this.keyboard.isPressed('down')) {
			this.camera.rotateX(-this.rotationSpeed);
		}
	}
}

module.exports = FPSCameraController;