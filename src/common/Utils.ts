export function generateUid(): string {
    let len = 8;
    let res = [];
    for (let i = 0; i !== len; ++i) {
        res.push(
            String.fromCharCode(
                Math.floor(Math.random() * 26) + (Math.random() > 0.5 ? 65 : 97)
            )
        );
    }
    res.push(new Date().getTime() + "o");
    return res.join("");
}

export function isUrl(url: string): boolean {
    return /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\*\+,;=.]+$/.exec(url) != null;
}