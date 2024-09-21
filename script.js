const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
const gravity = 0.7

canvas.width = 1024
canvas.height = 600

c.fillRect(0,0, canvas.width,canvas.height)
const background = new Sprite({
    position: {
        x:0,
        y:0
    },
    imageSrc: './img/bg.png'
})
const player = new Fighter({
    position:{
    x: 80,
    y: 200    
},
    velocity:{
    x: 0,
    y: 10
},
    color: 'black',
    offset: {
        x: 0,
        y: 0
    }})

const enemy = new Fighter({
    position:{
    x: 900,
    y: 200
},
    velocity:{
    x: 0,
    y: 10
    },
    color: 'red',
    offset: {
        x: -50,
        y: 0
    }
}
)

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    space: {
        pressed: false
    },
    k: {
        pressed: false
    }

}
let lastKey
let gameOver = false
let win = false
function EnemyAI(){
 






}


function Collision({rectangle1, rectangle2}) { 
    return (rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x &&
       rectangle1.attackBox.position.x <=rectangle2.position.x + rectangle2.width && 
       rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y && 
       rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height)
}
function animate(){
    if (gameOver || win){
        return
    }
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0,0,canvas.width,canvas.height)
    background.update()
    player.update()
    enemy.update() 
    EnemyAI()
    player.velocity.x = 0
    if (keys.a.pressed && lastKey === 'a'){
        player.velocity.x = -5
    }
    else if (keys.d.pressed && lastKey === 'd') {
        player.velocity.x = 5
    }
    else if (keys.space.pressed && player.onGround){
        
        player.velocity.y = -15
    }
    if (Collision({
        rectangle1: player,
        rectangle2: enemy
    }) && player.isAttacking){
        
        player.isAttacking = false
        console.log("player hit enemy")
        enemy.health -= 10
        if(enemy.health <= 0){
            GameOver(player, enemy)
        }
    }
    if (Collision({
        rectangle1: enemy,
        rectangle2: player
    }) && enemy.isAttacking){
        
        enemy.isAttacking = false
        console.log("enemy hit player")
    }

    player.attackCooldownUpdate()
    enemy.attackCooldownUpdate()

    drawHealthBar(20, 20, player.health, 'Player');
    drawHealthBar(canvas.width - 220, 20, enemy.health, 'Enemy');
    
    if (enemy.health <= 0)
        win = true
    else if (player.health <= 0)
        gameOver = true
    if (win){
        c.fillStyle = 'white'
        c.font = '40px Arial'
        c.fillText("Player Wins!! ", canvas.width / 2- 100, canvas.height /2 )
    }
    else if (gameOver){
        c.fillStyle = 'red'
        c.font = '40px Arial'
        c.fillText("You are Dead.", canvas.width / 2 - 100, canvas.height / 2)
        }
   
   
    
}
animate()
    window.addEventListener('keydown', (event) => {

        switch(event.key){
            case 'd':
                keys.d.pressed = true
                lastKey = 'd'
                break
            case 'a':
                keys.a.pressed = true
                lastKey = 'a'
                break
            case ' ':
                keys.space.pressed = true
                lastKey = "w"
                break
            case 'j':
                player.attack()
                
                break

            case 'k':
                keys.k.pressed = true
               
                break
            
        }
    })
    window.addEventListener('keyup', (event) => {

            switch(event.key){
                case 'd':
                    keys.d.pressed = false
                    break
                case 'a':
                    keys.a.pressed = false
                    break
                case ' ':
                    keys.space.pressed = false
                    break
            }
        console.log(event.key)

    })
    function drawHealthBar(x, y, health, name) {
        c.fillStyle = 'white';
        c.fillRect(x, y, 200, 20); // Background bar
        c.fillStyle = 'green';
        c.fillRect(x, y, health * 2, 20); // Actual health bar
        c.fillStyle = 'black';
        c.font = '16px Arial';
        c.fillText(`${name}: ${health}`, x + 5, y + 15); // Display health text
    }


    //Full screen
    const fullscreenButton = document.getElementById('fullscreenButton')
    fullscreenButton.addEventListener('click', () => {
        if(!document.fullscreenElement){
            canvas.requestFullscreen().catch(err => {
                alert("Error attempting to enable Full Screen")
            })
        } else {
            document.exitFullscreen()
        }
    })