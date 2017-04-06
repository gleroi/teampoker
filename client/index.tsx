import * as React from "react";
import * as Dom from "react-dom";
import * as players from "./players";
import * as votes from "./votes";
import * as cards from "./cards";
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

    render() {
        var columnsStyle: React.CSSProperties = {
            display: "flex",
            flexDirection: "row",
            flexWrap: "nowrap"
        }

        var voteOpened = this.state.game.runStatus() == st.RunStatus.Open;

        return (<div>
            <h1>Team Poker</h1>

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
                    <input type="text" size={60}
                        value={this.state.itemName} onChange={(e) => this.onItemNameChange(e)} />
                    <button onClick={(e) => this.onClickAddItem(this.state.itemName)}
                        disabled={!this.state.itemName || this.state.itemName == ""} >Add
                            </button>
                </div>

                <div>
                    <table>
                        <thead>
                            <tr>
                                <th>Task</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.game.Items.map((item, index) => (
                                <tr key={"table-item-" + index}>
                                    <td>{item.Name}</td>
                                    <td>{item.Result ? item.Result : "To do"}</td>
                                    <td>
                                        {!item.Result &&
                                            <button onClick={(e) => this.runVote(index)}>Run vote</button>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                </div>
            </section>
        </div>);
    }
}


var socket = io();
var store = new st.Store();

Dom.render(<Main />, document.getElementById("main-container"));

socket.on("join", (id) => {
    store.setId(id);
})

socket.on("state", (state) => {
    console.log("state", state)
    store.setState(state)
});

socket.on("disconnect", () => {
    console.log("connexion perdue!")
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
}

function addItem(item: string) {
    console.log("add_item", item);
    socket.emit("add_item", item);
}
