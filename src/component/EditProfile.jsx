import { Form, Button, Modal } from 'react-bootstrap';
import React from 'react'

export default class EditProfile extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            //email: props.email,
            phoneNumber: props.phoneNumber,
            course: props.course || "",
            branch: props.branch || "",
            passoutYear: props.passoutYear || ""
        }

        this.updateUser = this.updateUser.bind(this)
        this.handleFieldUpdate = this.handleFieldUpdate.bind(this)
    }

    handleFieldUpdate(field, value) {
        this.setState({ [field]: value });
    }

    updateUser() {
        this.props.updateUser({ ...this.state });
        this.props.close();
    }

    render() {
        return <Modal show={this.props.show} onHide={this.props.close}>
            <Modal.Header closeButton>
                <Modal.Title>Edit Profile</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group>
                        <Form.Label>Course</Form.Label>
                        <Form.Control
                            onChange={e => this.handleFieldUpdate("course", e.target.value)}
                            value={this.state.course}
                            type="text"
                            placeholder="Enter Course" />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Branch</Form.Label>
                        <Form.Control
                            onChange={e => this.handleFieldUpdate("branch", e.target.value)}
                            value={this.state.branch}
                            type="text"
                            placeholder="Enter branch" />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Passout Year</Form.Label>
                        <Form.Control
                            onChange={e => this.handleFieldUpdate("passoutYear", e.target.value)}
                            value={this.state.passoutYear}
                            type="text"
                            placeholder="Enter Passout Year" />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control
                            onChange={e => this.handleFieldUpdate("phoneNumber", e.target.value)}
                            value={this.state.phoneNumber}
                            type="number"
                            placeholder="Enter Phone Number" />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={this.updateUser}>Update</Button>
            </Modal.Footer>
        </Modal>
    }
}