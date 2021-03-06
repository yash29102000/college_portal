import { IconButton } from "@material-ui/core";
import {
  CloudDownloadRounded,
  Comment,
  Delete,
  Report,
} from "@material-ui/icons";
import React, { useState } from "react";
import {
  Form,
  Button,
  Popover,
  Card,
  Container,
  OverlayTrigger,
  Col,
  Nav,
} from "react-bootstrap";
import CommentItem from "./CommentItem";
import CreateComment from "./CreateComment";
import DocumentView from "./DocumentView";
import moment from "moment";

export default function Postitem(props) {
  const [showComments, setShow] = useState(false);
  const [reportMessage, setReportMessage] = useState("");

  const dateString = props.postDate;
  const date = moment(dateString);

  return (
    <Container style={{ paddingTop: "20px" }} fixed>
      <Card>
        <Card.Header>
          <Card.Title>
            <Nav.Link href={"/user/" + props.user.id}>{props.user.firstname} {props.user.lastname}
              {(props.isAdmin || props.isCurrentUserPost) && <IconButton style={{ float: "right" }}><Delete /></IconButton>}
            </Nav.Link>
            <Card.Subtitle style={{ marginLeft: "20px", fontSize: "14px" }}>{date.format("DD/MM/YYYY")}</Card.Subtitle>
          </Card.Title>
        </Card.Header>

        <Card.Body>
          <p>{props.content}</p>
          {props.postType && (
            <DocumentView
              postType={props.postType}
              fileUrl={props.fileUrl}
              width={100}
              height={100}
            />
          )}
        </Card.Body>

        <Card.Footer>
          <a
            href={props.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            download
          >
            <IconButton>
              <CloudDownloadRounded />
            </IconButton>
          </a>
          <IconButton onClick={() => setShow(!showComments)}>
            <Comment />
          </IconButton>
          {showComments && (
            <div>
              <CreateComment
                createComment={(content) =>
                  props.createComment(props.postId, content)
                }
              />
              {props.comments.map((comment, i) => (
                <CommentItem key={i} {...comment} />
              ))}
            </div>
          )}
          <OverlayTrigger
            trigger="click"
            placement="right"
            overlay={
              <Popover id="popover-basic">
                <Popover.Title as="h3">Report Message</Popover.Title>
                <Popover.Content>
                  <Form>
                    <Form.Row className="align-items-center">
                      <Col xs="auto">
                        <Form.Control
                          className="mb-2"
                          value={reportMessage}
                          onChange={(e) => setReportMessage(e.target.value)}
                          type="text"
                          placeholder="Write something..."
                        />
                      </Col>
                      <Col xs="auto">
                        <Button
                          className="mb-2"
                          onClick={() =>
                            props.report(props.postId, reportMessage)
                          }
                        >
                          Report
                        </Button>
                      </Col>
                    </Form.Row>
                  </Form>
                </Popover.Content>
              </Popover>
            }
          >
            <IconButton style={{ alignItems: "flex-end" }}>
              <Report />
            </IconButton>
          </OverlayTrigger>
          {props.isAdmin && (
            <IconButton
              onClick={() => props.delete(props.postId)}
              style={{ float: "right" }}
            >
              <Delete />
            </IconButton>
          )}
        </Card.Footer>
      </Card>
    </Container>
  );
}

/*<div>
    <h1>{props.postTitle}</h1>
    <h3>{props.postDate}</h3>
    <p>{props.content}</p>
    <hr />
    <div style={{ padding: "0px 50px" }}>
        {props.comments?.map((comment, i) => <CommentItem key={i} {...comment} />)}
    </div>
</div>*/
