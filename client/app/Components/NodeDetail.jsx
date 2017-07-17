import React from 'react';
import { Button, FormGroup, Form, Col, FormControl, ControlLabel } from 'react-bootstrap';

class NodeDetail extends React.Component {

  addChild() {
    console.log('adding node')
    const nodes = this.props.nodes;
    const links = this.props.links;

    const lastKey = nodes[nodes.length - 1].key;
    const lastLinkKey = links[links.length-1] ? links[links.length - 1].key : 0

    const newNode = {key: lastKey+1, size:20, x: 20, y: 20}
    const newLink = {source: nodes.length, target: this.props.currentNode.index, key: lastLinkKey+1, size: 2}

    this.props.addNode(newNode)
    this.props.addLink(newLink)

  }


  onSubmit(e, props) {
    e.preventDefault();
    console.log('title: ', e.target.title.value);
    console.log('detail: ', e.target.text.value);
    //userId, parentId, sessionId, title, text
    console.log('this: ', this);
    console.log('this.props.user', this.props.user.userId);
    console.log('parent node: ', this.props.currentNode.key);

    this.props.addComment(this.props.user.userId, this.props.currentNode.key, 1, e.target.title.value, e.target.text.value);


  }

  upvote() {

    // let currentNode = this.props.currentNode
    // let newNode = { ...currentNode }
    // console.log("newNode size before: ", newNode.size)
    // newNode.size+=20
    // console.log("newNode size after: ", newNode.size)

    // this.props.updateNode(newNode)
    // this.props.setNode(newNode)

  }

  downvote() {
    // var newNode = {...this.props.currentNode };
    // newNode.size--;

    // this.props.updateNode(newNode);
  }

  render() {
    return (
      <div>
        <h2>Hi! I am node {this.props.currentNode.key}</h2>
        <p>This idea is literally the best idea ever. We should totally do this idea. You know what's awesome? This idea. Why? Because! Vote for Pedro!</p>
        <Button bsStyle="info" className="add-comment" onClick={() => this.props.addComment('123', '345', '678', 'first comment', 'yassssss')}>Add Test Comment</Button>
        <Button bsStyle="info" className="upvote" onClick={()=>console.log("blahblahblah")}>-</Button>
        <Button bsStyle="info" className="downvote" onClick={()=>console.log("blahblahblah")}>+</Button>
        <h4>Node Child 1</h4>
        <h4>Node Child 2</h4>
        <h4>Node Child 3</h4>
        <h2>Add a comment:</h2>
        <Form horizontal onSubmit={this.onSubmit.bind(this)}>
          <FormGroup controlId="commentTitle">
            <Col componentClass={ControlLabel} sm={2}>
              Title:
            </Col>
            <Col sm={10}>
              <FormControl type="title" name="title" placeholder="Title" />
            </Col>
          </FormGroup>
          <FormGroup controlId="formHorizontalPassword">
            <Col componentClass={ControlLabel} sm={2}>
              Details:
            </Col>
            <Col sm={10}>
              <FormControl type="details" name="text" placeholder="Elaborate here!" />
            </Col>
          </FormGroup>
          <FormGroup>
            <Col smOffset={2} sm={10}>
              <Button type="submit">
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
