import * as adviceService from '../service/advice';

export default{
    namespace: 'advices',
    
    state: {
      adviceList: [],
    },

    effects: {
      *queryList({_},{ call,put }){
          const rsp = yield call(adviceService.queryList);
          yield put({type: 'saveList',payload:{ adviceList: rsp }});
      },
	  *addOne({payload},{ call, put }){
		const rsp = yield call(adviceService.addOne,payload);
		alert("您咨询建议的标号为‘"+rsp.id+"’,您可以按照此编号查找相关回复。");
		yield put({type: 'queryList'});
		return rsp;
	  },
	  *updateOne({payload},{call,put}){
	  	yield call(adviceService.updateOne,payload);
		yield put({type: 'queryList'});
	  },
	  *deleteOne({payload},{call,put}){
	  	yield call(adviceService.deleteOne,payload);
		yield put({type: 'queryList'});
	  },
    },

    reducers: {
      saveList(state,{payload:{adviceList}}){
        return{
          ...state,
          adviceList,
        }
      }
    },

};
