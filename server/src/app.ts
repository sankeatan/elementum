import { Player, GameState, ElementName } from '../../shared/shared'

const Express = require("express")()
const Http = require("http").Server(Express)
const Socketio = require("socket.io")(Http)

var position = {
    x: 200,
    y: 200
}

var game: GameState = {
    player1: {
      fire: false,
      water: false,
      earth: false,
      electricity: false,
      nether: false,
    },
    player2: {
      fire: false,
      water: false,
      earth: false,
      electricity: false,
      nether: false,
    }
  }

Socketio.on("connection", socket => {
    socket.emit("position", position)
    socket.on("move", data => {
        switch(data) {
            case "up": position.y -= 5; break
            case "down": position.y += 5; break
            case "left": position.x -= 5; break
            case "right": position.x += 5; break
        }

        Socketio.emit("position", position)
    })
})

Socketio.on("playCards", (player: Player, attack1: ElementName, attack2: ElementName, defend: ElementName) => {
    if(player == 'player1'){
        switch(defend){
            case 'fire': game.player1.fire = !game.player1.fire; break
            case 'water': game.player1.water = !game.player1.water; break
            case 'earth': game.player1.earth = !game.player1.earth; break
            case 'electricity': game.player1.electricity = !game.player1.electricity; break
            case 'nether': game.player1.nether = !game.player1.nether; break
        }
        switch(attack1){
            case 'fire': game.player2.fire = !game.player2.fire; break
            case 'water': game.player2.water = !game.player2.water; break
            case 'earth': game.player2.earth = !game.player2.earth; break
            case 'electricity': game.player2.electricity = !game.player2.electricity; break
            case 'nether': game.player2.nether = !game.player2.nether; break
        }
        switch(attack2){
            case 'fire': game.player2.fire = !game.player2.fire; break
            case 'water': game.player2.water = !game.player2.water; break
            case 'earth': game.player2.earth = !game.player2.earth; break
            case 'electricity': game.player2.electricity = !game.player2.electricity; break
            case 'nether': game.player2.nether = !game.player2.nether; break
        }
    } else {
        switch(defend){
            case 'fire': game.player2.fire = !game.player2.fire; break
            case 'water': game.player2.water = !game.player2.water; break
            case 'earth': game.player2.earth = !game.player2.earth; break
            case 'electricity': game.player2.electricity = !game.player2.electricity; break
            case 'nether': game.player2.nether = !game.player2.nether; break
        }
        switch(attack1){
            case 'fire': game.player1.fire = !game.player1.fire; break
            case 'water': game.player1.water = !game.player1.water; break
            case 'earth': game.player1.earth = !game.player1.earth; break
            case 'electricity': game.player1.electricity = !game.player1.electricity; break
            case 'nether': game.player1.nether = !game.player1.nether; break
        }
        switch(attack2){
            case 'fire': game.player1.fire = !game.player1.fire; break
            case 'water': game.player1.water = !game.player1.water; break
            case 'earth': game.player1.earth = !game.player1.earth; break
            case 'electricity': game.player1.electricity = !game.player1.electricity; break
            case 'nether': game.player1.nether = !game.player1.nether; break
        }
    }
})

Http.listen(3000, () => {
    console.log("Listening at :3000...")
})
