export function autoScrollList(el) {
    let scrollHeight = el.get(0).scrollHeight;
    let scrollTop = el.scrollTop();
    let height = el.height();

    el.scrollTop(scrollHeight - height);
}


export function generateUid() {
    let len = 8;
    let res = [];
    for (let i = 0; i !== len; ++i) {
        res.push(String.fromCharCode(Math.floor(Math.random() * 26) + (Math.random() > 0.5 ? 65 : 97)));
    }
    res.push(new Date().getTime() + 'o');
    return res.join('');
}


export function currentTime() {
    var d = new Date();
    var h = d.getHours();
    var i = d.getMinutes();
    var s = d.getSeconds();
    return [f2(h), f2(i), f2(s)].join(':');
}

function f2(v) {
    return v < 10 ? '0' + v : v;
}
