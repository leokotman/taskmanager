import React, { useEffect, useState } from 'react';
import Board, { moveCard } from '@asseinfo/react-kanban';
import { propOr } from 'ramda';

import Task from 'components/Task';
import ColumnHeader from 'components/ColumnHeader';
import TasksRepository from 'repositories/TasksRepository';

const STATES = [
  { key: 'new_task', value: 'New' },
  { key: 'in_development', value: 'In Dev' },
  { key: 'in_qa', value: 'In QA' },
  { key: 'in_code_review', value: 'in CR' },
  { key: 'ready_for_release', value: 'Ready for release' },
  { key: 'released', value: 'Released' },
  { key: 'archived', value: 'Archived' },
];

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
        [state]: { cards: data.items.filter((item) => item.state === state), meta: data.meta },
      }));
    });
  };
  const loadColumnMore = (state, page = 1, perPage = 10) => {
    loadColumn(state, page, perPage).then(({ data }) => {
      setBoardCards((prevState) => ({
        ...prevState,
        [state]: { cards: [...boardCards[state].cards, data.items], meta: data.meta },
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

    return TasksRepository.update(task.id, { ...task, stateEvent: transition.event })
      .then(() => {
        loadColumn(destination.toColumnId);
        loadColumn(source.fromColumnId);
        setBoard(moveCard(board, source, destination));
      })
      .catch((error) => {
        alert(`Move failed! ${error.message}`);
      });
  };

  useEffect(() => loadBoard(), []);
  useEffect(() => generateBoard(), [boardCards]);

  return (
    <Board
      onCardDragEnd={handleCardDragEnd}
      renderColumnHeader={(column) => <ColumnHeader column={column} onLoadMore={loadColumnMore} />}
      renderCard={(card) => <Task task={card} key={`${card.id}_${card.state}`} />}
    >
      {board}
    </Board>
  );
};

export default TaskBoard;
