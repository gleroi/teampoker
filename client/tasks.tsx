import * as React from "react";
import * as st from "./store";

interface ListProps {
    items: Array<st.Item>;
    runVote: (number) => void;
}

export class List extends React.Component<ListProps, any> {
    render() {
        return (
            <div>
                <table className="tasks">
                    <thead>
                        <tr>
                            <th>Task</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.items.map((item, index) => (
                            <tr key={"table-item-" + index}>
                                <td className="task-name">{item.Name}</td>
                                <td>{item.Result ? item.Result : "To do"}</td>
                                <td>
                                    {!item.Result &&
                                        <button onClick={(e) => this.props.runVote(index)}>Run vote</button>}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }
}