import React from 'react';
import PropTypes from 'prop-types';
import { isNil } from 'ramda';

import { Card, CardHeader, CardContent, Typography, IconButton } from '@mui/material';
import { Edit } from '@mui/icons-material';

import TaskPresenter from 'presenters/TaskPresenter';
import UserPresenter from 'presenters/UserPresenter';
import useStyles from './styles';

const Task = (props) => {
  const { task, onClick } = props;
  const classes = useStyles();

  const handleClick = () => onClick(task);

  const action = (
    <IconButton onClick={handleClick}>
      <Edit />
    </IconButton>
  );

  return (
    <Card variant="outlined" className={classes.root}>
      <CardHeader action={action} title={TaskPresenter.name(task)} />
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          {TaskPresenter.description(task)}
        </Typography>
        {!isNil(TaskPresenter.assignee(task)) && (
          <Typography variant="body2" color="textSecondary" component="p">
            Assignee:
            {UserPresenter.fullName(TaskPresenter.assignee(task))}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

Task.propTypes = {
  task: TaskPresenter.shape().isRequired,
  onClick: PropTypes.func.isRequired,
};

export default Task;
