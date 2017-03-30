import * as React from "react";
import * as Dom from "react-dom";
import * as io from "socket.io-client";

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

class Main extends React.Component<any, any> {
    constructor(props, context) {
        super(props, context);
        this.state = {
            name: name
        };
        register(this);
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

    onUpdate() {
        console.log("updated")
        this.setState({
            name: name
        });
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
                        <li><Player name={this.state.name} /></li>
                        <li><Player name="Joueur 2" /></li>
                    </ul>
                </div>
            </div>
        </div>);
    }
}

var ui = []
Dom.render(<Main/>, document.getElementById("main-container"));

var socket = io();

function register(obj) {
    ui.push(obj)
}

function update() {
    for (var obj of ui) {
        obj.onUpdate();
    }
}

function vote(value: any) {
    console.log("my vote:", value);
    socket.emit("vote", JSON.stringify(value));
}

socket.on("vote", (value) => {
    console.log("vote:", value)
});

function setName(value: string) {
    name = value;
    socket.emit("change_name", value)
}

socket.on("change_name", (value) => {
    name = value;
    update();
});


socket.on("message", (value) => {
    console.log("msg:", value)
});

socket.on("disconnect", ()=> {
    console.log("connexion perdue!")
})