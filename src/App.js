import { withAuthenticator } from "@aws-amplify/ui-react";
import React from "react";
import { Todo } from "./components/Todo";

function App(props) {
    return (
        <div className="App">
            <Todo />
        </div>
    );
}

export default withAuthenticator(App);
