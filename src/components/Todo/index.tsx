import { createSignal, Show } from "solid-js";
import "./index.scss";
import { Tasks, TodoData } from "../../scripts/app";

interface Props extends TodoData {

}


const Todo = (props: Props) => {
  const [editable, setEditable] = createSignal(false);
  const [check, setCheck] = createSignal(props.isComplete);
  let inputEl = null ! as HTMLInputElement; 

  const click = () => {
    setEditable(true);
    inputEl.focus();
  }

  const checkTodo = async () => {
    Tasks.checkTask(props.id, !check())
    setCheck(!check())
  };

  const updateTodo = async (e:SubmitEvent) => {
    e.preventDefault();
    await Tasks.updateTask(props.id, inputEl.value!);
    setEditable(false);
  }

  const removeTodo = async () => Tasks.removeTask(props.id);  


	return <form class="todo" onSubmit={updateTodo}>
    <Show when={editable()} fallback={<p class="todo-text">{props.task}</p>}>
      <input required={true} ref={inputEl} type="text" class="todo-input" placeholder="Update this task" value={props.task} />
    </Show>
    <button onClick={checkTodo} disabled={editable()} class="todo-check" type="button" title="Check this todo" data-checked={check()}></button>
    <div class="todo-bar">
    <Show when={editable()} fallback={<button onClick={click} class="todo-edit" type="button" title="Edit this todo">
      <svg viewBox="0 0 24 24"><use href="#edit"></use></svg>  
      <span>Edit</span>
    </button>}>
    <button type="submit" class="todo-save" title="Save this todo">
      <svg viewBox="0 0 24 24"><use href="#save"></use></svg>  
      <span>Save</span>
    </button>
    </Show>
    <button onClick={removeTodo} class="todo-remove" type="button" title="Remove this todo">
      <svg viewBox="0 0 24 24"><use href="#close"></use></svg>  
      <span>Close</span>
    </button>

    </div>

   </form>
}


export default Todo;
