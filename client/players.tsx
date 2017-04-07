import * as React from "react";
import * as st from "./store"

interface PlayerProps {
    player: st.Player
    voted: boolean | string
}

var colorPalette = [
    "#F44336",
    "#673AB7",
    "#3F51B5",
    "#E91E63",
    "#9C27B0",
    "#2196F3",
    "#4CAF50",
    "#FFEB3B",
    "#00BCD4",
    "#009688",
    "#FF5722"
];

class Player extends React.Component<PlayerProps, any> {
    render() {
        var nameStyle: React.CSSProperties = {
            marginLeft: 7
        };

        var iconStyle: React.CSSProperties = {
            fontSize: "16pt",
            color: colorPalette[this.props.player.Id % colorPalette.length]
        };

        var voteStyle: React.CSSProperties = {
            fontSize: "16pt",
            color: "#cddc39",
            float: "right"
        };

        var { player, voted, ...others } = this.props;
        var vote = null;
        if (voted === true) {
            vote = <span className="fa fa-thumbs-up" style={voteStyle} />
        }
        if (typeof (voted) == "string") {
            vote = <span style={voteStyle}>{voted}</span>
        }

        return (
            <div {...others} >
                <span className="fa fa-odnoklassniki-square" style={iconStyle} />
                <span style={nameStyle}>{player.Name}</span>
                {vote}
            </div>
        )
    }
}

interface ListProps {
    players: Array<st.Player>
    run: st.Run
}

export class List extends React.Component<ListProps, void> {

    /**
     * Display if the player has voted (while vote is running) or the vote of the
     * player (when the vote is closed).
     * @param id player id
     * @param run current voting run
     */
    Vote(id: number, run: st.Run): boolean | string {
        if (run.Item) {
            if (run.Item.Historic) {
                return run.Item.Historic[id];
            }
            var myVote = run.Votes[id];
            return myVote != undefined && myVote != null && myVote != "";
        }
        return false;
    }

    render() {

        var playerStyle: React.CSSProperties = {
            margin: "5px 0"
        }

        var playersListStyle: React.CSSProperties = {
            listStyleType: "none",
            width: 200,
            padding: 0,
            margin: "10px 0 0 0 "
        }

        var players = [];
        for (let id in this.props.players) {
            let p = this.props.players[id]
            players.push(<li key={"player" + p.Id} style={playerStyle}>
                <Player player={p} voted={this.Vote(p.Id, this.props.run)} />
            </li>);
        }

        return (
            <ul style={playersListStyle}>
                {players}
            </ul>
        );
    }
}