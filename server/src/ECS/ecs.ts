
import { Component } from "../../../shared/ECS/component"

class World {
    public entities: {[entityId: string]: [componentIdBitArray: number]} = {}
    public components: {[entityId: string]: Component}[] = Array(100)
}
