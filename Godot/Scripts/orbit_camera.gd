extends Camera3D

# Camera settings
@export var target: Vector3 = Vector3.ZERO # Point to orbit around
@export var distance: float = 10.0 # Distance from target
@export var min_distance: float = 2.0 # Minimum zoom distance
@export var max_distance: float = 50.0 # Maximum zoom distance
@export var zoom_speed: float = 1.0 # Speed of zooming
@export var rotation_speed: float = 2.0 # Speed of rotation
@export var smooth_time: float = 0.1 # Smoothing for camera movement

# Camera angles
var pitch: float = -20.0 # Up/down rotation (degrees)
var yaw: float = 0.0 # Left/right rotation (degrees)
var min_pitch: float = -80.0 # Minimum pitch angle
var max_pitch: float = 80.0 # Maximum pitch angle

# Input states
var is_rotating: bool = false
var last_mouse_position: Vector2

func _ready():
	# Set initial camera position
	update_camera_position()

func _unhandled_input(event: InputEvent) -> void:
	# Handle mouse rotation (right mouse button)
	if event is InputEventMouseButton:
		if event.button_index == MOUSE_BUTTON_RIGHT:
			is_rotating = event.pressed
			if event.pressed:
				last_mouse_position = event.position
			# Don't consume the event so navigation still works
	
	# Handle mouse movement for rotation
	elif event is InputEventMouseMotion and is_rotating:
		var delta_mouse = event.position - last_mouse_position
		
		# Update rotation angles
		yaw -= delta_mouse.x * rotation_speed * 0.01
		pitch -= delta_mouse.y * rotation_speed * 0.01
		
		# Clamp pitch to prevent camera flipping
		pitch = clamp(pitch, min_pitch, max_pitch)
		
		last_mouse_position = event.position
		update_camera_position()
	
	# Handle mouse wheel for zooming
	elif event is InputEventMouseButton:
		if event.button_index == MOUSE_BUTTON_WHEEL_UP:
			distance = clamp(distance - zoom_speed, min_distance, max_distance)
			update_camera_position()
		elif event.button_index == MOUSE_BUTTON_WHEEL_DOWN:
			distance = clamp(distance + zoom_speed, min_distance, max_distance)
			update_camera_position()

func _process(_delta: float) -> void:
	# Handle keyboard controls for movement (WASD to move target)
	var input_vector = Vector3.ZERO
	
	if Input.is_action_pressed("ui_up") or Input.is_key_pressed(KEY_W):
		input_vector.z -= 1
	if Input.is_action_pressed("ui_down") or Input.is_key_pressed(KEY_S):
		input_vector.z += 1
	if Input.is_action_pressed("ui_left") or Input.is_key_pressed(KEY_A):
		input_vector.x -= 1
	if Input.is_action_pressed("ui_right") or Input.is_key_pressed(KEY_D):
		input_vector.x += 1
	
	# Move the target point
	if input_vector.length() > 0:
		input_vector = input_vector.normalized()
		target += input_vector * 5.0 * _delta # 5 units per second
		update_camera_position()

func update_camera_position():
	# Convert spherical coordinates to cartesian
	var rad_pitch = deg_to_rad(pitch)
	var rad_yaw = deg_to_rad(yaw)
	
	# Calculate camera position relative to target
	var camera_offset = Vector3(
		cos(rad_pitch) * sin(rad_yaw),
		sin(rad_pitch),
		cos(rad_pitch) * cos(rad_yaw)
	) * distance
	
	# Set camera position and look at target
	global_position = target + camera_offset
	look_at(target, Vector3.UP)

# Function to set a new target to orbit around
func set_target(new_target: Vector3):
	target = new_target
	update_camera_position()

# Function to focus on a specific object
func focus_on_object(object: Node3D):
	if object:
		set_target(object.global_position)
