import React from 'react';
import { Button, FormGroup, Form, Col, FormControl, ControlLabel } from 'react-bootstrap';
import InviteDetail from './InviteDetail.jsx';
import { hideInviteDetail } from '../actions/actionsCreators';
import { buildEmailArray } from '../helpers.js'
import { inviteUsers } from '../axiosCalls'


class NodeDetail extends React.Component {

  onSubmit(e, props) {
    e.preventDefault();
    this.props.clearComments();
    var array = buildEmailArray(e.target.emails.value);
    this.props.thunkCreateSessionAndInvite(e.target.title.value, e.target.text.value, this.props.user.userId, array);
    // console.log('emails array: ', array);
    // console.log('sessionId: ', this.props.session.sessionId);
    // inviteUsers(array, this.props.session.sessionId);
    this.props.hideCreateSession();
  }

  render() {
    return (
      <div className="new-session-modal-content">
        <h4>Start a Session</h4>
        <Form horizontal onSubmit={this.onSubmit.bind(this)}>
          <FormGroup controlId="commentTitle">
            <Col sm={10}>
              <FormControl autoFocus="autofocus" name="title" type="title" placeholder="Session Title" />
            </Col>
          </FormGroup>
          <FormGroup controlId="formHorizontalPassword">
            <Col sm={10}>
              <FormControl name="text" type="details" placeholder="Session Details" />
            </Col>
          </FormGroup>
          <h5>Invite Session Users</h5>
          <FormGroup className="form-horizontal form-group" controlId="inviteEmails">
            <Col sm={10}>
              <FormControl name="emails" type="emails" placeholder="sam@gmail, pete@gmail, etc." />
            </Col>
          </FormGroup>
          <FormGroup className="form-horizontal form-group">
            <Col sm={10}>
              <Button className="submit-btn" type="submit">
                Submit
              </Button>
            </Col>
          </FormGroup>
        </Form>
      </div>
    )
  }
}
export default NodeDetail;
