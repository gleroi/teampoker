import * as React from "react";
import * as st from "./store"

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