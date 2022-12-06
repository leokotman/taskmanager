import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { has } from 'ramda';

import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';

import TaskForm from '../../form/TaskForm';

import useStyles from './styles';

const AddPopup = (props) => {
  const { onClose, onCardCreate } = props;
  const [task, changeTask] = useState(TaskForm.defaultAttributes());
  const [isSaving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const styles = useStyles();

  const handleCreate = () => {
    setSaving(true);

    onCardCreate(task).catch((error) => {
      setSaving(false);
      setErrors(error || {});

      if (error instanceof Error) {
        alert(`Creation Failed! Error: ${error.message}`);
      }
    });
  };
  const handleChangeTextField = (fieldName) => (event) => changeTask({ ...task, [fieldName]: event.target.value });

  return (
    <Modal className={styles.modal} open onClose={onClose}>
      <Card className={styles.root}>
        <CardHeader
          action={
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          }
          title="Add New Task"
        />
        <CardContent>
          <div className={styles.form}>
            <TextField
              error={has('name', errors)}
              helperText={errors.name}
              onChange={handleChangeTextField('name')}
              value={task.name}
              label="Name"
              required
              margin="dense"
            />
            <TextField
              error={has('description', errors)}
              helperText={errors.description}
              onChange={handleChangeTextField('description')}
              value={task.description}
              label="Description"
              required
              margin="dense"
            />
          </div>
        </CardContent>
        <CardActions className={styles.actions}>
          <Button disabled={isSaving} onClick={handleCreate} variant="contained" size="small" color="primary">
            Add
          </Button>
        </CardActions>
      </Card>
    </Modal>
  );
};

AddPopup.propTypes = {
  onClose: PropTypes.func.isRequired,
  onCardCreate: PropTypes.func.isRequired,
};

export default AddPopup;
