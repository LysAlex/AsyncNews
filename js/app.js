document.addEventListener('DOMContentLoaded', ()=>{

    //===== VARIABLES
    
        let selectMedia = document.querySelector('#selectMedia');
        let nav = document.querySelector('#nav');
        let loginForm = document.querySelector('#loginForm');
        let registerForm = document.querySelector('#registerForm');
        let apiUrl = 'https://newsapp.dwsapp.io/api';
        let btnLogin = document.querySelector('#btnLogin');
        let btnRegister = document.querySelector('#btnRegister');
        let loggedUser = document.querySelector('#loggedUser');
        let favoris = document.querySelector('#favoris');
        const searchForm = document.querySelector('form#searchForm');
    
    
    //===== FUNCTIONS
    
        const getSearchSubmit = () => {
            searchForm.addEventListener('submit', event => {
            // Stop event propagation
            event.preventDefault();
    
           
    
            new FETCHrequest(
                apiUrl+'/news/sources',
                'POST',
                {
                    news_api_token: "4ac860c120bb494a8835bfa8f6ea3ca8",
                }
            )
            .fetch()
            .then(fetchData=>{
                console.log(fetchData)
                 // Check form data
                searchData.value.length > 0 
                ? fetchFunction(searchData.value, fetchData.data.sources[document.querySelector('#selectMedia').selectedIndex].id)
                : displayError(searchData, 'Minimum 1 caractère');
            });
        })
        };
    
        const fetchFunction = (keywords, sources, index=1) => {
            console.log(apiUrl+'/news/'+ sources + '/' + keywords)
            new FETCHrequest(
                apiUrl+'/news/'+ sources + '/' + keywords,
                'POST',
                {
                    news_api_token: "4ac860c120bb494a8835bfa8f6ea3ca8",
                }
            )
            .fetch()
            .then(jsonData=>{
                console.log(jsonData);
                let articles = document.querySelector('#articles');
                articles.innerHTML = '';
                for(let article=0; article < jsonData.data.articles.length; article++){
                    articles.innerHTML += `
                        <div class="col-4 mt-3 mb-3 article">
                            <h6>${jsonData.data.articles[article].title}</h6> 
                            <img class="img img-fluid" src="${jsonData.data.articles[article].urlToImage}" style="height:200px; width:100%;">
                            <span>${jsonData.data.articles[article].publishedAt}</span>
                            <button ref-id="${article}" class="btnFav">Ajouter aux favoris</button>
                        </div>                
                    `;
                }
                addFavoris(jsonData.data)
            })
            .catch(error=>{
                console.log(error)
            })
        };
    
        const checkAuth = (step=null) => {
            if(step === 'favorite'){
                let token = localStorage.getItem('jwt');
                console.log(token)
                if(token !== null){
                    new FETCHrequest(
                        apiUrl+'/me',
                        'POST',
                        {
                            token: token
                        }
                    )
                    .fetch()
                    .then(fetchData=>{
                        displayFav(fetchData)
                    })
                    .catch(error=>{
                        console.log(error)
                    })              
                }  
            } else {
                let token = localStorage.getItem('jwt');
                console.log(token)
                if(token !== null){
                    new FETCHrequest(
                        apiUrl+'/me',
                        'POST',
                        {
                            token: token
                        }
                    )
                    .fetch()
                    .then(fetchData=>{
                        console.log(fetchData)
                        displayNav(fetchData)
                        displayFav(fetchData)
                    })
                    .catch(error=>{
                        console.log(error)
                    })              
                }            
            }
        }
    
        const displayFav = (data) => {
            favoris.innerHTML = '';
            for(let fav of data.data.bookmark){
                favoris.innerHTML += `
                    <span>${fav.description}</span><br>                        
                `;
            }        
        }
    
        const displayMedia = (data) => {
            for(let media of data){
                selectMedia.innerHTML += `
                    <option ref-id=${media.id}> ${media.name} </option>
                `;
            }
        }
    
        const logOut = () => {
            let btnLogout = document.querySelector('#btnLogout');
            btnLogout.addEventListener('click', ()=>{
                new FETCHrequest(
                    apiUrl+'/logout',
                    'GET',
                )
                .fetch()
                .then(fetchData=>{
                    localStorage.removeItem('jwt')
                    displayMsg(fetchData.message)
                    document.location.href = 'index.html'
                })
                .catch(error=>{
                    displayMsg(error)
                })              
            })
        }
    
        const displayNav = (data) => {
            if(data.err === null){
                loginForm.classList.add('nav-close')
                registerForm.classList.add('nav-close')
                favoris.classList.add('fav-open')
                loggedUser.classList.add('nav-open')
                loggedUser.innerHTML = `
                    <p> 
                        Bienvenue ${data.data.user.firstname} ${data.data.user.lastname}
                        <button id="btnLogout"> Se déconnecter </button>
                    </p>
                `;
                logOut();
            } else {
                loginForm.classList.add('nav-open')
                registerForm.classList.add('nav-open')    
                loggedUser.classList.add('nav-close') 
                favoris.classList.add('fav-close')       
            }
        }
    
        const displayMsg = (msg) => {
            let msgPopin = document.querySelector('#msgPopin');
            msgPopin.innerHTML = `
                <p>${msg}</p>
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            `;
            msgPopin.classList.add('open');
            setTimeout(() => {
                msgPopin.classList.remove('open');
            }, 3000)
        }
    
        const addFavoris = (data) => {
            let btnList = document.querySelectorAll('.btnFav');
            for(let btn of btnList){
                btn.addEventListener('click', ()=>{
                    let id = btn.getAttribute('ref-id')
                    try {
                        new FETCHrequest(
                            apiUrl+'/bookmark',
                            'POST',
                            {
                                id: data.articles[id].source.id,
                                name: data.articles[id].source.name,
                                description: data.articles[id].description,
                                url: data.articles[id].url,
                                category: 'general',
                                language: 'fr',
                                country: 'FR',
                                token: localStorage.getItem('jwt'),
                            }
                        )
                        .fetch()
                        .then(data=>{
                            displayMsg(data.message)
                        })
                        .catch(error=>{
                            displayMsg(error)
                        })
                        checkAuth('favorite')
                    } catch {
                        displayMsg('Une erreur s est produite')
                    }
                })            
            }
        }
    
        function createArticles(articles) {
            searchData.value = '';
            articleList.innerHTML = '';
            const articlesSection = document.querySelector('#articles')
            let count = 0;
            articles.forEach(article => {
                articlesSection.innerHTML += `
                    <article>
                        <h2>${article.title}</h2>
                        <span>${simplifyDate(article.publishedAt)} - ${article.source.name}  <button class="buttonFav" ref-id="${count}" type="submit">Fav</button> - ${article.author}</span>
                        <p>${article.description}</p>
                    </article>`
                count++;
                })
        }
    
        const displayMediaArticles = (media) => {
            new FETCHrequest(
                apiUrl+'/news/'+media+'/null',
                'POST',
                {
                    news_api_token: "4ac860c120bb494a8835bfa8f6ea3ca8",
                }
            )
            
            .fetch()
            .then(data=>{
                console.log(data)
                let articles = document.querySelector('#articles');
                articles.innerHTML = '';
                for(let article=0; article < data.data.articles.length; article++){
                    articles.innerHTML += `
                        <div class="col-4 mt-3 mb-3 article">
                            <h6>${data.data.articles[article].title}</h6> 
                            <img class="img img-fluid" src="${data.data.articles[article].urlToImage}" style="height:200px; width:100%;">
                            <span>${data.data.articles[article].publishedAt}</span>
                            <button ref-id="${article}" class="btnFav">Ajouter aux favoris</button>
                        </div>                
                    `;
                }
                addFavoris(data.data)
            })
            .catch(error=>{
                displayMsg(error)
            })
        }
    
        async function searchArticles(sourceList, searchData) {
            new FETCHrequest(apiUrl+'/news/'+sourceList+searchData, 'POST', {
                "news_api_token": "4ac860c120bb494a8835bfa8f6ea3ca8"
            })
            .fetch()
            .then(fetchData=>{
                console.log(fetchData)
                createArticles(articleList.data.articles);
            })
            .catch(error=>{
                displayMsg(error)
            })
        }
    
    //===== EVENT
    
        btnLogin.addEventListener('click', (event)=>{
            event.preventDefault();
            let emailValue = document.querySelector('#emailLogin').value;
            let passwordValue = document.querySelector('#passswordLogin').value;
    
            if(emailValue === null || passwordValue === null){
                displayMsg('Merci de compléter tous les champs')
            } else {
                let bodyValue = {
                    email: emailValue,
                    password: passwordValue
                }
                new FETCHrequest(
                    apiUrl+'/login',
                    'POST',
                    bodyValue
                )
                .fetch()
                .then(fetchData=>{
                    localStorage.setItem('jwt',fetchData.data.token);
                    displayMsg(fetchData.message);
                    checkAuth();
                })
                .catch(error=>{
                    displayMsg(error.message)
                })            
            }
        })
    
        btnRegister.addEventListener('click', (event)=>{
            event.preventDefault();
            let emailValue = document.querySelector('#emailRegister').value;
            let firstnameValue = document.querySelector('#firstnameRegister').value;
            let lastnameValue = document.querySelector('#lastnameRegister').value;
            let passwordValue = document.querySelector('#passwordRegister').value;
    
            if(emailValue === null || passwordValue === null || firstnameValue === null || lastnameValue === null){
                displayMsg('Merci de compléter tous les champs')
            } else {
                let bodyValue = {
                    email: emailValue,
                    password: passwordValue,
                    firstname: firstnameValue,
                    lastname: lastnameValue
                }
                new FETCHrequest(
                    apiUrl+'/register',
                    'POST',
                    bodyValue
                )
                .fetch()
                .then(fetchData=>{
                    console.log(fetchData)
                    displayMsg(fetchData.message)
                })
                .catch(error=>{
                    displayMsg(error)
                })            
            }
        })
    
        selectMedia.addEventListener('change', ()=>{
            let selectIndex = document.querySelector('#selectMedia').selectedIndex;
            let refId = selectMedia.options[selectIndex].getAttribute('ref-id');
            displayMediaArticles(refId);
        })
    
    
    //===== INIT
    
        checkAuth();
        getSearchSubmit();
    
        new FETCHrequest(
            apiUrl+'/news/sources',
            'POST',
            {
                news_api_token: "4ac860c120bb494a8835bfa8f6ea3ca8",
            }
        )
        .fetch()
        .then(fetchData=>{
            console.log(fetchData)
            displayMedia(fetchData.data.sources)
            searchArticles(fetchData.data.sources,searchData.value)
        })
        .catch(error=>{
            console.log(error)
        })
    
    
    })