import {request , request2} from "./request";
import axios from 'axios';

export function searchSpiderTask(data) {
  return request({
    url: '/crypto/mulsearch/',
    method: 'get',
    params: data
  })
}

export function eventextract(data) {
  return request({
    url: '/api/event_extract',
    method: 'post',
    data: data
  })
}

export function checkContent(user_id, content_id) {
  return request({
    url: `/api/check_content?user_id=${user_id}&content_id=${content_id}`,
    method: 'get'
  })
}

//事件脉络分析
export function getstoryline(data) {
  console.log('getstoryline_api')
  return request2({
    url: '/api/storyline',
    method: 'post',
    data:data,
    headers: {
      'Content-Type':'multipart/form-data',
    },
  })
}

export function nerextract(data) {
  return axios.post('/ner', data);
}

export function parseauthororg(data) {
  return axios.post('/parse-author-org', data);
}



// //结果数据集
// export function getDatasetName_result() {
//   console.log('getDatasetName_result_api')
//   return request({
//     url: '/api/datasets_result',
//     method: 'get',
//     headers: {
//       'Content-Type':'application/json',
//     },
//   })
// }

// //上传文件
// export function upload(data) {
//     console.log('upload_api')
//     return request({
//       url: '/api/metric',
//       method: 'post',
//       data:data,
//       headers: {
//         // 'Content-Type': 'application/json',
//         'Content-Type':'multipart/form-data',
//       },
//     })
//   }

// //查询结果
// export function get_result(data) {
//     console.log('get_result_api')
//     return request({
//       url: '/api/result',
//       method: 'post',
//       data:data,
//       headers: {
//         'Content-Type': 'application/json', // 设置请求头 Content-Type 为 application/json
//     }
//     })
//   }