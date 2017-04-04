
export interface Player {
    id: number;
    name:string;
    voted: boolean;
}

export class State {
    public id: number;
    public players : Array<Player> = new Array<Player>();
}

export class Store {
    private callbacks = []
    private state = new State();

    subscribe(cb: () => void) {
        this.callbacks.push(cb);
    }

    raise() {
        for (let cb of this.callbacks) {
            cb();
        }
    }

    getState() : State
    {
     return this.state;
    }
    
    addPlayer(id: number) {
        console.log("addPlayer", id)
        this.state.players[id] = { id: id, name: "other", voted: false };
        this.raise();
    }

    setId(id: number) {
        console.log("setId", id)
        this.state.id = id;
        this.addPlayer(id);
    }

    setName(id: number, value: string) {
        console.log("setName", id, value);
        var player = this.state.players[id];
        if (!player) {
            this.addPlayer(id);
            player = this.state.players[id];
        }
        player.name = value;
        this.raise();
    }

    hasVoted(id: number, value: string) {
        console.log("hasVoted", id, value);
        var player = this.state.players[id];
        if (player) {
            player.voted = true;
        }
        this.raise();
    }
}