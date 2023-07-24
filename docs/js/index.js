function getQueryString() {
    const params = {}
    location.search.substr(1).split('&').map(function(param) {
        const pairs = param.split('=');
        params[pairs[0]] = decodeURIComponent(pairs[1]);
    });
    return params;
}
const buildQueryString = (params) => {
	let parts = [];
	let add = (key, value) => {
		parts.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
	}
	for (let key in params) {
   		let param = params[key];
   		if (Array.isArray(param)) {
            param.map((value) => {
   				add(key, value);
   			});
   		}
   		else {
   			add(key, param);
   		}
	}
	return parts.join('&').replace(/%20/g, '+');
}

const params = getQueryString()
console.log(params)

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
                case 'mail':
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
    input.addEventListener('change', (e) => {
        if (e.target.name!=='title') {
            formData[e.target.name] = e.target.value
        }
        localStorage.setItem('mailOrderFormData', JSON.stringify(formData))
    })
})


let formData = {}
if (localStorage.getItem('mailOrderFormData')) {
    formData = JSON.parse(localStorage.getItem('mailOrderFormData'))
    delete formData['title']
    Object.keys(formData).map((key) => {
        if (document.querySelector(`input[name="${key}"]`)) {
            document.querySelector(`input[name="${key}"]`).value = formData[key].replace(/\+/, ' ')
        }
    })
}

document.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault()
    const subject = `[アプリ注文] ${params.title}`;
    const shopName = 'ホホホ座'
    const url = `http://hohoho-sv2.calil.jp/wp-admin/admin.php?page=order%26` + encodeURIComponent(buildQueryString(params)) + encodeURIComponent(buildQueryString(formData))
    const orderUrl = encodeURIComponent(`https://honto.jp/netstore/search_10${params.isbn}.html`);
    let body = `${shopName} 様

以下の注文をお願いします。

書名: ${params.title}
著者: ${params.author}
出版社: ${params.publisher}
ISBN: ${params.isbn}

注文者: ${formData.name}
電話番号: ${formData.tel}
メールアドレス: ${formData.mail}

honto: ${orderUrl}`;
    body = body.replace(/\n/g, '%0D%0A')
    window.open(`mailto:${formData.mailto}?&body=${body}&subject=${subject}`)
    window.close()
})