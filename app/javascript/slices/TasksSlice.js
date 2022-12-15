import { propEq } from 'ramda';
import { createSlice } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import { changeColumn } from '@asseinfo/react-kanban';
import TasksRepository from 'repositories/TasksRepository';
import { STATES } from 'presenters/TaskPresenter';

const initialState = {
  board: {
    columns: STATES.map((column) => ({
      id: column.key,
      title: column.value,
      cards: [],
      meta: {},
    })),
  },
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    loadColumnSuccess(state, { payload }) {
      const { items, meta, columnId } = payload;
      const column = state.board.columns.find(propEq('id', columnId));

      state.board = changeColumn(state.board, column, {
        cards: items,
        meta,
      });

      return state;
    },
    loadColumnMore(state, { payload }) {
      const { items, meta, columnId } = payload;
      const column = state.board.columns.find(propEq('id', columnId));

      state.board = changeColumn(state.board, column, {
        cards: [...column.cards, ...items],
        meta,
      });

      return state;
    },
  },
});

const { loadColumnSuccess, loadColumnMore } = tasksSlice.actions;

export default tasksSlice.reducer;

export const useTasksActions = () => {
  const dispatch = useDispatch();

  const loadColumn = (state, page = 1, perPage = 10) => {
    TasksRepository.index({
      q: { stateEq: state },
      page,
      perPage,
    }).then(({ data }) => {
      dispatch(loadColumnSuccess({ ...data, columnId: state }));
    });
  };

  const loadBoard = () => Promise.all(STATES.map(({ key }) => loadColumn(key)));

  const loadTask = (id) => TasksRepository.show(id).then(({ data: { task } }) => task);

  const createTask = (attributes) =>
    TasksRepository.create(attributes)
      .then(({ data: { task } }) => {
        loadColumn(task.state);
      })
      .catch((err) => {
        console.log(err);
      });

  const updateTask = (task, attributes) =>
    TasksRepository.update(task.id, attributes).then(() => loadColumn(task.state));

  const destroyTask = (task, attributes) =>
    TasksRepository.destroy(attributes.id)
      .then(() => {
        loadColumn(task.state);
      })
      .catch((error) => {
        alert(`Destrucion Failed! Error: ${error.message}`);
      });

  const loadMoreTasks = (state, page = 1, perPage = 10) => {
    TasksRepository.index({
      q: { stateEq: state },
      page,
      perPage,
    }).then(({ data }) => {
      dispatch(loadColumnMore({ ...data, columnId: state }));
    });
  };

  const dragCard = (task, source, destination) => {
    const transition = task.transitions.find(({ to }) => destination.toColumnId === to);
    if (!transition) {
      return null;
    }
    return TasksRepository.update(task.id, { task: { stateEvent: transition.event } })
      .then(() => {
        loadColumn(destination.toColumnId);
        loadColumn(source.fromColumnId);
      })
      .catch((error) => {
        alert(`Move failed! ${error.message}`);
      });
  };

  return {
    loadBoard,
    loadTask,
    createTask,
    updateTask,
    destroyTask,
    dragCard,
    loadMoreTasks,
  };
};
