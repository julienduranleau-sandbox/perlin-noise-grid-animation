class Game {
    constructor() {
        this.scene = new THREE.Scene()
        this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 250)
        this.renderer = new THREE.WebGLRenderer({ antialias: true })
        this.orbit = new THREE.OrbitControls(this.camera, this.renderer.domElement)
        this.stats = new Stats()

        this.planeMesh = null
        this.lights = null
        this.nCols = 128
        this.nRows = 128
        this.planeWidth = 128
        this.planeHeight = 64
        this.sharpness = 0.02
        this.scale = 40
        this.scrollSpeed = 0.015

        this.camera.position.x = 0
        this.camera.position.y = -30
        this.camera.position.z = 30
        this.camera.rotation.x = Math.PI * 0.3
        this.yoff = 0

        this.shaderUniforms = {
        	yoff: {value: Math.random() * 1000}
        }

        this.renderer.setSize(window.innerWidth, window.innerHeight)
		this.renderer.setPixelRatio(window.devicePixelRatio)
		this.renderer.setClearColor(0x000000, 1)

		this.orbit.enableZoom = false;

        document.body.appendChild(this.renderer.domElement)
        document.body.appendChild(this.stats.dom)

        window.addEventListener('resize', () => this.windowResize(), false)

        this.initGeometry()
        this.render()
    }

    windowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight
        this.camera.updateProjectionMatrix()

        this.renderer.setSize(window.innerWidth, window.innerHeight)
    }

    initGeometry() {

        let planeGeometry = new THREE.PlaneGeometry(this.planeWidth, this.planeHeight, this.nCols - 1, this.nRows - 1)
        var geometry = new THREE.BufferGeometry().fromGeometry( planeGeometry );

        let material = new THREE.ShaderMaterial({
            uniforms: this.shaderUniforms,
        	vertexShader: document.getElementById('vertexShader').textContent,
        	fragmentShader: document.getElementById('fragmentShader').textContent,
            transparent: true
        });

        this.planeMesh = new THREE.Mesh(geometry, material)
		this.scene.add(this.planeMesh)
    }

    updateGeometry() {
        this.shaderUniforms.yoff.value += this.scrollSpeed
    }

    render() {
    	requestAnimationFrame(() => this.render())
        this.updateGeometry()
    	this.renderer.render(this.scene, this.camera)
        this.stats.update()
    }
}
