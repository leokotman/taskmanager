import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { isNil } from 'ramda';
import { Button, Card, CardActions, CardContent, CardHeader, CircularProgress, IconButton, Modal } from '@mui/material';
import Close from '@mui/icons-material/Close';

import TaskPresenter from 'presenters/TaskPresenter';
import Form from 'components/Form';

import useStyles from './styles';

const EditPopup = (props) => {
  const { cardId, onClose, onCardDestroy, onCardLoad, onCardUpdate } = props;
  const [isSaving, setSaving] = useState(false);

  const [task, setTask] = useState(null);
  const [errors, setErrors] = useState({});
  const styles = useStyles();

  useEffect(() => {
    onCardLoad(cardId).then((res) => {
      setTask(res);
    });
  }, []);

  const handleCardUpdate = () => {
    setSaving(true);
    onCardUpdate(task).catch((error) => {
      setSaving(false);
      setErrors(error || {});

      if (error instanceof Error) {
        alert(`Update Failed! Error: ${error.message}`);
      }
    });
  };

  const handleCardDestroy = () => {
    setSaving(true);
    return onCardDestroy(task);
  };
  console.log(task);
  const isLoading = isNil(task);

  return (
    <Modal className={styles.modal} open onClose={onClose}>
      <Card className={styles.root}>
        <CardHeader
          action={
            <IconButton onClick={onClose}>
              <Close />
            </IconButton>
          }
          title={
            isLoading
              ? 'Your task is loading. Please be patient.'
              : `Task # ${TaskPresenter.id(task)} [${TaskPresenter.name(task)}]`
          }
        />
        <CardContent>
          {isLoading ? (
            <div className={styles.loader}>
              <CircularProgress />
            </div>
          ) : (
            <Form errors={errors} onChange={setTask} task={task} />
          )}
        </CardContent>
        <CardActions className={styles.actions}>
          <Button
            disabled={isLoading || isSaving}
            onClick={handleCardUpdate}
            size="small"
            variant="contained"
            color="primary"
          >
            Update
          </Button>
          <Button
            disabled={isLoading || isSaving}
            onClick={handleCardDestroy}
            size="small"
            variant="contained"
            color="secondary"
          >
            Destroy
          </Button>
        </CardActions>
      </Card>
    </Modal>
  );
};

EditPopup.propTypes = {
  cardId: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
  onCardDestroy: PropTypes.func.isRequired,
  onCardLoad: PropTypes.func.isRequired,
  onCardUpdate: PropTypes.func.isRequired,
};

export default EditPopup;
