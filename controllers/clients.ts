export type Feature = "video-reduce-size" | "video-trim" | "not-choosen";

type Media =
  | {
      type: "photo";
      mime: "string";
      fileId: string;
      fileUniqueId: string;
      fileName: string;
      size: number;
      inputLocation: string;
      outputLocation?: string;
    }
  | {
      type: "video";
      mime: "string";
      fileId: string;
      fileUniqueId: string;
      fileName: string;
      size: number;
      inputLocation: string;
      outputLocation?: string;
      duration: number;
    };

interface Client {
  id: string;
  teleId: number;
  firstName?: string;
  username: string;
  media?: Media;
  feature: Feature;
  options?: string[];
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

  _debug() {
    return;
    console.log("\nclients:", this._clients, "\n");
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
    this._debug();
  }

  attachMedia(username: string, media: Media) {
    const client = this._exists(username);
    if (client) {
      client.media = media;
      console.log("✅ media attached to client:", `[@${username}]`);
      this._debug();
      return;
    }
    console.log("❌ client not in queue:", `[@${username}]`);
  }

  attachOptions(username: string, options: string[]) {
    const client = this._exists(username);
    if (client) {
      client.options = options;
      console.log("✅ options attached to client:", `[@${username}]`);
      this._debug();
      return;
    }
    console.log("❌ client not in queue:", `[@${username}]`);
  }

  attachOutputLocation(username: string, outputLocation: string) {
    const client = this._exists(username);
    if (client) {
      if (client.media) {
        client.media.outputLocation = outputLocation;
        console.log("✅ outputLocation attached to client:", `[@${username}]`);
        this._debug();
        return;
      }
      console.log("❌ client has no media:", `[@${username}]`);
      return;
    }
    console.log("❌ client not in queue:", `[@${username}]`);
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

      this._debug();
      return client;
    }
    console.log("❌ client not in queue:", `[@${username}]`);
    return null;
  }
}

const clients = new Clients();

export default clients;
