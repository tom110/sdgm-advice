import { Component } from 'react';
import { Modal,Form,Card,Button,Table,Input,Icon } from 'antd';
import {connect} from 'dva';
import Moment from 'react-moment';
import Highlighter from 'react-highlight-words';

const FormItem=Form.Item;
const { TextArea } = Input;

class Advice extends Component{


    state={
	  searchText: '',
      visible: false,
      id: null,
      replyModalVisible: false,
      item: {},
    }

    getColumnSearchProps = dataIndex => ({
    	filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
	      <div style={{ padding: 8 }}>
		     <Input
		        ref={node => {
		            this.searchInput = node;
		        }}
		        value={selectedKeys[0]}
		        onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
		        onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
		        style={{ width: 188, marginBottom: 8, display: 'block' }}
		     />
		    <Button
		       type="primary"
		       onClick={() => this.handleSearch(selectedKeys, confirm)}
		       icon="search"
		       size="small"
		       style={{ width: 90, marginLeft: 1 }}
		    >
		    查询
		    </Button>
		    <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
		      重置
		    </Button>
		</div>
	),
	filterIcon: filtered => (
	  <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
	),
	onFilter: (value, record) =>
	   record[dataIndex]
	  .toString()
	  .toLowerCase()
	  .includes(value.toLowerCase()),
	  onFilterDropdownVisibleChange: visible => {
		     if (visible) {
		         setTimeout(() => this.searchInput.select());
		     }
   	},
	render: text => (
	   <Highlighter
	   highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
	   searchWords={[this.state.searchText]}
	    autoEscape
	   textToHighlight={text.toString()}
	  />
   ),
 });


	handleSearch = (selectedKeys, confirm) => {
   		 confirm();
	   	 this.setState({ searchText: selectedKeys[0] });
    };

    handleReset = clearFilters => {
	    clearFilters();
	    this.setState({ searchText: '' });
  };



     showReplyModal=(id)=>{
	   const{ adviceList } = this.props;
	   var tmp=adviceList.find(function(ele){return ele.id==id;})
	   this.setState({item:tmp});
	   this.setState({replyModalVisible: true});
	   this.setState({id:id});
     };

	deleteOne=(id)=>{
		var yes= confirm("是否确认删除此记录？");
		if(yes){
			this.props.dispatch({
				type: 'advices/deleteOne',
				payload: id,
			});	
		}
	};

    replyModalHandleOk=()=>{
	    this.setState({replyModalVisible: false});
    }
	 
    replyModalHandleCancel=()=>{
     this.setState({replyModalVisible: false});
    }


    showModal=()=>{
      this.setState({ visible:true });
    };


    handleOk = () => {
       this.setState({ visible: false });
    }


    handleCancel = () => {
      this.setState({
        visible: false,
      });
    }


    componentDidMount(){
      this.props.dispatch({
        type: 'advices/queryList',
      })
    }

    render(){

      const { visible,id,item,replyModalVisible } = this.state;

      const { adviceList,adviceLoading,form: { getFieldDecorator },dispatch } = this.props;


      const formItemLayout = {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
      };

      
	const columns = [ 	
		{ title: '编号',dataIndex: 'id', ...this.getColumnSearchProps('id')},
		{ title: '姓名', dataIndex: 'name',...this.getColumnSearchProps('name') }, 
		{ title: '手机', dataIndex: 'phone',...this.getColumnSearchProps('phone')}, 
		{ title: '邮箱', dataIndex: 'email',...this.getColumnSearchProps('phone')},
        { title: '咨询主题', dataIndex: 'title',...this.getColumnSearchProps('phone')},
        { 
        	title: '咨询时间', 
        	dataIndex: 'createtime',
        	render: (_,{createtime}) => {
            	return(
                	<Moment format="YYYY/MM/DD HH:mm:ss">{createtime}</Moment>
            	);
        	},
		},
		{ 
        	title: '答复时间', 
        	dataIndex: 'replytime',
        	render: (_,{replytime}) => {
        		return(
                	<Moment format="YYYY/MM/DD HH:mm:ss">{ replytime }</Moment>
            	);
        	},
		},

		{ 
        	title: '操作',
        	dataIndex: '',
        	render: (_,{id}) => <span><a href="javascript:;" onClick={ ()=>{ this.showReplyModal(id); } }>回复</a><pre></pre><a href="javascript:;" onClick={ ()=>{this.deleteOne(id);} }>删除</a></span>,
      	},
		];



      return(
      <div>
       <Button type="primary" onClick={ this.showModal } block>咨询建议</Button>
       			<CreateForm formItemLayout={formItemLayout } visible={visible} handleOk={this.handleOk} handleCancel={this.handleCancel} dispatch={dispatch}></CreateForm>
       			<UpdateForm formItemLayout={formItemLayout } id={id} item={item} replyModalVisible={replyModalVisible} replyModalHandleOk={this.replyModalHandleOk} replyModalHandleCancel={this.replyModalHandleCancel} dispatch={dispatch}></UpdateForm>			   

        <Table
           dataSource={adviceList}
           loading={adviceLoading}
           columns={columns}
           rowKey='id'
           expandedRowRender={record =><div> 
                     <p style={{ margin: 0,wordWrap: 'break-word',wordBreak: 'break-all',overflow: 'hidden' }}>咨询：{record.description}</p>
                     <br />
                     <p style={{ margin: 0 ,wordWrap: 'break-word',wordBreak: 'break-all',overflow: 'hidden' }}>答复：{record.reply}</p></div>}
        />,
       </div>
      );
    }
}

