import * as React from "react";
import * as st from "./store"
import * as colors from "./colors";

interface VoteRunProps {
    run: st.Run;
    status: st.RunStatus;
    closeVote: () => void;
    resetVote: () => void;
}

export class VoteRun extends React.Component<VoteRunProps, void> {
    render() {
        var content = null;

        if (this.props.status == st.RunStatus.None) {
            content = (<h3>Waiting for a vote to open...</h3>);
        }
        if (this.props.status == st.RunStatus.Closed) {
            content = (
                <div>
                    <h3>Vote is closed</h3>
                    <h5>{this.props.run.Item.Name}</h5>
                    <p>
                        The result is <strong>{this.props.run.Item.Result}</strong>
                    </p>
                    <div>
                        <button onClick={(e) => this.props.resetVote()}>Reset vote</button>
                    </div>
                </div>);
        }
        if (this.props.status == st.RunStatus.Open) {
            content = (
                <div>
                    <h3>Vote is open</h3>
                    <h5>{this.props.run.Item.Name}</h5>

                    <div>
                        <button onClick={(e) => this.props.closeVote()}>Close vote</button>
                        <button onClick={(e) => this.props.resetVote()}>Reset vote</button>
                    </div>
                </div>);
        }
        return (
            <div className="vote-run">
                {content}
            </div>
        );
    }
}

interface VoteResultProps {
    run: st.Run;
}

export class VoteResult extends React.Component<VoteResultProps, void> {
    render() {
        var stats = {};
        var historic = this.props.run.Item.Historic;
        var total = 0;
        for (let key in historic) {
            var vote = historic[key];
            if (stats[vote] == undefined) {
                stats[vote] = 1
            }
            else {
                stats[vote] = stats[vote] + 1;
            }
            total += 1;
        }

        var statBars = [];
        var index = 0;
        for (let key in stats) {
            var count = stats[key];
            var color = colors.Palette[index % colors.Palette.length];
            index++;
            statBars.push(
                <div key={"results-vote-" + key} style={{ width: "100%", margin: "3px 0"}}>
                    <span style={{ display: "inline-block", width: 31 }}>{key}</span>
                    <div style={{
                        display: "inline-block",
                        backgroundColor: color,
                        width: (count / total * 100.0) + "%"
                    }}>&nbsp;</div>
                </div>
            )
        }

        return (
            <div>
                {statBars}
            </div>
        )
    }
}