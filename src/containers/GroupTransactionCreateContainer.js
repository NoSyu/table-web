import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { createTransaction, logout } from '../actions';
import GroupTransactionCreate from '../components/GroupTransactionCreate';

const CREATE_TRANSACTION_PARAMS = {
  'transaction[from_user_ids]': '[]',
  'transaction[to_user_id]': '',
  'transaction[amount]': '',
  'transaction[description]': '',
  'totalAmount': '',
};

const CREATE_TRANSACTION_PARAM_ERRORS = {
  'transaction[from_user_ids]': '',
  'transaction[to_user_id]': '',
  'transaction[amount]': '',
  'transaction[description]': '',
};

class GroupTransactionCreateContainer extends Component {
  static propTypes = {

  };

  state = {
    params: Object.assign({}, CREATE_TRANSACTION_PARAMS),
    paramErrors: Object.assign({}, CREATE_TRANSACTION_PARAM_ERRORS),
    alert: null,
    alertRole: null,
    redirectToHome: false,
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.isFromCurrentUser !== this.props.isFromCurrentUser) {
      this.setState({
        alert: null,
        alertRole: null,
      });
    }
  }

  setParams = params => {
    this.setState({ params }, () => {
      this.validateParams();
    });
  };

  createTransaction = () => {
    const {
      params,
      paramErrors,
    } = this.state;
    const {
      currentUser,
      isFromCurrentUser,
      groupIndex,
      groupname,
      refreshPage,
    } = this.props;
    const isError = Object.keys(paramErrors).map(key => paramErrors[key]).join('') !== '';

    if (!isError) {
      this.setState({ alert: null }, () => {
        this.props.createTransaction(Object.assign({}, params, {
          groupId: this.props.groupIndex
        }, isFromCurrentUser ? {
          'transaction[from_user_ids]': JSON.stringify([currentUser.id])
        } : {
          'transaction[to_user_id]': currentUser.id
        })).then(v => {
          if (v.response) {
            ga('send', 'event', 'transaction', isFromCurrentUser ? 'create' : 'create-request', groupname);
            refreshPage();
            this.setState({
              params: Object.assign({}, CREATE_TRANSACTION_PARAMS),
              paramErrors: Object.assign({}, CREATE_TRANSACTION_PARAM_ERRORS),
              alert: '요청하신 거래를 등록했습니다.',
              alertRole: 'success',
            });
          } else if (v.error) {
            ga('send', 'event', 'web-error', isFromCurrentUser ? 'create' : 'create-request', groupname);
            this.setState({
              alert: '거래 등록에 실패했습니다. 작성된 내용을 다시 확인해 주세요.',
              alertRole: 'danger',
            });
          }
        });
      });
    } else {
      this.setState({
        alert: '거래 등록에 실패했습니다. 작성된 내용을 다시 확인해 주세요.',
        alertRole: 'danger',
      });
    }
  };

  validateParams() {
    const { params } = this.state;
    const paramErrors = {};
    if (params['transaction[amount]']) {
      if (parseFloat(params['transaction[amount]']) <= 0) {
        paramErrors['transaction[amount]'] = '금액은 0보다 커야 합니다.'
      }
    }
    this.setState({ paramErrors: Object.assign({}, CREATE_TRANSACTION_PARAM_ERRORS, paramErrors) });
  }

  logout = () => {
    this.props.logout({
      groupId: this.props.groupIndex
    });
  };

  render() {
    const {
      currentUser,
      group,
      groupname,
      isFromCurrentUser,
      isWaitingCreateTransaction,
    } = this.props;
    const {
      params,
      paramErrors,
      alert,
      alertRole,
      redirectToHome
    } = this.state;

    if (redirectToHome) {
      return <Redirect push to={`/${groupname}/`} />;
    }

    return (
      <GroupTransactionCreate
        params={params}
        paramErrors={paramErrors}
        alert={alert}
        alertRole={alertRole}
        currentUser={currentUser}
        group={group}
        groupname={groupname}
        isFromCurrentUser={isFromCurrentUser}
        isWaitingCreateTransaction={isWaitingCreateTransaction}
        createTransaction={this.createTransaction}
        setParams={this.setParams}
        logout={this.logout}
      />
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const groupIndex = state.entities.groupIndexes[ownProps.groupname];
  const groupSession = groupIndex ? state.entities.groupSessions[groupIndex] : null;
  const group = groupIndex ? state.entities.groups[groupIndex] : null;
  const currentUser = groupIndex ? state.entities.groupCurrentUsers[groupIndex] : null;
  const isWaitingCreateTransaction = state.isWaiting.createTransaction;

  return {
    groupIndex,
    groupSession,
    group,
    currentUser,
    isWaitingCreateTransaction,
  };
};

export default connect(mapStateToProps, {
  createTransaction,
  logout
})(GroupTransactionCreateContainer);
