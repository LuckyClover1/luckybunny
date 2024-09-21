function makeRequest(method, url, data, callback) {
    // 创建XMLHttpRequest对象
    var xhr = new XMLHttpRequest();

    // 设置请求的类型、URL和是否异步
    xhr.open(method, url, true);

    // 根据请求类型设置Content-Type
    if (method === 'POST') {
        xhr.setRequestHeader('Content-Type', 'application/json');
    }

    // 设置响应类型为json
    xhr.responseType = 'json';

    // 设置当请求的状态改变时，调用的函数
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {  // 请求完成
            if (xhr.status == 200) {  // 请求成功
                if(!!callback){
                    callback(null, xhr.response);  // 返回数据
                }
            } else {  // 请求失败
                if(!!callback){
                    callback('Error: ' + xhr.status, null);
                }
            }
        }
    };

    // 发送请求
    if (method === 'POST') {
        xhr.send(JSON.stringify(data));
    } else {
        xhr.send();
    }
}
// // 使用示例
// makeRequest('GET', 'http://example.com', null, function(err, res) {
//     if (err) {
//         console.error(err);
//     } else {
//         console.log(res);
//     }
// });

// makeRequest('POST', 'http://example.com', {key: 'value'}, function(err, res) {
//     if (err) {
//         console.error(err);
//     } else {
//         console.log(res);
//     }
// });
