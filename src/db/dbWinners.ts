import { Winner, Player } from "../types/types";
import { AVAILABLE_RESPONSES } from "../constatnts";
import { sendResponseForClients } from "../utils";

export let winners = [] as Winner[];

export function createWinnerNote(player: Player) {
  let clients = [] as Player[];

  winners.push({
    name: player.name,
    wins: 0,
  });

  clients.push(player);

  sendResponseForClients(clients, AVAILABLE_RESPONSES.UPDATE_WINNER, winners);
}

export function updateWinners(winnerName: string, clients: Player[]) {
  winners.map((winner) => {
    if (winner.name === winnerName) {
      winner.wins += 1;
    }
  });

  sendResponseForClients(clients, AVAILABLE_RESPONSES.UPDATE_WINNER, winners);
}
