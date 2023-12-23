import { createContext } from "react";
import { TaskClient } from ".";
import { useContext } from "react";
import { useDialogManager } from "@app/dialogs/DialogProvider";

const TaskClientContext = createContext<TaskClient>({} as TaskClient);

type ProviderProps = {
    children?: React.ReactNode;
}

export const TaskClientProvider: React.FC<ProviderProps> = ({ children }: ProviderProps) => {
    const dialogManager = useDialogManager();

    return <TaskClientContext.Provider value={new TaskClient(dialogManager)}>
        {children}
    </TaskClientContext.Provider>;
};

export const useTaskClient = () => useContext(TaskClientContext);