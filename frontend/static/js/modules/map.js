/**
 * 3D Map Module
 * Handles Three.js 3D map initialization and route visualization
 */

class MapManager {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.currentRoute = null;
    }

    /**
     * Initialize 3D map
     */
    init() {
        const container = document.getElementById('map-container');
        if (!container) {
            console.warn('Map container not found');
            return;
        }

        // Scene setup
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(this.renderer.domElement);

        // Add ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        // Add directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(0, 1, 0);
        this.scene.add(directionalLight);

        // Add a simple floor
        const floorGeometry = new THREE.PlaneGeometry(10, 10);
        const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 });
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.rotation.x = -Math.PI / 2;
        this.scene.add(floor);

        // Position camera
        this.camera.position.set(5, 5, 5);
        this.camera.lookAt(0, 0, 0);

        // Start animation loop
        this.animate();
    }

    /**
     * Animation loop
     */
    animate() {
        requestAnimationFrame(() => this.animate());
        this.renderer.render(this.scene, this.camera);
    }

    /**
     * Visualize route on the 3D map
     * @param {Object} routeData - Route data from API
     */
    visualizeRoute(routeData) {
        // Clear any existing route
        this.clearRoute();

        // Check if we have valid route data
        if (!routeData || !routeData.features || routeData.features.length === 0) {
            console.error('No valid route data');
            return;
        }

        try {
            // Get the coordinates from the GeoJSON
            const coordinates = routeData.features[0].geometry.coordinates;

            // Create a line geometry
            const points = [];
            for (let i = 0; i < coordinates.length; i++) {
                const [x, y, z] = coordinates[i];
                points.push(new THREE.Vector3(x, z || 0, y)); // Note the switching of y and z for THREE.js
            }

            const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
            const lineMaterial = new THREE.LineBasicMaterial({ color: 0x0066ff, linewidth: 4 });
            const routeLine = new THREE.Line(lineGeometry, lineMaterial);

            // Add the route to the scene
            this.scene.add(routeLine);

            // Move camera to view the route
            this.fitCameraToRoute(points);

            // Set this as the current route
            this.currentRoute = routeLine;
        } catch (error) {
            console.error('Error visualizing route:', error);
        }
    }

    /**
     * Clear current route from map
     */
    clearRoute() {
        if (this.currentRoute) {
            this.scene.remove(this.currentRoute);
            this.currentRoute = null;
        }
    }

    /**
     * Adjust camera to see the entire route
     * @param {THREE.Vector3[]} points - Route points
     */
    fitCameraToRoute(points) {
        if (!points || points.length === 0) return;

        // Calculate the center of the route
        const center = new THREE.Vector3();
        points.forEach(point => {
            center.add(point);
        });
        center.divideScalar(points.length);

        // Position camera to look at the center from an angle
        this.camera.position.set(center.x + 5, center.y + 5, center.z + 5);
        this.camera.lookAt(center);
    }

    /**
     * Handle window resize
     */
    handleResize() {
        const container = document.getElementById('map-container');
        if (!container || !this.camera || !this.renderer) return;

        this.camera.aspect = container.clientWidth / container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(container.clientWidth, container.clientHeight);
    }
}

// Export the Map manager instance
window.MapManager = MapManager;