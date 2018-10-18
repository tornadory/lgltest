var x, i, j, selElmnt, a, b, c;
x = document.getElementsByClassName("custom-select");
for (i = 0; i < x.length; i++) {
    selElmnt = x[i].getElementsByTagName("select")[0];
    a = document.createElement("DIV");
    a.setAttribute("class", "select-selected");
    a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
    x[i].appendChild(a);
    b = document.createElement("DIV");
    b.setAttribute("class", "select-items select-hide");
    for (j = 1; j < selElmnt.length; j++) {
        c = document.createElement("DIV");
        c.innerHTML = selElmnt.options[j].innerHTML;
        c.addEventListener("click", function(e) {
            var y, i, k, s, h;
            s = this.parentNode.parentNode.getElementsByTagName("select")[0];
            h = this.parentNode.previousSibling;
            for (i = 0; i < s.length; i++) {
            if (s.options[i].innerHTML == this.innerHTML) {
                s.selectedIndex = i;
                h.innerHTML = this.innerHTML;
                y = this.parentNode.getElementsByClassName("same-as-selected");
                for (k = 0; k < y.length; k++) {
                y[k].removeAttribute("class");
                }
                this.setAttribute("class", "same-as-selected");
                break;
            }
            }
            h.click();
        });
        b.appendChild(c);
    }
    x[i].appendChild(b);
    a.addEventListener("click", function(e) {
        e.stopPropagation();
        closeAllSelect(this);
        this.nextSibling.classList.toggle("select-hide");
        this.classList.toggle("select-arrow-active");
    });
}
function closeAllSelect(elmnt) {
    var x, y, i, arrNo = [];
    x = document.getElementsByClassName("select-items");
    y = document.getElementsByClassName("select-selected");
    for (i = 0; i < y.length; i++) {
        if (elmnt == y[i]) {
        arrNo.push(i)
        } else {
        y[i].classList.remove("select-arrow-active");
        }
    }
    for (i = 0; i < x.length; i++) {
        if (arrNo.indexOf(i)) {
        x[i].classList.add("select-hide");
        }
    }
}
document.addEventListener("click", closeAllSelect);

//progressbar
var progressBar = document.getElementById("progressBar");
var pressed = false;

progressBar.addEventListener("mousedown", function(e){
    pressed = true;
});

progressBar.addEventListener("touchstart", function(e){
    pressed = true;
});

document.addEventListener("touchend", function(e){
    pressed = false;
});

document.addEventListener("mouseup", function(e){
    pressed = false;
});

function eventHandler(e){
    var leftOffset = gotLeftOffset(progressBar);
    var x;
    if(e.pageX){
        x = e.pageX - leftOffset;
    }else{
        x = e.changedTouches[0].pageX - leftOffset;
    }
        clickedValue = x * 100 / progressBar.offsetWidth;
        
    var ret = Math.round(clickedValue)>100?100:Math.round(clickedValue);
    ret = ret < 0 ? 0 : ret;
    
    document.getElementById("progressBar").value = ret;
    document.getElementById("pb-percent").innerText = ret+"%";
}

progressBar.addEventListener('click', function (e) {
    eventHandler(e);
});

progressBar.addEventListener('mousemove', function (e) {
    if(pressed){
        eventHandler(e);
    }
});

progressBar.addEventListener("touchmove", function (e) {
    if(pressed){
        eventHandler(e);
    }
});

function gotLeftOffset(el) {
    let toLeft = 0;
    var obj = el;
    if (obj.offsetParent) {
        do {
            toLeft += obj.offsetLeft;
        } while (obj = obj.offsetParent);
    }
    return toLeft;
}