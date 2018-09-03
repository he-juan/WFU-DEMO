var hrefStr ='www.baidu.com'; //'http://www.baidu.com'
var imgStr =  'http://ufile.fwlogo.com/2018/05/17/6zsfyrcd4douwo1fheluw5l8ievqdacg.png';
var widthStr = '100';//'200';
var heightStr = '100';//'340';\n
var styleJS = 'undefined';//'position: absolute;width: 400px;bottom: 0;';\n

document.write('<div id=\"mydspdiv_193990483416931\" style=\"width:' + widthStr + 'px;height:' + heightStr + 'px;' + styleJS + '\">< img src=\"' + imgStr + '\" width=\"100%\" height=\"100%\" /></div>');
document.getElementById('mydspdiv_193990483416931').onclick = function () {
    var a = document.createElement('a');
    a.href = hrefStr;
    a.target = '_blank'
    var e = document.createEvent('MouseEvents');
    e.initEvent('click', true, true);
    a.dispatchEvent(e);
}
