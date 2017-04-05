
export interface Player {
    Id: number;
    Name: string;
}

export class Run {
    public Item : Item;
    public Votes : Array<string> = new Array<string>();
}

export class Item {
    public Name : string;
    public Result : string;
}

export class State {
    public id: number;
    public Players: Array<Player> = new Array<Player>();
    public Items: Array<Item> = new Array<Item>();
    public CurrentRun : Run = new Run();
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

    getState(): State {
        return this.state;
    }

    setState(state: State) {
        this.state.Players = state.Players;
        this.state.CurrentRun = state.CurrentRun;
        this.state.Items = state.Items;
        this.raise();
    }

    setId(id: number) {
        console.log("setId", id)
        this.state.id = id;
    }
}