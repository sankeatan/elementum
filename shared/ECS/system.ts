import { Component, c } from "./component"
import { Entity } from "./entity"
import { EntityManager } from './ecs'

export function removeComponent(entity: Entity, component: Component) {
    entity.componentsMask &= ~component.mask // b = b AND (NOT b) to set mask bit to 0
    entity.components[Component[component.mask]] = undefined // TODO: more thorough deletion?
}

export abstract class System {
    public abstract readonly componentsMask: number
    private f: (entity: Entity) => void
    public run(entities: Entity[]): void {
        for(let entity of entities) {
            if((entity.componentsMask & this.componentsMask) === this.componentsMask) {
                this.f(entity)
            }
        }
    }
}
