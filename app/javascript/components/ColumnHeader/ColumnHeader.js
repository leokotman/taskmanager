import React from 'react';
import PropTypes from 'prop-types';

import IconButton from '@mui/material/IconButton';
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';

import useStyles from './styles';

const ColumnHeader = (props) => {
  const styles = useStyles();
  const { column, onLoadMore } = props;

  const {
    id,
    title,
    cards,
    meta: { totalCount, currentPage },
  } = column;

  const count = cards.length;

  const handleLoadMore = () => onLoadMore(id, currentPage + 1);

  return (
    <div className={styles.root}>
      <div className={styles.title}>
        <b>{title}</b> ({count}/{totalCount || '…'})
      </div>
      <div className={count >= totalCount || count === 0 ? styles.hidden : ''}>
        <IconButton aria-label="Load more" onClick={() => handleLoadMore()}>
          <SystemUpdateAltIcon fontSize="small" />
        </IconButton>
      </div>
    </div>
  );
};

ColumnHeader.propTypes = {
  onLoadMore: PropTypes.func.isRequired,
  column: PropTypes.shape().isRequired,
  // id: PropTypes.number.isRequired,
  // title: PropTypes.string.isRequired,
  // cards: PropTypes.arrayOf.isRequired,
  // meta: PropTypes.shape().isRequired,
};

export default ColumnHeader;
