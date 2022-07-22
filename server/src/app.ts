import { Socket } from 'socket.io'
import { Player, GameState, ElementName, PlayerMove, PlayerName } from '../../shared/shared'

const Express = require("express")()
const Http = require("http").Server(Express)
const Socketio = require("socket.io")(Http)

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

function toggleElement(player: PlayerName, element: ElementName): void {
    game[player][element] = !game[player][element];
}

Socketio.on("connection", (socket: Socket) => {
    socket.on("playCards", (data: {player: PlayerName, move: PlayerMove}) => {
        console.log(data)

        let enemy: PlayerName = data.player == 'player1' ? 'player2' : 'player1'
        toggleElement(enemy, data.move.attack1)
        toggleElement(enemy, data.move.attack2)
        toggleElement(data.player, data.move.defend)

        console.log(game)
        socket.emit("gameUpdate", game);
    })
})

Http.listen(3000, () => {
    console.log("Listening at :3000...")
})
