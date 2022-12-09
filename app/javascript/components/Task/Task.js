import React from 'react';
import PropTypes from 'prop-types';

import { Card, CardHeader, CardContent, Typography } from '@mui/material';

import useStyles from './styles';

const Task = (props) => {
  const { task } = props;
  const classes = useStyles();

  return (
    <Card variant="outlined" className={classes.root}>
      <CardHeader title={task.name} />
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          {task.description}
        </Typography>
      </CardContent>
    </Card>
  );
};

Task.propTypes = {
  task: PropTypes.shape().isRequired,
};

export default Task;
