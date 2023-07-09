import { Client } from "types/types";

export let clients: Array<Client> = [];

export function addClient(client: Client): void {
  clients.push(client);
}

export function removeClient(client: Client): void {
  clients = clients.filter((el) => {
    if (el.clientConnectionId !== client.clientConnectionId) return el;
  });
}
