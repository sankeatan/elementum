import { ComponentType } from "./component"
import { Entity } from "./entity"

export function removeComponent(entity: Entity, componentType: ComponentType) {
    entity.componentsBitArray ^= componentType // XOR using componentType as bitmask
    entity.components[ComponentType[componentType]] = undefined // TODO: deep delete?
}
