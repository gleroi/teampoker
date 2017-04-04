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

         if (this.props.voted) {
            cardStyle.backgroundColor = "#CDDC39";
            cardTextStyle.color = "white";
        }


        var { children, ...others } = this.props;

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

        var { player, ...others } = this.props;

        return (
            <div {...others} >
                <span className="fa fa-odnoklassniki-square" style={iconStyle} />
                <span style={nameStyle}>{player.Name}</span>
                { this.props.voted && (<span className="fa fa-thumbs-up" style={voteStyle} />)}
            </div>
        )
    }
}

class Main extends React.Component<any, st.State> {
    constructor(props, context) {
        super(props, context);
        this.state = store.getState();
        store.subscribe(() => this.onChange());
    }

    onChange() {
        this.setState(store.getState());
    }

    onClick(val) {
        return (e) => {
            vote(val);
        }
    }

    changeName() {
        return (e : React.ChangeEvent<HTMLInputElement>) => {
            setName(e.currentTarget.value)
        }
    }

    isMyVote(vote: string) : boolean {
        var myVote = this.state.CurrentRun.Votes[this.state.id];
        if (myVote) {
            return myVote == vote;
        }
        return false;
    }

    hasVoted(id: number) : boolean {
        var myVote = this.state.CurrentRun.Votes[id];
        return myVote != undefined && myVote != null && myVote != "";
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

        var playersStyle: React.CSSProperties = {
            width: 200
        }

        var playersListStyle: React.CSSProperties = {
            listStyleType: "none"
        }

        var votes = [ 
            { value: "1", text: "1"},
            { value: "2", text: "2"},
            { value: "3", text: "3"},
            { value: "5", text: "5"},
            { value: "8", text: "8"},
            { value: "13", text: "13"},
            { value: "21", text: "21"},
            { value: "coffee", text: <span className="fa fa-coffee" />},
            { value: "?", text: "?"}];

        return (<div>
            <h1>Team Poker</h1>

            <h3>Voting for {this.state.CurrentRun.Name}</h3>

            <div style={columnsStyle}>
                <div style={cardsStyle}>
                    {
                        votes.map(vote => (
                            <Card onClick={this.onClick(vote.value)} voted={this.isMyVote(vote.value)}>{vote.text}</Card>
                        ))
                    }
                </div>

                <div style={playersStyle}>
                    <div>
                        <label>Changer de nom :</label>
                        <input type="text" onChange={this.changeName()} />
                    </div>
                    <ul style={playersListStyle}>
                        {
                            this.state.Players.map(p => (
                                <li key={p.Id} ><Player player={p} voted={this.hasVoted(p.Id)} /></li>
                            ))
                        }
                    </ul>
                </div>
            </div>
        </div>);
    }
}


var socket = io();
var store = new st.Store();

Dom.render(<Main/>, document.getElementById("main-container"));

socket.on("join", (id) => {
    store.setId(id);
})

socket.on("state", (state) => {
    console.log("state", state)
    store.setState(state)
});

socket.on("disconnect", ()=> {
    console.log("connexion perdue!")
});

function vote(value: any) {
    socket.emit("vote", value);
}

function setName(value: string) {
    socket.emit("change_name", value)
}
