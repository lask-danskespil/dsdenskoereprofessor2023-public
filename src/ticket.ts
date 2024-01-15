import { Ticket as ITGTicket } from "@gdk/gamekit";

import type Game from "./index";
import type { IRevelationData } from "./components/interfaces/irevelationData";
import type { ITicketModel } from "./components/interfaces/iticketModel";

export class Ticket extends ITGTicket<IRevelationData, Game> {
  public parsedTicket: ITicketModel;
  public symbols: string[];

  protected parse(): void {
    const splittedTicket = this.ticket.symbol.split("|");
    // Ignore splittedTicket[1] - positions are not used

    this.symbols = splittedTicket[0].split(",");
  }

  protected areRevelationDataValid(revelationData: IRevelationData): boolean {
    // Must return true if revelationData format is valid and handled, must return false otherwise
    return (
      Array.isArray(revelationData.scratchsRevealed) && revelationData.scratchsRevealed.length === 8
    );
  }
}
