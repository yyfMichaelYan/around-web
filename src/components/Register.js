import React, {Component} from 'react';
import {Form, Input} from 'antd';

class RegistrationForm extends Component {
    render() {
        const {getFieldDecorator} = this.props.form;

        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 8},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 16},
            },
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 16,
                    offset: 8,
                },
            },
        };

        return (
            <Form {...formItemLayout}>
                <Form.Item label="Username">
                    {
                        getFieldDecorator("username", {
                            rules: [
                                {
                                    required: true,
                                    message: 'Please input your username!'
                                }
                            ]
                        })(<Input/>)
                    }
                </Form.Item>

                <Form.Item label="Password" hasFeedback>

                </Form.Item>

                <Form.Item label="Confirm Password">

                </Form.Item>
            </Form>
        );
    }
}

const Register = Form.create({name: 'register'})(RegistrationForm);

export default Register;