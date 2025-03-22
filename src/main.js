import * as THREE from 'three'

const scene = new THREE.Scene()
scene.background = new THREE.Color(0x333333)

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)
camera.position.set(0, 0, 20)

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
directionalLight.position.set(0, 10, 10)
scene.add(directionalLight)

// Game settings
const gameAreaWidth = 10
const gameAreaHeight = 15
let score = 0
let gameOver = false

// Create the player cube
const playerGeometry = new THREE.BoxGeometry(1, 1, 1)
const playerMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff00 })
const player = new THREE.Mesh(playerGeometry, playerMaterial)
player.position.set(0, -gameAreaHeight / 2 + 1, 0)
scene.add(player)

// Movement variables
let moveDirection = 0
const playerSpeed = 0.2

// Obstacles setup
const obstacles = []
const obstacleGeometry = new THREE.BoxGeometry(1, 1, 1)
const obstacleMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 })
let obstacleSpeed = 0.05
const spawnInterval = 1000 // in milliseconds

function spawnObstacle() {
  const obstacle = new THREE.Mesh(obstacleGeometry, obstacleMaterial)
  const x = (Math.random() - 0.5) * gameAreaWidth
  obstacle.position.set(x, gameAreaHeight / 2 + 1, 0)
  scene.add(obstacle)
  obstacles.push(obstacle)
}

// Collision detection using bounding boxes
const playerBox = new THREE.Box3().setFromObject(player)
function checkCollisions() {
  playerBox.setFromObject(player)
  for (let i = 0; i < obstacles.length; i++) {
    const obstacleBox = new THREE.Box3().setFromObject(obstacles[i])
    if (playerBox.intersectsBox(obstacleBox)) {
      gameOver = true
    }
  }
}

// Update score overlay
const overlay = document.getElementById('overlay')
function updateOverlay() {
  overlay.innerText = gameOver ? `Game Over! Final Score: ${score}` : `Score: ${score}`
}

// Player control
window.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') moveDirection = 1
  else if (e.key === 'ArrowLeft') moveDirection = -1
})

window.addEventListener('keyup', (e) => {
  if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') moveDirection = 0
})

// Spawn obstacles at intervals
setInterval(() => {
  if (!gameOver) spawnObstacle()
}, spawnInterval)

// Main animation loop
function animate() {
  if (gameOver) {
    updateOverlay()
    renderer.render(scene, camera)
    return
  }
  
  requestAnimationFrame(animate)

  // Move player and clamp within bounds
  player.position.x += moveDirection * playerSpeed
  if (player.position.x < -gameAreaWidth / 2 + 0.5) {
    player.position.x = -gameAreaWidth / 2 + 0.5
  }
  if (player.position.x > gameAreaWidth / 2 - 0.5) {
    player.position.x = gameAreaWidth / 2 - 0.5
  }

  // Update obstacles
  for (let i = obstacles.length - 1; i >= 0; i--) {
    obstacles[i].position.y -= obstacleSpeed;
    if (obstacles[i].position.y < -gameAreaHeight / 2 - 1) {
      scene.remove(obstacles[i])
      obstacles.splice(i, 1)
      score++
      obstacleSpeed = 0.05 + score * 0.005
    }
  }

  checkCollisions()
  updateOverlay()
  renderer.render(scene, camera)
}

animate()

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
});