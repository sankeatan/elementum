// handle basic game loop. include game over and new game functionality
import { Entity, EntityCollection } from '../entities/entities'
import { initCards, initCardSlots, initElements } from "./setup";

export function initGame(entityCollection: EntityCollection) {
    initCards(entityCollection);
    initCardSlots(entityCollection);
    initElements(entityCollection);
}