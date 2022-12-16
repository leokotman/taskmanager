import React, { useEffect, useState } from 'react';
import Board from '@asseinfo/react-kanban';
import { Fab } from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';

import TaskForm from 'forms/TaskForm';
import Task from 'components/Task';
import AddPopup from 'components/AddPopup';
import EditPopup from 'components/EditPopup';
import ColumnHeader from 'components/ColumnHeader';

import useTasks from 'hooks/store/useTasks';

import useStyles from './styles';
import { isNil } from 'ramda';

const MODES = {
  ADD: 'add',
  NONE: 'none',
  EDIT: 'edit',
};

const TaskBoard = () => {
  const { board, loadBoard, loadMoreTasks, loadTask, createTask, updateTask, destroyTask, dragCard } = useTasks();
  const [mode, setMode] = useState(MODES.NONE);
  const [openedTaskId, setOpenedTaskId] = useState(null);
  const styles = useStyles();

  useEffect(() => {
    loadBoard();
  }, []);

  const handleOpenAddPopup = () => {
    setMode(MODES.ADD);
  };

  const handleOpenEditPopup = (card) => {
    setOpenedTaskId(card.id);
    setMode(MODES.EDIT);
  };

  const handleClose = () => {
    setMode(MODES.NONE);
    setOpenedTaskId(null);
  };

  const handleCardDragEnd = (task, source, destination) => {
    if (isNil(dragCard(task, source, destination))) console.log("Can't drag card to this column");
  };

  const handleTaskCreate = (task) => {
    const attributes = TaskForm.attributesToSubmit(task);
    return createTask(attributes).then(handleClose());
  };

  const handleTaskLoad = () => loadTask(openedTaskId);

  const handleTaskUpdate = (task) => {
    const attributes = TaskForm.attributesToSubmit(task);
    return updateTask(task, attributes).then(handleClose());
  };

  const handleTaskDestroy = (task) => destroyTask(task).then(handleClose());

  const loadColumnMore = (state, page = 1, perPage = 10) => {
    loadMoreTasks(state, page, perPage);
  };

  return (
    <>
      <Board
        disableColumnDrag
        onCardDragEnd={handleCardDragEnd}
        renderCard={(card) => (
          <Task onClick={() => handleOpenEditPopup(card)} task={card} key={`${card.id}_${card.state}`} />
        )}
        renderColumnHeader={(column) => <ColumnHeader key={column.id} column={column} onLoadMore={loadColumnMore} />}
      >
        {board}
      </Board>

      <Fab onClick={handleOpenAddPopup} className={styles.addButton} color="primary" aria-label="add">
        <AddRoundedIcon />
      </Fab>
      {mode === MODES.ADD && <AddPopup onCardCreate={handleTaskCreate} onClose={handleClose} />}
      {mode === MODES.EDIT && (
        <EditPopup
          onCardLoad={handleTaskLoad}
          onCardDestroy={handleTaskDestroy}
          onCardUpdate={handleTaskUpdate}
          onClose={handleClose}
          cardId={openedTaskId}
        />
      )}
    </>
  );
};

export default TaskBoard;
