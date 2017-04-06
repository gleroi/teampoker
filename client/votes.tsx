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
        if (this.props.status == st.RunStatus.None) {
            return (<h3>Waiting for a vote to open...</h3>);
        }
        if (this.props.status == st.RunStatus.Closed) {
            return (
            <div>
                <h3>Vote for {this.props.run.Item.Name} is closed</h3>

                <div>
                    <button onClick={(e) => this.props.resetVote()}>Reset vote</button>
                </div>
            </div>);
        }
        if (this.props.status == st.RunStatus.Open) {
            return (
            <div>
                <h3>Vote for {this.props.run.Item.Name} is open</h3>

                <div>
                    <button onClick={(e) => this.props.closeVote()}>Close vote</button>
                    <button onClick={(e) => this.props.resetVote()}>Reset vote</button>
                </div>
            </div>);
        }
    }
}