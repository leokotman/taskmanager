import PropTypes from 'prop-types';
import PropTypesPresenter from 'utils/PropTypesPresenter';
import UserPresenter from './UserPresenter';

export const STATES = [
  { key: 'new_task', value: 'New' },
  { key: 'in_development', value: 'In Dev' },
  { key: 'in_qa', value: 'In QA' },
  { key: 'in_code_review', value: 'in CR' },
  { key: 'ready_for_release', value: 'Ready for release' },
  { key: 'released', value: 'Released' },
  { key: 'archived', value: 'Archived' },
];

export default new PropTypesPresenter({
  id: PropTypes.number,
  assignee: UserPresenter.shape(),
  author: UserPresenter.shape(),
  name: PropTypes.string,
  state: PropTypes.string,
  description: PropTypes.string,
  expiredAt: PropTypes.instanceOf(Date),
  transitions: PropTypes.arrayOf(PropTypes.shape()),
});
