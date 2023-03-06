
import { updateWatchList } from "./index.js"

const watchlistEl = document.getElementById('watchList')
document.addEventListener("DOMContentLoaded", renderWatchLater)


async function renderWatchLater(){
    

    let watchLater = JSON.parse(window.localStorage.getItem('watchList'))
    let data = await getMovies(watchLater)
    if(data.length == 0){
        document.getElementById('nothing').style.display = 'block'
        return;
    }
    let  watchLaterHtml = ``
    data.forEach(movie=>{
        if(movie.Response === 'False') {
           return
        };
        watchLaterHtml += `
        <div class="movie-item">
            <img
            src= ${movie.Poster}
            alt= "poster"
            style = "max-width: 8rem"
            />
            <div class="movie-desc">
                <p>${movie.Title} <span class="imdb-rating">⭐ ${movie.imdbRating}</span></p>
                <div class="group">
                    <p>${movie.Runtime}</p>
                    <p>${movie.Genre}</p>
                    <p class="watch" data-title = "${movie.Title}">
                    <i style="color:red" class="fa-solid fa-circle-minus"></i> Watchlist
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
    
    
    watchlistEl.innerHTML = watchLaterHtml
}


async function getMovies(watchLater){
    let moviesData = []
    for (let title of watchLater){
        await fetch(`http://www.omdbapi.com/?i=tt3896198&apikey=55460719&t=${title}`)
                     .then(res=>res.json()).then(data => moviesData.push(data))
     }
 
    
     return moviesData
}

document.addEventListener('click',(e)=>{
    if(e.target.className === 'watch'){
        let newWatchList = JSON.parse(window.localStorage.getItem('watchList'))
        let movietitle = e.target.dataset['title']
        if(newWatchList.includes(movietitle)){
            newWatchList.splice(newWatchList.indexOf(movietitle), 1)
        }
        window.localStorage.setItem('watchList',JSON.stringify(newWatchList))
    }
    location.reload()
})

