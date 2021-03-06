import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router-dom';
import Bar from 'src/components/common/Bar';
import BarItem from 'src/components/common/BarItem';
import Button from 'src/components/common/Button';
import Container from 'src/components/common/Container';
import ContentGroup from 'src/components/common/ContentGroup';
import GroupUserForm from './GroupUserForm';
import GroupHeader from './GroupHeader';
import Label from 'src/components/common/Label';
import Title from 'src/components/common/Title';

export default class GroupUserUpdate extends Component {
  static defaultProps = {
    currentUser: {},
    group: {
      users: []
    }
  };

  render() {
    const {
      currentUser,
      updateUser,
      getUserIdByEmail,
      group,
      groupname,
      isWaitingUpdateUser,
      params,
      paramErrors,
      alert,
      setParams,
      logout
    } = this.props;

    return (
      <Container
        className="c-group-user-update"
        type="wrapper"
        isGroupHeadered={true}
      >
        <GroupHeader
          currentUser={currentUser}
          group={group}
          groupname={groupname}
          logout={logout}
          activeMenuItem={'user-update'}
        />
        <Container>
          <ContentGroup>
            <Title>
              개인정보 수정
            </Title>
          </ContentGroup>
          <ContentGroup>
            <ContentGroup size="small">
              <Label>
                그룹 탈퇴
              </Label>
              <Bar>
                <BarItem>
                  <Button
                    to={`/${groupname}/me/destroy`}
                    role="danger"
                  >
                    그룹 탈퇴
                  </Button>
                </BarItem>
              </Bar>
            </ContentGroup>
            <ContentGroup>
              <GroupUserForm
                isUpdate={true}
                onSubmit={updateUser}
                isWaitingSubmit={isWaitingUpdateUser}
                getUserIdByEmail={getUserIdByEmail}
                params={params}
                paramErrors={paramErrors}
                alert={alert}
                setParams={setParams}
              />
            </ContentGroup>
          </ContentGroup>
        </Container>
      </Container>
    );
  }
}
