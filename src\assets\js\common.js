//深克隆
const clone = (obj) => {
    let newObj = Array.isArray(obj) ? [] : {}
    if (obj && typeof obj === "object") {
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                newObj[key] = (obj && typeof obj[key] === 'object') ? clone(obj[key]) : obj[key];
            }
        }
    }
    return newObj
}

//冒泡排序：arr为数组对象，name为对象中需要排序的属性
function bubbleSort (arr, name) {
    var len = arr.length;
    for (var i = 0; i < len - 1; i++) {
        for (var j = 0; j < len - 1 - i; j++) {
            if (parseInt(arr[j][name]) > parseInt(arr[j + 1][name])) { // 相邻元素两两对比
                var temp = arr[j + 1]; // 元素交换
                arr[j + 1] = arr[j];
                arr[j] = temp;
            }
        }
    }
    return arr;
}

//下载文件
const download = (src, filName) => {
    let x = new XMLHttpRequest();
    x.open("GET", src, true);
    x.responseType = "blob";
    x.onload = function (e) {
        let url = window.URL.createObjectURL(x.response)
        let a = document.createElement('a')
        a.href = url
        console.log(url)
        a.download = filName
        a.click()
    }
    x.send()
}

//除去千分位

function clearComma (num) {
    if (num && num != 'undefined' && num != 'null') {
        let numS = num;
        numS = numS.toString();
        numS = numS.replace(/,/gi, '');
        return numS;
    } else {
        return num;
    }
}


module.exports = {
    clone,
    download,
    bubbleSort
}
