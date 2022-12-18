type Media =
  | {
      type: "photo";
      mime: "string";
      fileId: string;
      fileUniqueId: string;
      size: number;
    }
  | {
      type: "video";
      mime: "string";
      fileId: string;
      fileUniqueId: string;
      size: number;
      duration: number;
    };

interface Client {
  id: string;
  teleId: string;
  firstName: string;
  username: string;
  media: Media;
  status:
    | "joined"
    | "media-recieved"
    | "media-processing"
    | "media-processed"
    | "media-sent"
    | "media-error-client"
    | "media-error-server";
}

class Clients {
  _clients: Client[] = [];
  constructor() {
    this._clients = [];
  }

  _exists(username: string) {
    const client = this._clients.find((c) => c.username === username);
    if (client) {
      return client;
    }
    return false;
  }

  add(client: Client) {
    if (this._exists(client.username)) {
      console.log("❌ client already in queue:", `[@${client.username}]`);
      return;
    }
    this._clients.push(client);
    console.log("✅ New client added:", `[@${client.username}]`);
  }

  upsert(client:Client){
    
  }

  get(username: string) {
    const client = this._exists(username);
    if (client) {
      return client;
    }
    console.log("❌ client not in queue:", `[@${username}]`);
    return null;
  }

  remove(username: string) {
    const client = this._exists(username);
    if (client) {
      this._clients = this._clients.filter((c) => c.username !== username);
      console.log("🫧 client removed from queue", `@[${username}]`);
      return client;
    }
    console.log("❌ client not in queue:", `[@${username}]`);
    return null;
  }
}

const clients = new Clients();

export default clients;
