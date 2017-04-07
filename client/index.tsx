import * as React from "react";
import * as Dom from "react-dom";
import * as players from "./players";
import * as votes from "./votes";
import * as cards from "./cards";
import * as tasks from "./tasks";
import * as io from "socket.io-client";
import * as st from "./store"

class Main extends React.Component<any, { game: st.State, itemName: string }> {
    constructor(props, context) {
        super(props, context);
        this.state = { game: store.getState(), itemName: "" }
        store.subscribe(() => this.onChange());
    }

    onChange() {
        this.setState((prev, props) => {
            return {
                state: store.getState(),
                itemName: prev.itemName,
            }
        });

    }

    itemName(val: string) {
        this.setState((prev, props) => {
            return {
                state: prev.game,
                itemName: val
            }
        });
    }

    onItemNameChange(e: React.ChangeEvent<HTMLInputElement>) {
        var val = e.target.value;
        this.itemName(val);
    }

    onVote(val) {
        vote(val);
    }

    onClickAddItem(itemName: string) {
        addItem(itemName);
        this.itemName("");
    }

    changeName() {
        return (e: React.ChangeEvent<HTMLInputElement>) => {
            setName(e.currentTarget.value)
        }
    }

    myVote(): string {
        if (this.state.game.runStatus() == st.RunStatus.Closed) {
            return this.state.game.CurrentRun.Item.Result;
        }
        return this.state.game.CurrentRun.Votes[this.state.game.id];
    }

    runVote(index: number) {
        runVote(index);
    }

    closeVote() {
        closeVote();
    }

    resetVote() {
        resetVote();
    }

    deleteItem(index: number) {
        deleteItem(index);
    }

    render() {
        var columnsStyle: React.CSSProperties = {
            display: "flex",
            flexDirection: "row",
            flexWrap: "nowrap"
        }

        var voteOpened = this.state.game.runStatus() == st.RunStatus.Open;

        return (<div>
            <h1>
                <img src="favicon.png" alt="logo" className="logo" />
                Team Poker
            </h1>

            {this.state.game.notification && (
                <div className="notification">
                    <div>
                        <img src="favicon.png" alt="logo" />
                        <span className="notification-title">Team Poker</span>
                    </div>
                    <div className="notification-content">{this.state.game.notification}</div>
                </div>
            )}

            <section>
                <votes.VoteRun run={this.state.game.CurrentRun} status={this.state.game.runStatus()}
                    closeVote={this.closeVote} resetVote={this.resetVote} />
            </section>

            <section style={columnsStyle}>
                <div>
                    <section>
                        <cards.List vote={this.onVote} myvote={this.myVote()} />
                    </section>
                </div>

                <div>
                    <div>
                        <label>Changer de nom :</label>
                        <input type="text" onChange={this.changeName()} />
                    </div>
                    <players.List players={this.state.game.Players} run={this.state.game.CurrentRun} />
                </div>
            </section>

            <section>
                <h2>Tasks</h2>

                <div>
                    <label>Task &nbsp;</label>
                    <input type="text" className="task"
                        value={this.state.itemName} onChange={(e) => this.onItemNameChange(e)} />
                    <button onClick={(e) => this.onClickAddItem(this.state.itemName)}
                        disabled={!this.state.itemName || this.state.itemName == ""} >
                        Add
                    </button>
                </div>

                <tasks.List items={this.state.game.Items} 
                    runVote={(index) => this.runVote(index)}
                    deleteItem={(index) => this.deleteItem(index)} />

            </section>
        </div>);
    }
}


var socket = io({
    reconnection: true
});
var store = new st.Store();

Dom.render(<Main />, document.getElementById("main-container"));

socket.on("join", (id) => {
    store.setId(id);
    var oldName = localStorage.getItem("poker_name");
    if (oldName) {
        setName(oldName);
    }
})

socket.on("state", (state) => {
    console.log("state", state)
    store.setState(state)
});


function notify(content: string) {
    console.log("notify", content);
    store.setNotification(content)
    setTimeout(() => {
        console.log("notify", "remove notification", content);
        store.unsetNotification();
    }, 5000);
}

socket.on("connect", () => {
    console.log("connection ready!")
    notify("connection ready \\o/");
});

socket.on("disconnect", () => {
    console.log("connection lost!");
    notify("connection lost :'(");
});

function runVote(index: number) {
    console.log("run_vote", index);
    socket.emit("run_vote", index);
}

function vote(value: any) {
    var state = store.getState();
    var vote = state.CurrentRun.Votes[state.id]
    if (vote && value == vote) {
        console.log("vote", "");
        socket.emit("vote", "");
    }
    else {
        console.log("vote", value);
        socket.emit("vote", value);
    }
}

function closeVote() {
    console.log("close_vote");
    socket.emit("close_vote");
}

function resetVote() {
    console.log("reset_vote");
    socket.emit("reset_vote");
}

function setName(value: string) {
    socket.emit("change_name", value)
    localStorage.setItem("poker_name", value);
}

function addItem(item: string) {
    console.log("add_item", item);
    socket.emit("add_item", item);
}

function deleteItem(index: number) {
    console.log("delete_item", index);
    socket.emit("delete_item", index);
}