import React, {
  useReducer,
  useCallback,
  createContext,
  useContext,
} from "react";

// interface Props {
//   children: React.ReactNode;
// }

type ActionType =
  | { type: "ADD"; text: string }
  | { type: "REMOVE"; id: number };

interface Todo {
  id: number;
  done: boolean;
  text: string;
}

type useTodosManagerResult = ReturnType<typeof useTodosManager>;

const TodoContext = createContext<useTodosManagerResult>({
  todos: [],
  addTodo: () => { },
  removeTodo: () => { },
});

function useTodosManager(initialTodos: Todo[]): {
  todos: Todo[];
  addTodo: (text: string) => void;
  removeTodo: (id: number) => void;
} {
  const [todos, dispatch] = useReducer((state: Todo[], action: ActionType) => {
    switch (action.type) {
      case "ADD":
        return [
          ...state,
          {
            id: state.length,
            text: action.text,
            done: false,
          },
        ];
      case "REMOVE":
        return state.filter(({ id }) => id !== action.id);
      default:
        throw new Error();
    }
  }, initialTodos);

  const addTodo = useCallback((text: string) => {
    dispatch({
      type: "ADD",
      text,
    });
  }, []);

  const removeTodo = useCallback((id: number) => {
    dispatch({
      type: "REMOVE",
      id,
    });
  }, []);

  return { todos, addTodo, removeTodo };
}

export const TodosProvider: React.FunctionComponent<{
  initialTodos: Todo[];
  children: React.ReactNode;
}> = ({ initialTodos, children }) => (
  <TodoContext.Provider value={useTodosManager(initialTodos)}>
    {children}
  </TodoContext.Provider>
);

export const useTodos = (): Todo[] => {
  const { todos } = useContext(TodoContext);
  return todos;
};
export const useAddTodo = (): useTodosManagerResult["addTodo"] => {
  const { addTodo } = useContext(TodoContext);
  return addTodo;
};
export const useRemoveTodo = (): useTodosManagerResult["removeTodo"] => {
  const { removeTodo } = useContext(TodoContext);
  return removeTodo;
};