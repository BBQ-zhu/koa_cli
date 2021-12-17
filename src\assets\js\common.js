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

//号码中位数隐藏
const phoneNum = (phone) => {
    let arr = phone
    return arr.slice(0, 3) + '****' + arr.slice(-4)
}

//冒泡排序：arr为数组对象，name为对象中需要排序的属性
function bubbleSort(arr, name) {
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

function clearComma(num) {
    if (num && num != 'undefined' && num != 'null') {
        let numS = num;
        numS = numS.toString();
        numS = numS.replace(/,/gi, '');
        return numS;
    } else {
        return num;
    }
}

//依据数组对象中的某个值排序 // arr.sort(compare('age'))
function compare(property){
    return function(a,b){
        var value1 = a[property];
        var value2 = b[property];
        return value1 - value2;
    }
}

// 千位分隔符
const moneyFormat = (val, none = '') => {
    if (val === undefined || val === null || val === '') {
        return none
    } else {
        // val = (val * 1).toFixed(2).toString()
        val = (val * 1).toString()
        const reg = /(?=(\B\d{3})+$)/g
        if (val.indexOf('.') > -1) {
            const index = val.indexOf('.')
            const xiaoshu = val.slice(index, val.length)
            const zhengshu = val.slice(0, index)
            return zhengshu.replace(reg, ',') + xiaoshu
        } else {
            return val.replace(reg, ',')
        }
    }
}

module.exports = {
    clone,
    download,
    bubbleSort,
    phoneNum,
    compare,
    moneyFormat
}
