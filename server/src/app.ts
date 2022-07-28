import { Socket } from 'socket.io'
import { ElementCluster, ElementName, PlayerAction, PlayerSlot } from '../../shared/shared'

const Express = require("express")()
const Http = require("http").Server(Express)
const Socketio = require("socket.io")(Http)

var game = {
    "player1": new ElementCluster(),
    "player2": new ElementCluster()
}

function toggleElement(playerSlot: PlayerSlot, element: ElementName): void {
    game[playerSlot][element] = !game[playerSlot][element]
}

Socketio.on("connection", (socket: Socket) => {
    console.log("Client connected")

    socket.on("submitAction", (data: {player: PlayerSlot, move: PlayerAction}) => {
        let enemy: PlayerSlot = data.player == 'player1' ? 'player2' : 'player1'
        toggleElement(enemy, data.move.attack1)
        toggleElement(enemy, data.move.attack2)
        toggleElement(data.player, data.move.defend)

        socket.emit("gameUpdate", game)
    })
})

Http.listen(3000, () => {
    console.log("Listening at :3000...")
})
