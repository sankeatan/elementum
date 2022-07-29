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
    if(Object.keys(ElementCluster).includes(cardType) == false) {
        return
    }

    game[playerSlot][cardType] = !game[playerSlot][cardType]
}

Socketio.on("connection", (socket: Socket) => {
    console.log("Client connected")

    socket.on("submitAction", (data: {player: PlayerSlot, action: PlayerAction}) => {
        console.log("Received submitAction...")
        try {
            let enemy: PlayerSlot = data.player == 'player1' ? 'player2' : 'player1'

            toggleElement(enemy, data.action.attack1)
            toggleElement(enemy, data.action.attack2)
            toggleElement(enemy, data.action.defend)

            socket.emit("gameUpdate", game)
        }
        catch(e) {
            console.log(e.message)
        }
        finally {
            console.log("Processing complete.")
        }
    })
})

Http.listen(3000, () => {
    console.log("Listening at :3000...")
})
