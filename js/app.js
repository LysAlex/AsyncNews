/* 
Attendre le chargement du DOM
*/
document.addEventListener('DOMContentLoaded', () => {

    /* 
    Déclarations
    */
        const searchForm = document.querySelector('header form#searchForm');
        const searchLabel = document.querySelector('header form#searchForm span');
        const searchData = document.querySelector('[name="searchData"]');
        const apiUrl = "https://newsapp.dwsapp.io/api";
    //

    /* 
    Fonctions
    */
        const getSearchSumbit = () => {
            searchForm.addEventListener('submit', event => {
                // Stop event propagation
                event.preventDefault();

                // Check form data
                searchData.value.length > 0 
                ? fetchFunction(searchData.value) 
                : displayError(searchData, 'Minimum 1 caractère');

                let searchResult = document.querySelector('#resultSearch');
                searchResult.innerHTML = `Résultat de la recherche pour : ${searchData.value} <br>`;
                fetchFunction(searchData.value);
            });
        };

        const displayError = (tag, msg) => {
            searchLabel.textContent = msg;
            tag.addEventListener('focus', () => searchLabel.textContent = '');
        };

        const fetchFunction = (keywords, index = 1) => {
            
            fetch(`https://newsapp.dwsapp.io/api/news/nbc-news/${keywords}`)
            .then(response => {
                return response.json(); 
            })
            .then(jsonData => {
                console.log(jsonData);
                displayNewsList(jsonData);
            })
            .catch(error=>{
                console.log(error);
            })
        };
        
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
                    } catch {
                        displayMsg('Une erreur s est produite')
                    }
                })            
            }
        }
        const displayNewsList = (media) => {
            new FETCHrequest(
                apiUrl+'/news/'+media+'/null',
                'GET'
            )
            .fetch()
            .then(data=>{
                console.log(data)
                let newsList = document.querySelector('#newsList');
                newsList.innerHTML = '';
                for(let article=0; article < data.data.articles.length; article++){
                    newsList.innerHTML += `
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
                console.log(error)
            })
        }

        getSearchSumbit();

});