import { Component, c } from "./component"
import { Entity } from "./entity"
import { EntityManager } from './ecs'

export function removeComponent(entity: Entity, componentMask: number) {
    entity.componentsMask &= ~componentMask // b = b AND (NOT b) to set mask bit to 0
    // TODO: more thorough deletion? Currently, we dereference the component in our system, but the compiler doesn't know that
}

export abstract class System {
    public readonly componentsMask: number
    public name: string
    public f: (ecs: EntityManager, entity: Entity) => void
    public run (ecs: EntityManager, entity: Entity) {
        if(!entity.match(this.componentsMask)) {
            // TODO: Dynamically list missing components in error message
            throw new Error(`Tried to run ${this.name} on entity missing component(s): [FEATURE NOT IMPLEMENTED]`)
        }

        this.f(ecs, entity)
    }

    constructor(componentsMask: number, f: (ecs: EntityManager, entity: Entity) => void) {
        this.componentsMask = componentsMask
        this.run = f
    }
}
