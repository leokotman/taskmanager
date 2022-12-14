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

  const loadTask = (id) => {
    TasksRepository.show(id).then(({ data: { task } }) => task);
    console.log('task loaded');
  };

  const createTask = (attributes) =>
    TasksRepository.create(attributes)
      .then(({ data: { task } }) => {
        console.log('task created');
        loadColumn(task.state);
      })
      .catch((err) => {
        console.log(err);
      });

  const updateTask = () => {
    console.log('task updated');
  };

  const destroyTask = (attributes) => {
    TasksRepository.destroy(attributes.id)
      .then(({ data: { task } }) => {
        loadColumn(task.state);
        console.log('task destroyed');
      })
      .catch((error) => {
        alert(`Destrucion Failed! Error: ${error.message}`);
      });
  };

  const loadMoreTasks = (state, page = 1, perPage = 10) => {
    console.log('loadMoreTasks in slice');
    TasksRepository.index({
      q: { stateEq: state },
      page,
      perPage,
    }).then(({ data }) => {
      dispatch(loadColumnMore({ ...data, columnId: state }));
    });
  };

  const dragCard = () => {
    console.log('card dragged');
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
