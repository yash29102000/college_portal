import React from "react";
import moment from "moment";
import Purple from "../images/purple.jpeg";
import { withRouter } from "react-router-dom";
import PostService from "../service/postService";
import ProfileService from "../service/profileService";
import JobService from "../service/jobService";
import { getSignedInUser } from "../util/common";
import { Col, Container, Image, Row, Button } from "react-bootstrap";
import DocumentView from "./DocumentView";

class UserProfile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUser: getSignedInUser(),
      posts: [],
      jobs: [],
      userData: null,
    };

    this.postService = new PostService(this.state.currentUser.accessToken);
    this.profileService = new ProfileService(
      this.state.currentUser.accessToken
    );
    this.jobService = new JobService(this.state.currentUser.accessToken);

    this.loadJobsByUserId = this.loadJobsByUserId.bind(this);
    this.loadPostsByUserId = this.loadPostsByUserId.bind(this);
    this.loadUserData = this.loadUserData.bind(this);
  }

  loadUserData(userId) {
    this.profileService.getUserData(userId).then((data) => {
      this.setState({ userData: data });
    });
  }

  loadPostsByUserId(userId) {
    this.postService.getPostsByUserId(userId).then((data) => {
      this.setState({ posts: data });
    });
  }

  loadJobsByUserId(userId) {
    this.jobService.getJobsByUserId(userId).then((data) => {
      this.setState({ jobs: data });
    });
  }

  componentDidMount() {
    const id = this.props.match.params.id;
    this.loadUserData(id);
    this.loadPostsByUserId(id);
    this.loadJobsByUserId(id);
  }

  render() {
    const dateString = this.state.userData.dateOfBirth;
    const date = moment(dateString);

    if (this.state.userData) {
      return (
        <div>
          <Container
            style={{
              width: "50%",
              paddingLeft: "150px",
              paddingTop: "35px",
              paddingBottom: "30px",
              borderBottom: "1px solid black",
            }}
          >
            <Row>
              <Col>
                <Image
                  style={{
                    display: "flex",
                    float: "left",
                    height: "200px",
                    width: "220px",
                    marginRight: "64px",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  src={Purple}
                  roundedCircle
                />
              </Col>
              <Col
                style={{
                  paddingRight: "250px",
                  paddingTop: "5px",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <h4>
                  {JSON.stringify(this.state.userData.firstname)} {JSON.stringify(this.state.userData.lastname)}
                </h4>
                <h6>{JSON.stringify(this.state.userData.enrollmentNo)}</h6>
                <h6>
                  {JSON.stringify(this.state.userData.course)} {JSON.stringify(this.state.userData.branch)}
                </h6>
                <h6>{JSON.stringify(this.state.userData.passoutYear)}</h6>
                <h6>{date.format("DD/MM/YYYY")}</h6>
                <h6>{JSON.stringify(this.state.userData.email)}</h6>
                <h6>{JSON.stringify(this.state.userData.gender)}</h6>
              </Col>
            </Row>
          </Container>
          <Container
            style={{
              width: "55%",
              paddingTop: "35px",
            }}
          >
            <Row xs={1} md={3}>
              {this.state.posts.map((post, i) => (
                <Col key={i}>
                  <DocumentView
                    fileUrl={post.fileUrl}
                    postType={post.postType}
                    height={200}
                    width={200}
                  />
                </Col>
              ))}
            </Row>
          </Container>
        </div>
      );
    }
    return "Loading...";
  }
}

export default withRouter(UserProfile);

//User Data: {JSON.stringify(this.state.userData)}