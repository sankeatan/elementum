import { Socket } from 'socket.io'
import { CardType, ElementCluster, ElementName, PlayerAction, PlayerSlot } from '../../shared/shared'

const Express = require("express")()
const Http = require("http").Server(Express)
const Socketio = require("socket.io")(Http)

var game = {
    "player1": new ElementCluster(),
    "player2": new ElementCluster()
}

function toggleElement(playerSlot: PlayerSlot, cardType: CardType): void {
    try {
        game[playerSlot][cardType] = !game[playerSlot][cardType]
    }
    catch (e) {
        console.error(`Failed to toggle ${playerSlot}: ${cardType}`)
    }
}

Socketio.on("connection", (socket: Socket) => {
    console.log("Client connected")

    socket.on("submitAction", (data: {playerSlot: PlayerSlot, playerAction: PlayerAction}) => {
        console.log("Received submitAction...")
        try {
            let enemySlot: PlayerSlot = data.playerSlot == "player1" ? "player2" : "player1"

            toggleElement(data.playerSlot, data.playerAction.attack1)
            toggleElement(enemySlot, data.playerAction.attack2)
            toggleElement(enemySlot, data.playerAction.defend)

            socket.emit("gameUpdate", game)
        }
        catch(e) {
            console.log(e.message)
        }
        finally {
            console.log("Processing complete.")
        }
    })
    socket.on("newGame", (roomName) => {
        socket.join(roomName);
        console.log(socket.data);
        console.log(socket.id);
    })

    socket.on("joinGame", (roomName) => {
        socket.join(roomName);
        console.log(socket.data);
        console.log(socket.id);
    })
})

Http.listen(3000, () => {
    console.log("Listening at :3000...")
})
