import React, { useEffect, useState } from 'react';
import Board from '@asseinfo/react-kanban';
import { propOr } from 'ramda';
import { Fab } from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';

import TaskForm from 'forms/TaskForm';
import Task from 'components/Task';
import AddPopup from 'components/AddPopup';
// import EditPopup from 'components/EditPopup';
import ColumnHeader from 'components/ColumnHeader';
import TasksRepository from 'repositories/TasksRepository';

import useStyles from './styles';

const STATES = [
  { key: 'new_task', value: 'New' },
  { key: 'in_development', value: 'In Dev' },
  { key: 'in_qa', value: 'In QA' },
  { key: 'in_code_review', value: 'in CR' },
  { key: 'ready_for_release', value: 'Ready for release' },
  { key: 'released', value: 'Released' },
  { key: 'archived', value: 'Archived' },
];
const MODES = {
  ADD: 'add',
  NONE: 'none',
  // EDIT: 'edit',
};

const initialBoard = {
  columns: STATES.map((column) => ({
    id: column.key,
    title: column.value,
    cards: [],
    meta: {},
  })),
};

const TaskBoard = () => {
  const [board, setBoard] = useState(initialBoard);
  const [boardCards, setBoardCards] = useState([]);
  const [mode, setMode] = useState(MODES.NONE);
  // const [openedTaskId, setOpenedTaskId] = useState(null);
  const styles = useStyles();

  const loadColumn = (state, page, perPage) =>
    TasksRepository.index({
      q: { stateEq: state },
      page,
      perPage,
    });
  const loadColumnInitial = (state, page = 1, perPage = 10) => {
    loadColumn(state, page, perPage).then(({ data }) => {
      setBoardCards((prevState) => ({
        ...prevState,
        [state]: { cards: data.items, meta: data.meta },
      }));
    });
  };
  const loadColumnMore = (state, page = 1, perPage = 10) => {
    loadColumn(state, page, perPage).then(({ data }) => {
      // console.log('data: ', data);
      // console.log('page: ', page);
      // console.log('perPage: ', perPage);
      // console.log('boardCards[state]: ', boardCards[state]);
      setBoardCards((prevState) => ({
        ...prevState,
        [state]: { cards: data.items, meta: data.meta },
      }));
    });
  };

  const loadBoard = () => {
    STATES.map(({ key }) => loadColumnInitial(key));
  };

  const generateBoard = () => {
    const boardToGenerate = {
      columns: STATES.map(({ key, value }) => ({
        id: key,
        title: value,
        cards: propOr({}, 'cards', boardCards[key]),
        meta: propOr({}, 'meta', boardCards[key]),
      })),
    };

    setBoard(boardToGenerate);
  };

  const handleCardDragEnd = (task, source, destination) => {
    const transition = task.transitions.find(({ to }) => destination.toColumnId === to);
    if (!transition) {
      return null;
    }

    return TasksRepository.update(task.id, { task: { stateEvent: transition.event } })
      .then(() => {
        loadColumnInitial(destination.toColumnId);
        loadColumnInitial(source.fromColumnId);
      })
      .catch((error) => {
        alert(`Move failed! ${error.message}`);
      });
  };

  const handleAddPopupOpen = () => {
    setMode(MODES.ADD);
  };

  const handleClose = () => {
    setMode(MODES.NONE);
  };
  const handleTaskCreate = (params) => {
    const attributes = TaskForm.attributesToSubmit(params);
    return TasksRepository.create(attributes).then(({ data: { task } }) => {
      loadColumnInitial(task.state);
      handleClose();
    });
  };

  const loadTask = (id) => TasksRepository.show(id).then(({ data: { task } }) => task);

  const handleTaskUpdate = (task) => {
    const attributes = TaskForm.attributesToSubmit(task);

    return TasksRepository.update(task.id, attributes).then(() => {
      loadColumnInitial(task.state);
      handleClose();
    });
  };

  useEffect(() => loadBoard(), []);
  useEffect(() => generateBoard(), [boardCards]);

  return (
    <div className={styles.root}>
      <Board
        onCardDragEnd={handleCardDragEnd}
        renderColumnHeader={(column) => <ColumnHeader column={column} onLoadMore={loadColumnMore} />}
        renderCard={(card) => <Task task={card} key={`${card.id}_${card.state}`} />}
      >
        {board}
      </Board>

      <Fab onClick={handleAddPopupOpen} className={styles.addButton} color="primary" aria-label="add">
        <AddRoundedIcon />
      </Fab>
      {mode === MODES.ADD && <AddPopup onCardCreate={handleTaskCreate} onClose={handleClose} />}
      {/* {mode === MODES.EDIT && (
        <EditPopup
          onCardLoad={loadTask}
          // onCardDestroy={handleTaskDestroy}
          // onCardUpdate={handleTaskUpdate}
          onClose={handleClose}
          cardId={openedTaskId}
        />
      )} */}
    </div>
  );
};

export default TaskBoard;
