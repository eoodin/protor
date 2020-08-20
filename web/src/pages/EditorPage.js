import React from 'react';

import {useHistory, useRouteMatch} from "react-router-dom";
import {Breadcrumb, Layout, Menu} from 'antd';
import Icon from '@ant-design/icons';

const {Content, Sider} = Layout;
const {SubMenu} = Menu;

export default function () {
    const match = useRouteMatch();
    const history = useHistory();
    return (
        <Layout>
            <Sider collapsible>
                <div className="logo"/>
                <Menu theme="dark" mode="inline">
                    <Menu.Item key="1" onClick={() => history.push(`${match.url}/projects`)}>
                        <Icon type="pie-chart"/>
                        <span>Projects</span>
                    </Menu.Item>
                    <Menu.Item key="2" onClick={() => history.push(`${match.url}/teams`)}>
                        <Icon type="pie-chart"/>
                        <span>Teams</span>
                    </Menu.Item>
                    <SubMenu
                        key="sub1"
                        title={
                            <span>
                                <Icon type="user"/>
                                <span>Users</span>
                            </span>
                        }>
                        <Menu.Item key="3">Tom</Menu.Item>
                        <Menu.Item key="4">Hello</Menu.Item>
                    </SubMenu>
                </Menu>
            </Sider>
            <Layout>
                <Content style={{margin: '0 16px'}}>
                    <Breadcrumb style={{margin: '16px 0'}}>
                        <Breadcrumb.Item>User</Breadcrumb.Item>
                        <Breadcrumb.Item>Bill</Breadcrumb.Item>
                    </Breadcrumb>
                    <div><h1>hello</h1></div>
                </Content>
            </Layout>
        </Layout>
    );
}
