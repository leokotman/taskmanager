import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { has, isEmpty } from 'ramda';

import { Button, Card, CardContent, CardHeader, IconButton, Modal, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import TaskForm from 'forms/TaskForm';
import TaskPresenter from 'presenters/TaskPresenter';

import useStyles from './styles';

const AddPopup = (props) => {
  const { onClose, onCardCreate } = props;
  const [task, changeTask] = useState(TaskForm.defaultAttributes());
  const [isSaving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const styles = useStyles();

  const handleCreate = (e) => {
    e.preventDefault();
    if (!isEmpty(task.name) && !isEmpty(task.description)) {
      setSaving(true);

      onCardCreate(task).catch((error) => {
        setSaving(false);
        setErrors(error || {});
        alert(`Creation Failed! Error: ${error.message}`);
      });
    }
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
          <form className={styles.form} onSubmit={handleCreate}>
            <TextField
              name="Name"
              error={has('name', errors)}
              helperText={errors.name}
              onChange={handleChangeTextField('name')}
              value={TaskPresenter.name(task)}
              label="Name"
              required
              margin="dense"
            />
            <TextField
              name="Description"
              error={has('description', errors)}
              helperText={errors.description}
              onChange={handleChangeTextField('description')}
              value={TaskPresenter.description(task)}
              label="Description"
              required
              margin="dense"
            />
            <Button disabled={isSaving} type="submit" variant="contained" size="small" color="primary">
              Add
            </Button>
          </form>
        </CardContent>
      </Card>
    </Modal>
  );
};

AddPopup.propTypes = {
  onClose: PropTypes.func.isRequired,
  onCardCreate: PropTypes.func.isRequired,
};

export default AddPopup;
