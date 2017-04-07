import * as React from "react";
import * as st from "./store";

interface ListProps {
    items: Array<st.Item>;
    runVote: (index: number) => void;
    deleteItem: (index: number) => void;
}

export class List extends React.Component<ListProps, any> {
    render() {
        var items = [];
        for (let key in this.props.items) {
            var index = parseInt(key);
            var item = this.props.items[key];
            items.push(
                <tr key={"table-item-" + index}>
                    <td className="task-name">{item.Name}</td>
                    <td>{item.Result ? item.Result : "To do"}</td>
                    <td>
                        <button onClick={(e) => this.props.runVote(index)}><span className="fa fa-envelope-open-o" /></button>
                        <button onClick={(e) => this.props.deleteItem(index)}><span className="fa fa-trash-o" /></button>
                    </td>
                </tr>);
        }
        return (
            <div className="tasks">
                <table className="tasks-list">
                    <thead>
                        <tr>
                            <th>Task</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items}
                    </tbody>
                </table>
            </div>
        );
    }
}