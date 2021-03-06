import React from "react";
import { Col, Container, Image, Row, Button, Tabs, Tab } from "react-bootstrap";
import DocumentView from "./DocumentView";
import moment from "moment";
import { getSignedInUser } from "../util/common";
import PostService from "../service/postService";
import ProfileService from "../service/profileService";
import JobService from "../service/jobService";
import EditProfile from "./EditProfile";
import EditPassword from "./EditPassword";
import EditPhoto from "./EditPhoto";
import UserIcon from "../images/user.png";

class Profile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUser: getSignedInUser(),
      userData: {},
      posts: [],
      jobs: [],
      showEditModal: false,
      showEditPasswordModal: false,
      showImageUpdateModal: false,
    };

    this.postService = new PostService(this.state.currentUser.accessToken);
    this.profileService = new ProfileService(
      this.state.currentUser.accessToken
    );
    this.jobService = new JobService(this.state.currentUser.accessToken);

    this.loadJobsByUserId = this.loadJobsByUserId.bind(this);
    this.loadPostsByUserId = this.loadPostsByUserId.bind(this);
    this.loadUserData = this.loadUserData.bind(this);
    this.updatePhoto = this.updatePhoto.bind(this);

    this.showModal = this.showModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.updateUser = this.updateUser.bind(this);
    this.updatePassword = this.updatePassword.bind(this);
    this.showEditPasswordModal = this.showEditPasswordModal.bind(this);
    this.closeEditPasswordModal = this.closeEditPasswordModal.bind(this);
    this.showImageUpdateModal = this.showImageUpdateModal.bind(this);
    this.closeImageUpdateModal = this.closeImageUpdateModal.bind(this);
    this.deletePost = this.deletePost.bind(this);
  }

  showModal() {
    this.setState({ showEditModal: true });
  }

  closeModal() {
    this.setState({ showEditModal: false });
  }

  showEditPasswordModal() {
    this.setState({ showEditPasswordModal: true });
  }

  closeEditPasswordModal() {
    this.setState({ showEditPasswordModal: false });
  }

  showImageUpdateModal() {
    this.setState({ showImageUpdateModal: true });
  }

  closeImageUpdateModal() {
    this.setState({ showImageUpdateModal: false });
  }

  loadUserData() {
    this.profileService
      .getUserData(this.state.currentUser.userId)
      .then((data) => {
        this.setState({ userData: data });
      });
  }

  loadPostsByUserId() {
    this.postService
      .getPostsByUserId(this.state.currentUser.userId)
      .then((data) => {
        this.setState({ posts: data });
      });
  }

  loadJobsByUserId() {
    this.jobService
      .getJobsByUserId(this.state.currentUser.userId)
      .then((data) => {
        this.setState({ jobs: data });
      });
  }

  componentDidMount() {
    this.loadUserData();
    this.loadPostsByUserId();
    this.loadJobsByUserId();
  }

  updateUser(updatedUser) {
    this.profileService
      .userUpdate({
        id: this.state.currentUser.userId,
        ...updatedUser,
      })
      .then((data) => {
        this.setState({ userData: data });
      });
  }

  updatePassword(currentPassword, newPassword) {
    this.profileService
      .updatePasswordRequest(
        this.state.currentUser.userId,
        currentPassword,
        newPassword
      )
      .then((message) => {
        alert(message);
        this.props.logout();
      });
  }

  updatePhoto(file) {
    this.profileService
      .updatePhoto(
        this.state.currentUser.userId,
        file
      )
      .then(() => {
        this.loadUserData();
        this.closeImageUpdateModal();
      });
  }

    deletePost(postId) {
      this.postService.deletePost(postId).then(() => this.loadPost());
    }  
    
  render() {
    const dateString = this.state.userData.dateOfBirth;
    const date = moment(dateString);
    return (
      <div>
        <EditProfile
          {...this.state.userData}
          show={this.state.showEditModal}
          close={this.closeModal}
          updateUser={this.updateUser}
        />

        <EditPassword
          {...this.state.currentUser.password}
          show={this.state.showEditPasswordModal}
          close={this.closeEditPasswordModal}
          updatePassword={this.updatePassword}
        />

        <EditPhoto
          {...this.state.currentUser.userId}
          show={this.state.showImageUpdateModal}
          close={this.closeImageUpdateModal}
          updatePhoto={this.updatePhoto}
        />

        <Container
          style={{
            width: "50%",
            paddingLeft: "150px",
            paddingTop: "35px",
            paddingBottom: "30px",
          }}
        >
          <Row>
            <Col>
              <Image
                onClick={this.showImageUpdateModal}
                style={{
                  display: "flex",
                  float: "left",
                  height: "150px",
                  width: "150px",
                  marginRight: "64px",
                  alignItems: "center",
                  justifyContent: "center",
                  objectFit: "fill",
                }}
                src={this.state.userData.fileurl || UserIcon}
                roundedCircle
              />
              <Button style={{ marginTop: "10px" }} onClick={this.showModal}>
                Edit Profile
              </Button>
              <Button
                style={{ marginTop: "5px" }}
                onClick={this.showEditPasswordModal}
              >
                Change Password
              </Button>
            </Col>
            <Col
              sm={4}
              style={{
                paddingRight: "50px",
                paddingTop: "15px",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <h4>Name:</h4>
              <h6>EnrollmentNo:</h6>
              <h6>Course:</h6>
              <h6>Passout Year: </h6>
              <h6>Birthdate:</h6>
              <h6>Email:</h6>
              <h6>Gender:</h6>
            </Col>
            <Col sm={4} style={{ paddingRight: "100px", paddingTop: "15px" }}>
              <h4>
                {this.state.userData.firstname} {this.state.userData.lastname}
              </h4>
              <h6>{this.state.userData.enrollmentNo}</h6>
              <h6>
                {this.state.userData.course} - {this.state.userData.branch}
              </h6>
              <h6>{this.state.userData.passoutYear}</h6>
              <h6>{date.format("DD/MM/YYYY")}</h6>
              <h6>{this.state.userData.email}</h6>
              <h6>{this.state.userData.gender}</h6>
            </Col>
          </Row>
        </Container>
        <Container
          style={{
            width: "55%",
            paddingTop: "35px",
            paddingLeft: "75px",
          }}
        >
          <Tabs style={{ justifyContent: "center" }} defaultActiveKey="post">
            <Tab eventKey="post" title="Post">
              <Row style={{ marginTop: "20px", marginLeft:"70px" }} xs={1} md={3}>
                {this.state.posts.map((post, i) => (
                  <Col style={{marginTop: "20px"}} key={i}>
                    <DocumentView
                      fileUrl={post.fileUrl}
                      postType={post.postType}
                      height={200}
                      width={200}
                    />
                  </Col>
                ))}
              </Row>
            </Tab>
            <Tab eventKey="job" title="Job">
              <Row style={{ marginTop: "20px", marginLeft:"70px" }} xs={1} md={3}>
                {this.state.jobs.map((job, i) => (
                  <Col style={{margingTop:"20px"}} key={i}>
                    <DocumentView
                      fileUrl={job.fileUrl}
                      postType={job.postType}
                      height={200}
                      width={200}
                    />
                  </Col>
                ))}
              </Row>
            </Tab>
          </Tabs>
        </Container>
      </div>
    );
  }
}

export default Profile;
