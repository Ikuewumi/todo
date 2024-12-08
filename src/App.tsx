import {z} from "zod";
import { $tasksList, showDialogMessage, Tasks } from "./scripts/app";
import { For, onMount } from "solid-js";
import { useStore } from "@nanostores/solid";
import Assets from "./components/Assets";
import Todo from "./components/Todo";
import "./styles/app.scss"

function App() {
  let inputElement = null ! as HTMLInputElement;
  const todoSchema = z.string().min(1);
  const tasksList = useStore($tasksList);

  onMount(Tasks.init);

  const formHandler = async (e: SubmitEvent) => {
    try {
    e.preventDefault();
    const formEl = e.target! as HTMLFormElement;
    const todo = todoSchema.parse(inputElement.value.trim());
    await Tasks.addTask(todo);
    formEl.reset();
    } catch(error) {
      showDialogMessage(`${error}`);
    }

  }



  return (<>
    <main class="app">
   <h1>Todo App</h1>
   <p class="app-p">My first experiment with Tauri!</p>

   <form class="form" onSubmit={formHandler}>
    <label class="sr-only form-label" for="todo" title="Task">Task</label>
    <input class="form-input" ref={inputElement} required={true} type="text" name="todo" id="todo" placeholder="Add new task" />
    <button type="submit" class="form-add">
      <svg viewBox="0 0 24 24"><use href="#add-task"></use></svg>
      <span>Add Task</span>
      </button>
    <button onClick={Tasks.clearDisk} type="button" class="form-clear">
      <svg viewBox="0 0 24 24"><use href="#delete"></use></svg>
      <span>Clear Disk</span>
    </button>
   </form>

    <ul class="app-list">
   <For each={tasksList()}>
    {(item, index) => <li class="app-li" data-index={index()}><Todo {...item} /></li>}
   </For>
   </ul>




   <Assets />
   </main>
  </>);
}

export default App;
