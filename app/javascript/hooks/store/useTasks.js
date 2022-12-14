import { useSelector } from 'react-redux';
import { useTasksActions } from 'slices/TasksSlice';

const useTasks = () => {
  const board = useSelector((state) => state.TasksSlice.board);
  const { loadBoard, loadMoreTasks, loadTask, createTask, updateTask, destroyTask, dragCard } = useTasksActions();

  return {
    board,
    loadBoard,
    loadMoreTasks,
    loadTask,
    createTask,
    updateTask,
    destroyTask,
    dragCard,
  };
};

export default useTasks;
