import PropTypes from 'prop-types';
import PropTypesPresenter from 'utils/PropTypesPresenter';
import UserPresenter from './UserPresenter';

export default new PropTypesPresenter(
  {
    id: PropTypes.number,
    assignee: UserPresenter.shape(),
    author: UserPresenter.shape(),
    name: PropTypes.string,
    state: PropTypes.string,
    description: PropTypes.string,
    expiredAt: PropTypes.instanceOf(Date),
  },
  {
    assigneefullName(assignee) {
      return `${UserPresenter.firstName(assignee)} ${UserPresenter.lastName(assignee)}`;
    },
  },
);
