import {Component} from 'react';
import { Layout } from 'antd';

const { Header,Content,Footer } = Layout;

export default class BasicLayout extends Component{
    render(){
      return (
        <Layout>
            <Content style={{margin: '24px 16px 0'}}>
              <div style={{padding: 24, background: '#fff', minHeight: 360}}>
                {this.props.children}
              </div>
            </Content>
       </Layout>
      )
    }
}
