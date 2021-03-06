import React from "react";
import { Container } from "react-bootstrap";
import CommentService from "../service/commentService";
import PostService from "../service/postService";
import ReportService from "../service/reportService";
import { getSignedInUser } from "../util/common";
import CreatePost from "./CreatePost";
import Postitem from "./PostItem";

class Post extends React.Component {
  postService;
  commentService;

  constructor(props) {
    super(props);

    this.state = {
      currentUser: getSignedInUser(),
      posts: [],
    };

    this.postService = new PostService(this.state.currentUser.accessToken);
    this.commentService = new CommentService(
      this.state.currentUser.accessToken
    );
    this.reportService = new ReportService(this.state.currentUser.accessToken);
    this.loadPosts = this.loadPosts.bind(this);
    this.createPost = this.createPost.bind(this);
    this.createComment = this.createComment.bind(this);
    this.reportPost = this.reportPost.bind(this);
    this.deletePost = this.deletePost.bind(this);
  }

  componentDidMount() {
    this.loadPosts();
  }

  loadPosts() {
    this.postService.getPosts().then((data) => {
      if (data) {
        this.setState({ posts: data });
      }
    });
  }

  createPost(content, file) {
    this.postService
      .createPost(file, content, this.state.currentUser.userId)
      .then(() => this.loadPosts());
  }

  updatePost(postId) {
    this.postService.getPost(postId).then((updatePost) => {
      const updatedPosts = this.state.posts.map((post) => {
        if (post.postId === postId) {
          return updatePost;
        }
        return post;
      });
      this.setState({ posts: updatedPosts });
    });
  }

  reportPost(postId, message) {
    this.reportService
      .report(this.state.currentUser.userId, message, postId)
      .then((text) => alert(text));
  }

  deletePost(postId) {
    this.postService.deletePost(postId).then(() => this.loadPost());
  }

  createComment(postId, content) {
    this.commentService
      .createComment(this.state.currentUser.userId, content, (postId = postId))
      .then(() => this.updatePost(postId));
  }

  render() {
    return (
      <Container style={{ width: "50%" }}>
        <CreatePost createPost={this.createPost} />
        {this.state.posts &&
          this.state.posts.map((post, i) => (
            <Postitem
              isCurrentUserPost={this.state.currentUser.userId === post.user.id}
              isAdmin={this.props.isAdmin}
              createComment={this.createComment}
              report={this.reportPost}
              delete={this.deletePost}
              key={i}
              {...post}
            />
          ))}
      </Container>
    );
  }
}

export default Post;
