import * as React from "react";
import * as Dom from "react-dom";
import * as io from "socket.io-client";
import * as st from "./store"

class Card extends React.Component<any, any> {
    render() {
        var cardStyle: React.CSSProperties = {
            width: 100,
            height: 150,
            textAlign: "center",
            verticalAlign: "middle",
            border: "1px solid #AAAAAA",
            borderRadius: 5,
            margin: 5
        }

        var cardTextStyle: React.CSSProperties = {
            verticalAlign: "middle",
            marginTop: 60,
            fontSize: "24pt",
            fontWeight: "bold",
            fontFamily: "sans-serif",
            color: "#333333"
        }

        var { children, voted, ...others } = this.props;

        if (voted) {
            cardStyle.backgroundColor = "#CDDC39";
            cardTextStyle.color = "white";
        }
        return (
            <div style={cardStyle} {...others}><div style={cardTextStyle}>{children}</div></div>
        )
    }
}

interface PlayerProps {
    player: st.Player
    voted: boolean
}

class Player extends React.Component<PlayerProps, any> {
    render() {
        var nameStyle: React.CSSProperties = {
            marginLeft: 7
        };

        var iconStyle: React.CSSProperties = {
            fontSize: "16pt",
            color: "#8BC34A"
        };

        var voteStyle: React.CSSProperties = {
            fontSize: "16pt",
            color: "#cddc39",
            float: "right"
        };

        var { player, voted, ...others } = this.props;

        return (
            <div {...others} >
                <span className="fa fa-odnoklassniki-square" style={iconStyle} />
                <span style={nameStyle}>{player.Name}</span>
                {voted && (<span className="fa fa-thumbs-up" style={voteStyle} />)}
            </div>
        )
    }
}

class Main extends React.Component<any, { state: st.State, itemName: string }> {
    constructor(props, context) {
        super(props, context);
        this.state = { state: store.getState(), itemName: "" }
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

    onItemNameChange(e: React.ChangeEvent<HTMLInputElement>) {
        var val = e.target.value;
        this.setState((prev, props) => {
            return {
                state: prev.state,
                itemName: val
            }
        });
    }

    onClickVote(val) {
        return (e) => {
            vote(val);
        }
    }

    onClickAddItem(itemName: string) {
        addItem(itemName);
    }

    changeName() {
        return (e: React.ChangeEvent<HTMLInputElement>) => {
            setName(e.currentTarget.value)
        }
    }

    isMyVote(vote: string): boolean {
        var myVote = this.state.state.CurrentRun.Votes[this.state.state.id];
        if (myVote) {
            return myVote == vote;
        }
        return false;
    }

    hasVoted(id: number): boolean {
        var myVote = this.state.state.CurrentRun.Votes[id];
        return myVote != undefined && myVote != null && myVote != "";
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

        var cardsStyle: React.CSSProperties = {
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap"
        }

        var playerStyle: React.CSSProperties = {
            width: 175
        }

        var playersListStyle: React.CSSProperties = {
            listStyleType: "none",
            width: 200,
            padding: 0,
            margin: "10px 0 0 0 "
        }

        var votes = [
            { value: "1", text: "1" },
            { value: "2", text: "2" },
            { value: "3", text: "3" },
            { value: "5", text: "5" },
            { value: "8", text: "8" },
            { value: "13", text: "13" },
            { value: "21", text: "21" },
            { value: "coffee", text: <span className="fa fa-coffee" /> },
            { value: "?", text: "?" }];

        var players = [];
        for (let id in this.state.state.Players) {
            let p = this.state.state.Players[id]
            players.push(<li key={"player" + p.Id} style={playerStyle}><Player player={p} voted={this.hasVoted(p.Id)} /></li>);
        }
        var item = this.state.state.CurrentRun.Item;

        return (<div>
            <h1>Team Poker</h1>

            <h3>
                { item ? ("Voting for " + item.Name) : "Nothing to vote"}
            </h3>

            <div>
                <button onClick={(e) => this.closeVote()}>Close vote</button>
                <button onClick={(e) => this.resetVote()}>Rerun vote</button>
            </div>

            <div style={columnsStyle}>
                <div>
                    <div style={cardsStyle}>
                        {
                            votes.map(vote => (
                                <Card key={"card-" + vote.value} onClick={this.onClickVote(vote.value)} voted={this.isMyVote(vote.value)}>{vote.text}</Card>
                            ))
                        }
                    </div>

                    <div>
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
                                    {this.state.state.Items.map((item, index) => (
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
                    </div>
                </div>
                <div>
                    <div>
                        <label>Changer de nom :</label>
                        <input type="text" onChange={this.changeName()} />
                    </div>
                    <ul style={playersListStyle}>
                        {players}
                    </ul>
                </div>
            </div>
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
