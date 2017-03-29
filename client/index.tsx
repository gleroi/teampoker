import * as React from "react";
import * as Dom from "react-dom";


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

        var { children, ...others} = this.props;

        return (
            <div style={cardStyle} {...others}><div style={cardTextStyle}>{children}</div></div>
        )
    }
}

class Main extends React.Component<any, any> {
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


        return (<div>
            <h1>Team Poker</h1>

            <div style={columnsStyle}>
                <div style={cardsStyle}>

                    <Card>1</Card>
                    <Card>2</Card>
                    <Card>3</Card>
                    <Card>5</Card>
                    <Card>8</Card>
                    <Card>13</Card>
                    <Card>21</Card>
                    <Card><span className="fa fa-coffee"></span></Card>
                    <Card>?</Card>

                </div>

                <div style={playersStyle}>
                    <ul>
                        <li>Joueur 1</li>
                        <li>Joueur 2</li>
                    </ul>
                </div>
            </div>
        </div>);
    }
}

Dom.render(<Main />, document.getElementById("main-container"));