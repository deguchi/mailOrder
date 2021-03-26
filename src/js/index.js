console.log('Hello LooselyTemplate!')

function getQueryString() {
    const params = {}
    location.search.substr(1).split('&').map(function(param) {
        const pairs = param.split('=');
        params[pairs[0]] = decodeURIComponent(pairs[1]);
    });
    return params;
}

// title
// author
// isbn
// publisher
// mailto
// name
// tel
// mail
// reply url

const params = getQueryString()

if (params.title) {
    document.querySelector('input[name="title"]').value = params.title
}

[...document.querySelectorAll('input')].map((input) => {
    input.addEventListener('invalid', (e) => {
        console.log(e)
        e.target.setCustomValidity('')
        if (!e.target.validity.valid) {
            console.log(e.target.name)
            switch (e.target.name) {
                case 'mailto':
                    e.target.setCustomValidity('お店のメールアドレスを入れてください。')
                    break
                case 'name':
                    e.target.setCustomValidity('お名前を入れてください。')
                    break
                case 'tel':
                    e.target.setCustomValidity('電話番号を入れてください。')
                    break
                case 'email':
                    e.target.setCustomValidity('メールアドレスを入れてください。')
                    break
                default:
                    console.log(e.target)
            }
            // 最初のinvalidな要素にスクロールする
            if (this.scrollNow===false && detectBrowser() !== 'safari') {
                setTimeout(() => {
                    window.scroll({
                        top: window.pageYOffset + e.target.getBoundingClientRect().top - 100,
                        behavior: 'smooth'
                    })
                }, 10)
                this.scrollNow = true
                setTimeout(() => this.scrollNow = false, 100)
            }
        }
        // 入力時にメッセージが出てしまう問題対策
        e.target.oninput = (e) => e.target.setCustomValidity('')
    })    
})