function mapStateToProps(state){
   return{
     adviceList: state.advices.adviceList,
     adviceLoading: state.loading.effects['advices/queryList'],
   }
}


class CreateForm extends React.Component{
    handleOk = () => {
      const { form: { validateFields },dispatch,handleOk } = this.props;

      validateFields((err, values) =>{ 
		if (!err) {
          dispatch({
            type: 'advices/addOne',
            payload: values,
          });
         handleOk(); 
        }
      });
    }

	
	render(){
	    const {formItemLayout, form:{getFieldDecorator},visible,handleOk,handleCancel}=this.props
		return(
			<Modal title="新建咨询" 
                   visible={visible} 
                   onOk={this.handleOk} 
                   okText="提交"
                   cancelText="取消"
                   onCancel={handleCancel}>

			<Form {...formItemLayout}>
                <FormItem label="姓名">
                 {getFieldDecorator('name',
				 							{
												initialValue: "",
				 								rules: [
													{ required: true, message: '请您输入您的姓名' },
													{ pattern: /^[\u4e00-\u9fa5]{1,5}$/, message: '您的姓名不正确,请检查' },
												],
											}
									)(<Input />)
				}
                </FormItem>
                <FormItem label="电话">
                 {getFieldDecorator('phone',{initialValue: "", rules:[{required: true,message: '请输入您的联系电话'},{pattern: /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/,message: '您输入的手机不正确'}]})(<Input />)}
                </FormItem>
                <FormItem label="邮箱">
                 {getFieldDecorator('email',{initialValue: "", rules: [{required: true,message: '请输入您的邮箱'},{ type: 'email',message: '输入格式错误' }],})(<Input />)}
                </FormItem>
                <FormItem label="咨询主题">
                 {getFieldDecorator('title',{initialValue: "", rules: [{required: true,message: '请您输入您的咨询主题'},{pattern: /^[\w\W]{1,20}$/,message: '您输入主题长度过长'},],})(<Input />)}
                </FormItem>
                <FormItem label="咨询内容">
                 {getFieldDecorator('description',{initialValue: "", rules: [{required: true,message: '请您输入您的咨询内容'},{pattern: /^[\w\W]{1,2000}$/,message: '您输入的内容长度多长'}],})(<TextArea />)}
                </FormItem>
                <FormItem label="咨询时间" style={{display:'none'}}>
                  {getFieldDecorator('createtime',{
                        initialValue: new Date().valueOf(), 
                     })(<Input disabled={true}  style={{display:'none'}}/>)}
                </FormItem>
               </Form>
			</Modal>
		);
	}

}

CreateForm=Form.create({})(CreateForm);

class UpdateForm extends React.Component{

	replyModalHandleOk=()=>{
        const { id,dispatch,adviceList,form: { validateFields },replyModalHandleOk } = this.props;
        validateFields((err,values) =>{
	    	if(!err){
			var dat={};
			dat.id=id;
			dat.values=values;
			dispatch({
		    	type: 'advices/updateOne',
		    	payload: dat,
			});
	     replyModalHandleOk(); 
	   }
      });
    }

	render(){
		const {formItemLayout,form:{getFieldDecorator},item,replyModalVisible,replyModalHandleOk,replyModalHandleCancel}=this.props;
		return(
			<Modal title="回复咨询" 
                   visible={replyModalVisible} 
                   onOk={this.replyModalHandleOk} 
                   okText="提交"
                   cancelText="取消"
                   onCancel={replyModalHandleCancel}>

			<Form {...formItemLayout}>
                <FormItem label="姓名" style={{display:'none'}}>
                 {getFieldDecorator('name',{initialValue: item.name})(<Input disabled={true} style={{display: 'none'}} />)}
                </FormItem>
                <FormItem label="电话" style={{display:'none'}}>
                 {getFieldDecorator('phone',{initialValue: item.phone})(<Input disabled={true}  style={{display:'none'}}/>)}
                </FormItem>
                <FormItem label="邮箱" style={{display:'none'}}>
                 {getFieldDecorator('email',{initialValue: item.email})(<Input  disabled={true} style={{display:'none'}} />)}
                </FormItem>
                <FormItem label="咨询主题">
                 {getFieldDecorator('title',{initialValue: item.title,})(<Input  disabled={true} />)}
                </FormItem>
                <FormItem label="咨询内容">
                 {getFieldDecorator('description',{
				 		initialValue: item.description,
				 	})(<TextArea  disabled={true} />)}
                </FormItem>
                <FormItem label="咨询时间" style={{ display: 'none' }}>
                  {getFieldDecorator('createtime',{
                        initialValue: item.createtime, 
                     })(<Input disabled={true} style={{display: 'none'}}/>)}
                </FormItem>
				<FormItem label="回复时间" style={{display:'none'}}>
                  {getFieldDecorator('replytime',{
                        initialValue: new Date().valueOf(), 
                     })(<Input disabled={true} style={{display:'none'}} />)}
                </FormItem>
                <FormItem label="回复内容">
                 {getFieldDecorator('reply',{initialValue: item.reply})(<TextArea />)}
                </FormItem>
               </Form>
			</Modal>
		);
	}

}
UpdateForm=Form.create({})(UpdateForm);
export default connect(mapStateToProps)(Form.create()(Advice));
