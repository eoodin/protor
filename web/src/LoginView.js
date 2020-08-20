import React, {Component} from 'react';
import {connect} from 'react-redux';

import {Button, Checkbox, Form, Input} from 'antd';
import Icon from '@ant-design/icons';

import './LoginView.css';

import {userLogin} from "./store/actions/profile";

class LoginView extends Component {

    componentDidMount() {

    }

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.login(this.props.form.getFieldsValue())
            }
        });
    };

    render() {
        // const {getFieldDecorator} = this.props.form;
        return (
            <div className="login-view">
                <div>
                    <h1>Welcome</h1>
                    <h2>Please login</h2>
                </div>
                <Form onSubmit={this.handleSubmit} className="login-form">
                    <Form.Item label="username" name="username" rules={[{required: true, message: 'Please input your username!'}]}>
                        <Input test-data="username"
                               prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>}
                               placeholder="Username"
                        />
                    </Form.Item>
                    <Form.Item label="password" name="password" rules={[{required: true, message: 'Please input your Password!'}]}>
                        <Input
                            test-data="password"
                            prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>}
                            type="password"
                            placeholder="Password"
                        />
                    </Form.Item>
                    <Form.Item label="password" name="remember">
                        <Checkbox>Remember me</Checkbox>
                        <p />
                        <Button type="primary" htmlType="submit" className="login-form-button">
                            Log in
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    profile: state.profile,
});

const mapDispatchToProps = dispatch => ({
    login: (form) => dispatch(userLogin(form))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LoginView);
