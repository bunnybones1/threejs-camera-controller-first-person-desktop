var Keyboard = require('game-keyboard');
var keyMap = require("game-keyboard/key_map")["US"];
var MouseWheel = require('input-mousewheel');
var defined = require('defined');
function FPSCameraController(camera, element, options) {
	options = options || {};
	var _camera = camera;
	var _keyboard = new Keyboard(keyMap);
	var _mouseWheel = new MouseWheel(element);

	var _onChangedCallback = options.onChangedCallback;
	var _movementSpeed = defined(options.movementSpeed, .1);
	var _movementRunSpeedScale = defined(options.movementRunSpeedScale, 2.5);
	var _rotationSpeed = defined(options.rotationSpeed, .005);
	var _minFov = defined(options.minFov, 10);
	var _maxFov = defined(options.maxFov, 100);
	var _zoomSpeed = defined(options.zoomSpeed, .001);
	var _yUp = defined(options.yUp, true);
	var _rotateActive = defined(options.rotateActive, false);
	var _rotateActiveOnlyInPointerLock = defined(options.rotateActiveOnlyInPointerLock, true);
	var _arrowKeysRotate = defined(options.arrowKeysRotate, false);
	var _movementSpeedScale = 1;
	if(!_rotateActiveOnlyInPointerLock) _rotateActive = true;
	
	var rotated, moved, _lookAtTarget;

	function onMouseMove(e) {
		if(_rotateActive) {
			_camera.rotateY(e.movementX * -_rotationSpeed);
			_camera.rotateX(e.movementY * -_rotationSpeed);
			if(_yUp) {
				uprightCamera();
			}
			rotated = true;
		}
	}
	function onLockChanged() {
		_rotateActive = document.pointerLockElement === element;
	}
	document.addEventListener("mousemove", onMouseMove, false);
	if (_rotateActiveOnlyInPointerLock) {
		document.addEventListener('pointerlockchange', onLockChanged, false);
	}
	//mouse
	var _lock = function() {
		if(!document.pointerLockElement) {
			element.requestPointerLock()
		}
	}
	var _unlock = function() {
		document.exitPointerLock();
	};


	var zoom, fov;
	function zoomOnMouseWheel(val) {
		zoom = val * _zoomSpeed;
		fov = _camera.fov;
		fov *= (1+zoom);
		fov = Math.min(_maxFov, Math.max(_minFov, fov))
		_camera.fov = fov;
		_camera.updateProjectionMatrix();
		if(_onChangedCallback) _onChangedCallback();
	}
	//mouse wheel
	_mouseWheel.onWheelSignal.add(zoomOnMouseWheel);

	//yUp
	if(_yUp) {
		_lookAtTarget = _camera.clone();
	}

	function update() {
		if(_keyboard.isPressed('shift')) {
			_movementSpeedScale = _movementRunSpeedScale;
		} else {
			_movementSpeedScale = 1;
		}
		if(_keyboard.isPressed('a')) {
			moved = true;
			_camera.translateX(-_movementSpeed * _movementSpeedScale);
		}
		if(_keyboard.isPressed('d')) {
			moved = true;
			_camera.translateX(_movementSpeed * _movementSpeedScale);
		}
		if(_keyboard.isPressed('w')) {
			moved = true;
			_camera.translateZ(-_movementSpeed * _movementSpeedScale);
		}
		if(_keyboard.isPressed('s')) {
			moved = true;
			_camera.translateZ(_movementSpeed * _movementSpeedScale);
		}
		if(_keyboard.isPressed('e')) {
			moved = true;
			_camera.position.y += (_movementSpeed * _movementSpeedScale);
		}
		if(_keyboard.isPressed('q')) {
			moved = true;
			_camera.position.y += (-_movementSpeed * _movementSpeedScale);
		}
		if(_arrowKeysRotate) {
			if(_keyboard.isPressed('left')) {
				_camera.rotateY(_rotationSpeed);
				rotated = true;
			}
			if(_keyboard.isPressed('right')) {
				_camera.rotateY(-_rotationSpeed);
				rotated = true;
			}
			if(_keyboard.isPressed('up')) {
				_camera.rotateX(_rotationSpeed);
				rotated = true;
			}
			if(_keyboard.isPressed('down')) {
				_camera.rotateX(-_rotationSpeed);
				rotated = true;
			}
			if(rotated && _yUp) {
				uprightCamera();
			}
		}
		if((moved || rotated) && _onChangedCallback) {
			_onChangedCallback();
			moved = rotated = false;
		}
	}

	function uprightCamera() {
		_lookAtTarget.position.copy(_camera.position);
		_lookAtTarget.rotation.copy(_camera.rotation);
		_lookAtTarget.translateZ(-1);
		_camera.lookAt(_lookAtTarget.position);
	}
	//public
	this.lock = _lock;
	this.unlock = _unlock;
	this.update = update;

	Object.defineProperty(this, 'keyboard', {
		get: function() { return _keyboard; }
	});
	Object.defineProperty(this, 'movementSpeed', {
		get: function() { return _movementSpeed; },
		set: function(val) { _movementSpeed = val; }
	});
	Object.defineProperty(this, 'rotationSpeed', {
		get: function() { return _rotationSpeed; },
		set: function(val) { _rotationSpeed = val; }
	});
	Object.defineProperty(this, 'zoomSpeed', {
		get: function() { return _zoomSpeed; },
		set: function(val) { _zoomSpeed = val; }
	});
}

module.exports = FPSCameraController;
