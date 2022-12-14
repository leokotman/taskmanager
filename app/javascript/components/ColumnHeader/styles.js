import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(() => ({
  root: {
    height: 42,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  hidden: {
    visibility: 'hidden',
  },
}));

export default useStyles;
