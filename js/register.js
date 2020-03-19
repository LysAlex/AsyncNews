document.addEventListener('DOMContentLoaded', ()=>{
    let mail = document.querySelector('#emailData');
    let pseudo = document.querySelector('#pseudoData');
    let pwd = document.querySelector('#pwdData');
    let mailValue = null;
    let pseudoValue = null;
    let pwdValue = null;
    let form = document.querySelector('#registerForm');
    let fetchRegisterData = {};
    let config = {};

    const fetchRegister = (fetchData) => {
        fetch('https://api.dwsapp.io/api/register', fetchData)
        .then(response => {
            return response.json();
        })
        .then(jsonData => {
            console.log(jsonData);
            document.location.href="index.html"
        })
        .catch(error=>{
            console.log(error);
        })
    }

    form.addEventListener('submit', (event)=>{
        event.preventDefault();
        mailValue = mail.value;
        pseudoValue = pseudo.value;
        pwdValue = pwd.value;

        if(mailValue !== null && pseudoValue !== null && pwdValue !== null && pseudoValue.length > 4 && pwdValue.length > 4){
            fetchRegisterData = {
                email: mailValue,
                password: pwdValue,
                pseudo: pseudoValue
            }
            config = {
                method: 'POST',
                body: JSON.stringify(fetchRegisterData),
                headers: { 'Content-Type': 'application/json' }
            }
            fetchRegister(config)
        } else {
            console.log('erreur lors de l\inscription')
        }
        form.reset();
    })
})