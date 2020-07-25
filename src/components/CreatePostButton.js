import React, {Component} from 'react';
import {Modal, Button} from 'antd';

import {TOKEN_KEY, API_ROOT, AUTH_HEADER, POS_KEY} from "../constants";

import CreatePostForm from "./CreatePostForm";

class CreatePostButton extends Component {
    state = {visible: false, confirmLoading: false}

    render() {
        const {confirmLoading, visible} = this.state;
        return (
            <div>
                <Button type="primary" onClick={this.showModal}>
                    Create New Post
                </Button>
                <Modal
                    title="Create New Post"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    okText="Create"
                    // confirmLoading={confirmLoading}
                >
                    <CreatePostForm ref={this.getFormRef}/>
                </Modal>
            </div>
        );
    }

    getFormRef = (formInstance) => {
        this.form = formInstance
    }

    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    handleOk = e => {
        console.log(e);
        // this.setState({
        //     visible: false,
        // });
        this.form.validateFields((err, values) => {
            if (!err) {
                console.log(values);
                // send image info to the server
                const {lat, lon} = JSON.parse(localStorage.getItem(POS_KEY));
                const token = localStorage.getItem(TOKEN_KEY);

                const formData = new FormData();
                formData.set('lat', lat);
                formData.set('lon', lon);
                formData.set('message', values.message);
                formData.set('image', values.image[0].originFileObj);

                this.setState({
                    confirmLoading: true,
                });

                // send data
                fetch(`${API_ROOT}/post`, {
                    method: 'POST',
                    headers: {Authorization: `${AUTH_HEADER} ${token}`},
                    body: formData,
                }).then(response => {
                    if (response.ok) {
                        return "OK"
                    }
                    throw new Error('failed in uploading')
                }).then(data => {
                    console.log('uploading ok');
                    this.setState({
                        confirmLoading: false,
                        visible: false
                    });
                    this.form.resetFields();
                }).catch(e => {
                    console.log(e)
                })
            }
        })
    };

    handleCancel = e => {
        console.log(e);
        this.setState({
            visible: false,
        });
    };
}

export default CreatePostButton;