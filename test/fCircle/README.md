fCircle
=======

css3环形进度条插件(1.09kb)

bower引用
=======

```
$ bower install f-circle
```


使用
=======

```
var c = fCircle({
    container : document.getElementById('test2'), //容器
    emptyColor : '#ccc', //背景色
    fillColor : 'yellow', //填充色
    diameter : '300px', //直径
    width : '20px' //环形宽度
});

c.update(80); //更新百分比 80%
```


