extends Path3D

@export var arrow_scene: PackedScene = preload("res://Scene/Arrow.tscn")
@export var arrow_spacing: float = 1.0 # Distance between arrows
@export var arrow_speed: float = 2.0 # Speed of arrow animation

var arrows: Array[Node3D] = []
var animation_offset: float = 0.0

func build_snake(path_points: PackedVector3Array) -> void:
	# Clear existing arrows
	clear_arrows()
	
	# Build a new Curve3D from waypoints
	var new_curve := Curve3D.new()
	for p in path_points:
		new_curve.add_point(p)
	self.curve = new_curve
	
	# Only proceed if we have a valid path
	if not curve or curve.get_point_count() < 2:
		return
		
	# Wait one frame to ensure curve is properly baked
	await get_tree().process_frame
	
	# Spawn arrows along the path
	spawn_arrows()

func clear_arrows() -> void:
	for arrow in arrows:
		if is_instance_valid(arrow):
			arrow.queue_free()
	arrows.clear()

func spawn_arrows() -> void:
	if not curve:
		return
		
	var path_length = curve.get_baked_length()
	if path_length <= 0:
		return
	
	# Calculate how many arrows we need
	var num_arrows = max(1, int(path_length / arrow_spacing))
	
	for i in range(num_arrows):
		var progress = float(i) * arrow_spacing
		if progress >= path_length:
			break
			
		# Create arrow instance
		if not arrow_scene:
			print("Warning: Arrow scene not loaded")
			return
			
		var arrow = arrow_scene.instantiate()
		add_child(arrow)
		arrows.append(arrow)
		
		# Position and rotate the arrow
		position_and_rotate_arrow(arrow, progress)

func position_and_rotate_arrow(arrow: Node3D, progress: float) -> void:
	var path_length = curve.get_baked_length()
	
	# Position the arrow
	var position = curve.sample_baked(progress)
	arrow.global_position = position
	
	# Calculate proper forward direction using curve tangent
	var forward_offset = min(0.5, path_length * 0.1) # Look ahead distance
	var next_progress = min(progress + forward_offset, path_length)
	
	# Get the direction from curve derivative (tangent)
	var direction: Vector3
	if next_progress > progress:
		var next_position = curve.sample_baked(next_progress)
		direction = (next_position - position).normalized()
	else:
		# Fallback to curve derivative at this point
		direction = curve.sample_baked_with_rotation(progress, false).basis.z
	
	if direction.length() > 0.01:
		# Try different rotation methods - uncomment the one that works:
		# Method 1: Standard look_at with 90-degree rotation (try this first)
		arrow.look_at(position + direction, Vector3.UP)
		arrow.rotation_degrees.x -= 90 # Rotate down 90 degrees
		
		# Method 2: If Method 1 doesn't work, comment out Method 1 and try this:
		# arrow.look_at(position + direction, Vector3.UP)
		# arrow.rotation_degrees.z += 90  # Rotate around Z axis
		
		# Method 3: If arrow points backward, try this:
		# arrow.look_at(position - direction, Vector3.UP)
		# arrow.rotation_degrees.x -= 90
		
		# Method 4: Custom basis (if all above fail):
		# var up = Vector3.UP
		# var right = direction.cross(up).normalized()
		# if right.length() < 0.01:
		#     right = Vector3.RIGHT
		#     up = Vector3.FORWARD
		# else:
		#     up = right.cross(direction).normalized()
		# arrow.transform.basis = Basis(right, direction, up)

func _process(delta: float) -> void:
	# Animate arrows moving along the path
	animation_offset += arrow_speed * delta
	update_arrow_positions()

func update_arrow_positions() -> void:
	if not curve or arrows.is_empty():
		return
		
	var path_length = curve.get_baked_length()
	if path_length <= 0:
		return
	
	for i in range(arrows.size()):
		var arrow = arrows[i]
		if not is_instance_valid(arrow):
			continue
			
		# Calculate animated position
		var base_progress = float(i) * arrow_spacing
		var animated_progress = fmod(base_progress + animation_offset, path_length)
		
		# Position and rotate the arrow
		position_and_rotate_arrow(arrow, animated_progress)
