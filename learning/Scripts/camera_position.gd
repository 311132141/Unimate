extends Node3D


@onready var rotation_x: Node3D = $CameraRotationX
@onready var zoom_pivot: Node3D = $CameraRotationX/CameraZoomPivot
@onready var camera: Camera3D = $CameraRotationX/CameraZoomPivot/Camera3D


var move_speed = 0.6
var move_target: Vector3
var rotate_keys_speed = 1.5
var rotate_keys_target: float
var zoom_speed = 3.0
var zoom_target: float
var min_zoom = -20.0
var max_zoom = 20.0
var mouse_sensitivity = 0.2

func _ready() -> void:
	move_target = position
	rotate_keys_target = rotation_degrees.y
	zoom_target = camera.position.z
	
func _unhandled_input(event: InputEvent) -> void:
	if event is InputEventMouseMotion and Input.is_action_pressed("rotate_mouse"):
		rotate_keys_target -= event.relative.x * mouse_sensitivity
		rotation_x.rotation_degrees.x -= event.relative.y * mouse_sensitivity
		rotation_x.rotation_degrees.x = clamp(rotation_x.rotation_degrees.x, -10, 30)

func _process(delta: float) -> void:
	# get input directions
	var input_direction = Input.get_vector("left", "right", "up", "down")
	var movement_direction = (transform.basis * Vector3(input_direction.x, 0, input_direction.y)).normalized()
	var rotate_keys = Input.get_axis("rotate_left", "rotate_right")
	var zoom_dir = (int(Input.is_action_just_released("camera_zoom_in")) - int(Input.is_action_just_released("camera_zoom_out")))
	var up_input = int(Input.is_action_pressed("fly_up"))
	var down_input = int(Input.is_action_pressed("fly_down"))


	move_target += movement_direction * move_speed
	move_target.y += (up_input - down_input) * move_speed
	rotate_keys_target += rotate_keys * rotate_keys_speed
	zoom_target += zoom_dir * zoom_speed
	
	position = lerp(position, move_target, 0.10)
	rotation_degrees.y = lerp(rotation_degrees.y, rotate_keys_target, 0.10)
	camera.position.z = lerp(camera.position.z, zoom_target, 0.10)
