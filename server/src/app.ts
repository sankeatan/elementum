import { Socket } from 'socket.io'
import { Board, BoardState, ElementName, PlayerMove, PlayerName, startBoard } from '../../shared/shared'

const Express = require("express")()
const Http = require("http").Server(Express)
const Socketio = require("socket.io")(Http)

var game = startBoard()

function toggleElement(board: PlayerName, element: ElementName): void {
    game[board][element] = !game[board][element]
}

Socketio.on("connection", (socket: Socket) => {
    socket.on("playCards", (data: {player: PlayerName, move: PlayerMove}) => {

        let enemy: PlayerName = data.player == 'board1' ? 'board2' : 'board1'
        toggleElement(enemy, data.move.attack1)
        toggleElement(enemy, data.move.attack2)
        toggleElement(data.player, data.move.defend)

        socket.emit("gameUpdate", game)
    })
})

Http.listen(3000, () => {
    console.log("Listening at :3000...")
})
