import * as React from "react";
import * as Dom from "react-dom";
import * as io from "socket.io-client";
import * as st from "./store"

var name = "Joueur 1";

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

        var { children, ...others } = this.props;

        return (
            <div style={cardStyle} {...others}><div style={cardTextStyle}>{children}</div></div>
        )
    }
}

interface PlayerProps {
    name: string
}
class Player extends React.Component<PlayerProps, any> {
    render() {
        var nameStyle: React.CSSProperties = {
            marginLeft: 7
        };

        var iconStyle: React.CSSProperties = {
            fontSize: "16pt",
            color: "#83b55e"
        };

        var { name, ...others } = this.props;

        return (
            <div {...others} >
                <span className="fa fa-user-circle" style={iconStyle} />
                <span style={nameStyle}>{name}</span>
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
            vote({ vote: val, player: "name"});
        }
    }

    changeName() {
        return (e : React.ChangeEvent<HTMLInputElement>) => {
            setName(e.currentTarget.value)
        }
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

        return (<div>
            <h1>Team Poker</h1>

            <div style={columnsStyle}>
                <div style={cardsStyle}>

                    <Card onClick={this.onClick("1")}>1</Card>
                    <Card onClick={this.onClick("2")}>2</Card>
                    <Card onClick={this.onClick("3")}>3</Card>
                    <Card onClick={this.onClick("5")}>5</Card>
                    <Card onClick={this.onClick("8")}>8</Card>
                    <Card onClick={this.onClick("13")}>13</Card>
                    <Card onClick={this.onClick("21")}>21</Card>
                    <Card onClick={this.onClick("coffee")}><span className="fa fa-coffee"></span></Card>
                    <Card onClick={this.onClick("?")}>?</Card>

                </div>

                <div style={playersStyle}>
                    <div>
                        <label>Changer de nom :</label>
                        <input type="text" onChange={this.changeName()} />
                    </div>
                    <ul style={playersListStyle}>
                        {
                            this.state.players.map(p => (
                                <li key={p.id} ><Player name={p.id + " : " + p.name} /></li>
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

socket.on("new_player", (id) => {
    store.addPlayer(id);
})

function vote(value: any) {
    console.log("my vote:", value);
    socket.emit("vote", JSON.stringify(value));
}

socket.on("vote", (value) => {
    console.log("vote:", value)
});

function setName(value: string) {
    socket.emit("change_name", value)
}

socket.on("name_changed", (id, value) => {
    console.log("name_changed", id, value)
    store.setName(id, value);
});


socket.on("message", (value) => {
    console.log("msg:", value)
});

socket.on("disconnect", ()=> {
    console.log("connexion perdue!")
})