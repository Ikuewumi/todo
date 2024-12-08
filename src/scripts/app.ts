import { message } from "@tauri-apps/plugin-dialog";
import { LazyStore } from "@tauri-apps/plugin-store";
import { z } from "zod";
import { atom } from "nanostores";
export const showDialogMessage = async (message_: string): Promise<void> => {
    return message(message_, { title: 'Todo w Tauri', kind: 'error' });
}

const TodoDataSchema = z.object({
    created_at: z.number(),
    task: z.string().min(1),
    isComplete: z.boolean(),
    id: z.string().uuid(),
    updated_at: z.number()
});

const TasksStoreSchema = z.object({
    data: z.array(TodoDataSchema)
})
export type TodoData = z.infer<typeof TodoDataSchema>;
type TasksStore = z.infer<typeof TasksStoreSchema>;


export const $tasksList = atom<TodoData[]>([]);

const TASKS_STORE_KEY = "data";
export const Tasks = {
    store: new LazyStore("tasks.json", {"autoSave": true}),
    init: async () => {
        console.info("initializing");
        const keyIsPresent = await Tasks.store.has(TASKS_STORE_KEY);
        if (keyIsPresent) {
            $tasksList.set(await Tasks.getTasks());
            return;
        }
        return await Tasks.store.set(TASKS_STORE_KEY, []);
    },
    getTasks: async () => {
        const tasks = await Tasks.store.get<TasksStore["data"]>(TASKS_STORE_KEY) ?? [];
        return tasks as TasksStore["data"];
    },
    addTask: async (task: string) => {
        const tasks = await Tasks.getTasks();
        const newId = self.crypto.randomUUID();
        const newTask = TodoDataSchema.parse({
            task,
            created_at: Date.now(),
            updated_at: Date.now(),
            isComplete: false,
            id: newId
        });
        tasks.push(newTask);
        console.log(tasks);
        return Tasks.setTasks(tasks);
    },
    setTasks: async (tasks: TasksStore["data"]) => {
        await Tasks.store.set(TASKS_STORE_KEY, tasks);
        const tasks_ = await Tasks.store.get<TasksStore["data"]>(TASKS_STORE_KEY) ?? [];
        $tasksList.set(tasks_);
        console.log(tasks_)
        return Tasks.store.save();
    },
    checkTask: async (id: string, isComplete: boolean) => {
        const tasks = $tasksList.get().map(task => {
            if (task.id === id) {
                return {
                    ...task,
                    isComplete
                }
            }
            else return task
        })

        return Tasks.setTasks(tasks);


    },
    updateTask: async (id: string, task_: string) => {
        const tasks = $tasksList.get().map(task => {
            if (task.id === id) {
                return {
                    ...task,
                    task: task_,
                    updated_at: Date.now()
                }
            }
            else return task
        })

        return Tasks.setTasks(tasks);
    },

    removeTask: async (id: string) => {
        const tasks = $tasksList.get().filter(task =>  id !== task.id)

        return Tasks.setTasks(tasks);
    },
    clearDisk: async() => {
        console.info("clearing disk...wait");    
        await Tasks.setTasks([]);
    }
}