import React from 'react';
import PropTypes from 'prop-types';
import { isNil } from 'ramda';

import { Card, CardHeader, CardContent, Typography, IconButton } from '@mui/material';
import { Edit } from '@mui/icons-material';

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
      <CardHeader action={action} title={task.name} />
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          {task.description}
        </Typography>
        {!isNil(task.assignee) && (
          <Typography variant="body2" color="textSecondary" component="p">
            Assignee:
            {`${task.assignee.firstName} ${task.assignee.lastName}`}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

Task.propTypes = {
  task: PropTypes.shape().isRequired,
  onClick: PropTypes.func.isRequired,
};

export default Task;
