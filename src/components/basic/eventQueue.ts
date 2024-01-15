import type Game from "../..";
import { EEventQueue } from "./enums";
import type GameEvent from "./gameEvent";

export class EventQueue {
  private game: Game;
  private events: GameEvent[] = [];
  private busy: boolean;

  public constructor(game: Game) {
    this.game = game;

    this.game.vi.emitter.on(EEventQueue.Add, (gameEvent: GameEvent) => {
      this.events.push(gameEvent);
      console.log(`EventQueue: Pushing event '${gameEvent.name}' to queue: ${this.events.length}`);
    });

    this.game.vi.emitter.on(EEventQueue.Flush, async (callback?: Function) => {
      this.events = [];
      console.log("EventQueue: Flushing event queue");

      if (callback) {
        const beforeTime = Date.now();
        await callback();
        this.busy = false;
        const duration = Math.abs(Date.now() - beforeTime);
        console.log(`EventQueue: Flushing callback done (${duration} ms)`);
      } else {
        this.busy = false;
      }
    });

    // TODO: Add delete events by type?

    // query queue every 100 ms
    setInterval(() => {
      this.update();
    }, 100);
  }

  private async update(): Promise<void> {
    if (this.busy || this.events.length === 0) {
      return;
    }

    this.busy = true;

    const gameEvent = this.events.shift();
    console.log(`EventQueue: ${gameEvent.name}`);
    const beforeTime = Date.now();
    await gameEvent.run();
    const duration = Math.abs(Date.now() - beforeTime);
    console.log(`EventQueue: ${gameEvent.name} done (${duration} ms)`);
    this.busy = false;
  }
}
