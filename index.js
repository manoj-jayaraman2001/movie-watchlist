const popUp = document.getElementById("popup");
const moviesSection = document.getElementById("movies");
const spinner = document.getElementById('spinner')
const searchBtn = document.getElementById('search-btn')



let moviesArray = []
const watchList = []
if(localStorage.getItem('watchList') === null){
    window.localStorage.setItem('watchList',JSON.stringify(watchList))
}




async function renderMovies(){
    let moviesHtml = ''
    let movieName = document.getElementById('search-input').value
    if(!movieName){
        popUp.style.display = 'block'
        setTimeout(()=>{popUp.style.display = 'none'}, 1000)
        return;
    }

    document.getElementById('reel-icon').style.display = 'none';
    spinner.style.display = 'block'
    moviesSection.style.display = 'none'
    let data =  await moviesData(movieName)
    console.log(data)
    if(!(data.length)){
        console.log('No related search results')
        document.getElementById('nothing').style.display = 'block'
        spinner.style.display = 'none'
        return;
    }
    console.log(data)
    let sign ='plus';
    let color;
    data.forEach(movie=>{
        if(movie.Response === 'False') {
           return
        };
        if(JSON.parse(window.localStorage.getItem('watchList')).includes(movie.Title)){
            sign = 'minus'
            color = 'red'
        }else{
            sign = 'plus';
            color = 'black';
        }
        moviesHtml += `
        <div class="movie-item">
            <img
            src= ${movie.Poster}
            alt= "poster"
            style = "max-width: 8rem"
            />
            <div class="movie-desc">
                <p>${movie.Title} <span class="imdb-rating">⭐${movie.imdbRating}</span></p>
                <div class="group">
                    <p>${movie.Runtime}</p>
                    <p>${movie.Genre}</p>
                    <p class="watch" data-title = "${movie.Title}">
                    <i style="color:${color}" class="fa-solid fa-circle-${sign}"></i> Watchlist
                    </p>
                </div>
                <p style="font-size: 13px; color: #6B7280;">
                    ${movie.Plot}
                </p>
            </div>
        </div>
        <hr style="width: 27.5rem;">
        `
    })
    
    document.getElementById('reel-icon').style.display = 'none';
    moviesSection.innerHTML = moviesHtml
    spinner.style.display = 'none';
    moviesSection.style.display = 'block'
    
}




async function moviesData(movieName){

    let searchPromise = await fetch(`http://www.omdbapi.com/?i=tt3896198&apikey=55460719&s=${movieName}`)
    let searchPromise2 = await searchPromise.json()
    let data =  searchPromise2
    if(data.length == 0){
        return [];
    }
    let movieTitles = data.Search.map(movie => {return movie.Title})
    let moviesData = []
    console.log(movieTitles)
    for (let title of movieTitles){
       await fetch(`http://www.omdbapi.com/?i=tt3896198&apikey=55460719&t=${title}`)
                    .then(res=>res.json()).then(data => moviesData.push(data))
    }

   
    return moviesData
}

if(searchBtn){
    searchBtn.addEventListener('click', renderMovies)
}



document.addEventListener('click',(e)=>{updateWatchList(e)})

function updateWatchList(e){
    let newWatchList = JSON.parse(window.localStorage.getItem('watchList'))
    if( e.target.className === 'watch'){
        let movietitle = e.target.dataset['title']
        if(newWatchList.includes(movietitle)){
            newWatchList.splice(newWatchList.indexOf(movietitle), 1)
            e.target.innerHTML = `<i style="color:black" class="fa-solid fa-circle-plus"></i> Watchlist`
        }else{
            newWatchList.push(movietitle)
            e.target.innerHTML = `<i style="color:red" class="fa-solid fa-circle-minus"></i> Watchlist`
        }
        
    }
    window.localStorage.setItem('watchList',JSON.stringify(newWatchList))

}

export {updateWatchList}

