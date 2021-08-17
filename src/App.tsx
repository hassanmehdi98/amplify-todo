import { withAuthenticator } from "@aws-amplify/ui-react";
import React from "react";
import Todo from "./views/Todo/Todo";

function App(): JSX.Element {
    return (
        <div className="App">
            <Todo />
        </div>
    );
};

export default withAuthenticator(App);
