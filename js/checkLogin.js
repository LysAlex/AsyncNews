document.addEventListener('DOMContentLoaded', () => {
    let hello = document.querySelector('#hello');
    let btnDisconnected = document.querySelector('#disconnected');
    let navbarConnected = document.querySelector('#nav-connected');
    let navbarUnconnected = document.querySelector('#nav-unconnected');
    let CheminComplet = document.location.href;
    let NomDuFichier = CheminComplet.substring(CheminComplet.lastIndexOf( "/" )+1 );

    btnDisconnected.addEventListener('click', ()=>{
        localStorage.removeItem("user");
        location.reload();
    })

    const checkToken = (data) => {
        fetch('https://api.dwsapp.io/api/me/' + data)
            .then(response => {
                return response.json();
            })
            .then(jsonData => {
                console.log(jsonData)
                if(NomDuFichier == 'favorite.html'){
                    if(jsonData.data.favorite.length > 0){
                        displayFavorite(jsonData.data.favorite);
                    } else {
                        let favorite = document.querySelector('#favorite');
                        favorite.innerHTML = '<img src="https://media.giphy.com/media/QutMayhKImXOynvj33/giphy.gif" style="width:50%">';
                    }
                } else {
                    console.log('ko')
                }
                console.log(jsonData);
                hello.innerHTML = `Bonjour ${jsonData.data.user.pseudo}`;
            })
            .catch(error => {
                console.log(error)
            })
    }
// FAVORITE
    const displaySingleFav = (data) => {
        let displayFav = document.querySelector('#display-fav')
        displayFav.innerHTML = '';
        displayFav.innerHTML += `
            <div class="container>
                <div class="row">
                    <div class="col-8 m-auto">
                        <div class="d-flex flex-row">
                            <img class="img img-fluid" src=https://image.tmdb.org/t/p/w300/${data.poster_path}>
                            <div class="pl-5">
                                <h2> ${data.original_title} </h2>
                                <p> ${data.overview} </p>    
                                <span style="font-weight:bold;"> Note : ${data.vote_average} / 10 </span>                        
                            </div>
                        </div>
                    </dìv>
                </div>
            </div>
        `;
    }

    const fetchSingleFav = (id) => {
        fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=fdafddd9077186cd8fe272534e4ccd71`)
        .then(response=>{
            return response.json();
        })
        .then(jsonData=>{
            displaySingleFav(jsonData)
            console.log(jsonData)
        })
        .catch(error=>{
            console.log(error)
        })
    }

    const clickSingleFav = () =>{
        let singleFav = document.querySelectorAll('.single-fav');
        for(let fav of singleFav){
            fav.addEventListener('click', ()=>{
                console.log(fav)
                fetchSingleFav(fav.parentElement.getAttribute('movie-id'))
            })
        }
    }

    const fetchRemoveFav = (id) => {
        let config = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        }
        fetch(`https://api.dwsapp.io/api/favorite/${id}`, config)
        .then(response => {
            return response.json(); 
        })
        .then(jsonData => {
            console.log(jsonData);
        })
        .catch(error=>{
            console.log(error);
        })
    }

    const removeFavorite = () =>{
        let favoris = document.querySelectorAll('.trash-fav');
        for(let favori of favoris){
            favori.addEventListener('click', () =>{
                let id = favori.parentElement.getAttribute('fav-id');
                let confirmation = confirm("Voulez vous supprimer ce film de vos favoris ?")
                if (confirmation == true) {
                fetchRemoveFav(id);
                favori.parentElement.style.display = 'none'
                }
                else {
                    console.log("Annulation")
                }
            })
        }
    }

    const displayFavorite = (data) => {
        let favorite = document.querySelector('#favorite');
        for(let fav of data){
            favorite.innerHTML += `
                <li class="mt-1" movie-id="${fav.id}" fav-id="${fav._id}">
                    <span class="single-fav">${fav.title}</span>
                    <i class="fas fa-trash-alt trash-fav"></i>
                </li>
            `;
        }
        clickSingleFav();
        removeFavorite();
    }





    if(localStorage.getItem("user")){
        navbarConnected.style.display = 'flex';
        navbarUnconnected.style.display = 'none';
        checkToken(localStorage.getItem("user"))     
    } else {
        navbarConnected.style.display = 'none';
        navbarUnconnected.style.display = 'flex';
    }
})