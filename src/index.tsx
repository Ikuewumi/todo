/* @refresh reload */
import { render } from "solid-js/web";
import App from "./App";
import "./styles/fonts.scss";
import "./styles/index.scss";

render(() => <App />, document.getElementById("root") as HTMLElement);
