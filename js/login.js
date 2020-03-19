document.addEventListener('DOMContentLoaded', () => {
    let mail = document.querySelector('#emailLogin');
    let pwd = document.querySelector('#pwdLogin');
    let mailValue = null;
    let pwdValue = null;
    let form = document.querySelector('#loginForm');
    let formRegister = document.querySelector('#registerForm');
    let fetchLoginData = {};
    let config = {};

    const checkToken = (data) => {
        fetch('https://api.dwsapp.io/api/me/' + data)
            .then(response => {
                return response.json();
            })
            .then(jsonData => {
                console.log(jsonData);
                //hello.innerHTML = `Bonjour ${jsonData.data.user.pseudo}`;
            })
            .catch(error => {
                console.log(error)
            })
    }

    const fetchLogin = (fetchData) => {
    fetch('https://api.dwsapp.io/api/login', fetchData)
        .then(response => {
            if(response.ok){
                return response.json();
            } else {
                console.log('requete ko')
            }
        })
        .then(jsonData => {
            console.log(jsonData)
            localStorage.setItem("user", jsonData.data.identity._id);
            checkToken(jsonData.data.identity._id);
            document.location.href="index.html"
        })
        .catch(error => {
            console.log(error);
        })
    }

    form.addEventListener('submit', (event) => {
        isLogin = 0;
        event.preventDefault();
        mailValue = mail.value;
        pwdValue = pwd.value;

        if (mailValue !== null && pwdValue !== null) {
            fetchLoginData = {
                email: mailValue,
                password: pwdValue
            }
            config = {
                method: 'POST',
                body: JSON.stringify(fetchLoginData),
                headers: { 'Content-Type': 'application/json' }
            }
            fetchLogin(config)
        } else {
            console.log('erreur à la connection')
        }
    })
})