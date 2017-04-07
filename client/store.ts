
export interface Player {
    Id: number;
    Name: string;
}

export enum RunStatus {
    None,
    Open,
    Closed,
}

export class Run {
    public Item : Item;
    public Votes : Array<string> = new Array<string>();
}

export class Item {
    public Name : string;
    public Result : string;
    public Historic: Array<string>;
}

export class State {
    public id: number;
    public notification: string;
    public Players: Array<Player> = new Array<Player>();
    public Items: Array<Item> = new Array<Item>();
    public CurrentRun : Run = new Run();

    
    runStatus() : RunStatus {
        if (this.CurrentRun.Item == null) {
            return RunStatus.None;
        }
        if (this.CurrentRun.Item.Historic != null) {
            return RunStatus.Closed;
        }
        return RunStatus.Open;
    }
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

    setNotification(content: string) {
        this.state.notification = content;
        this.raise();
    }

    unsetNotification() {
        this.state.notification = null;
        this.raise();
    }
}