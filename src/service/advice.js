import request from '../util/request';

export function queryList(){
    return request('http://localhost:8080/ad_advice');
}

export function addOne(data){
    return request('http://localhost:8080/ad_advice/json',{
	    headers:{
		    'content-type': 'application/json',
		},
		method: 'POST',
		body: JSON.stringify(data),
	});
}
export function updateOne(data){
	return request('http://localhost:8080/ad_advice/json/'+data.id,{
		headers:{
			'content-type': 'application/json',
		},
		method: 'PUT',
		body: JSON.stringify(data.values),
	});
}
export function deleteOne(data){
	return request('http://localhost:8080/ad_advice/'+data,{
		method: 'DELETE',
	});
}
