extends CharacterBody3D

@onready var nav_agent: NavigationAgent3D = $NavigationAgent3D
@onready var path_drawer: Path3D = $Path3D
@export var move_speed: float = 5.0

func _ready():
	# Wait for navigation to be ready
	call_deferred("setup_navigation")

func setup_navigation():
	# Connect navigation layers if needed
	nav_agent.navigation_layers = 1 # Use layer 1 for navigation

func _unhandled_input(event: InputEvent) -> void:
	if event is InputEventMouseButton:
		if event.button_index == MOUSE_BUTTON_LEFT and event.pressed:
			var target = get_mouse_world_position(event.position)
			if target != Vector3.ZERO:
				show_path_to(target)

func get_mouse_world_position(mouse_pos: Vector2) -> Vector3:
	var camera = get_viewport().get_camera_3d()
	if not camera:
		print("No camera found!")
		return Vector3.ZERO
	
	# Cast a ray from the camera through the mouse position
	var from = camera.project_ray_origin(mouse_pos)
	var to = from + camera.project_ray_normal(mouse_pos) * 1000.0
	
	# Perform raycast to find where the ray hits the world
	var space_state = get_world_3d().direct_space_state
	var query = PhysicsRayQueryParameters3D.create(from, to)
	query.exclude = [self] # Don't hit the character itself
	
	var result = space_state.intersect_ray(query)
	
	if result:
		return result.position
	else:
		# If no collision, try to project onto different Y levels
		# First try current level
		var plane = Plane(Vector3.UP, global_position.y)
		var intersection = plane.intersects_ray(from, to - from)
		if intersection:
			return intersection
		
		# Try floor 1 level (Y = 0.5)
		plane = Plane(Vector3.UP, 0.5)
		intersection = plane.intersects_ray(from, to - from)
		if intersection:
			return intersection
		
		# Try floor 2 level (Y = 3.5, which is 0.5 + 2.92)
		plane = Plane(Vector3.UP, 3.5)
		intersection = plane.intersects_ray(from, to - from)
		if intersection:
			return intersection
		
		return Vector3.ZERO

func _physics_process(_delta: float) -> void:
	# If we have no more waypoints, bail out
	if nav_agent.is_navigation_finished():
		velocity = Vector3.ZERO
		move_and_slide()
		return

	# Move toward the next waypoint
	var next_point: Vector3 = nav_agent.get_next_path_position()
	var dir: Vector3 = (next_point - global_position).normalized()
	velocity = dir * move_speed
	move_and_slide()

func show_path_to(target: Vector3) -> void:
	# Set the target for the navigation agent
	nav_agent.target_position = target
	
	# Optional: Make camera follow this NPC
	var camera = get_viewport().get_camera_3d()
	if camera and camera.has_method("focus_on_object"):
		camera.focus_on_object(self)
	
	# Get all navigation maps in the scene
	var maps = NavigationServer3D.get_maps()
	
	# Try to find a path using the default navigation map
	var raw_path: PackedVector3Array
	
	if maps.size() > 0:
		# Use the first available navigation map
		raw_path = NavigationServer3D.map_get_path(
			maps[0],
			global_position,
			target,
			true # optimize path
		)
	else:
		print("No navigation maps found!")
		return
	
	# If we got a valid path, show it
	if raw_path.size() > 0:
		path_drawer.build_snake(raw_path)
		print("Path found with ", raw_path.size(), " points")
		print("From: ", global_position, " To: ", target)
	else:
		print("No path found from ", global_position, " to ", target)
