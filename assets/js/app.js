
const cl = console.log;


const movieContainer = document.getElementById('movieContainer')
const movieModel = document.getElementById('movieModel')
const backDrop = document.getElementById('backDrop')
const showModelBtn = document.getElementById('showModelBtn')
const updateBtn = document.getElementById('updateBtn')
const MovieForm = document.getElementById('MovieForm')
const closeModel = [...document.querySelectorAll('.closeModel')]

const title = document.getElementById("title")
const poster = document.getElementById("poster")
const Description = document.getElementById("Description")
const Rating = document.getElementById("Rating")
const year = document.getElementById("year")


const addMovie = document.getElementById('addMovie')
const addMovieBtn = document.getElementById('addMovieBtn')
const updateMovie = document.getElementById('updateMovie')
const spinner = document.getElementById("spinner")

const BASE_URL = `https://crud-b22-e9992-default-rtdb.asia-southeast1.firebasedatabase.app/movies`;
const MOVIE_URL = `${BASE_URL}/movies.json`

const state = {
    moviesArr: [],
    editMovie: null
}

function movieObj(obj) {
    for (const key in obj) {
        obj[key].id = key;
        state.moviesArr.unshift(obj[key])
        // cl(obj[key])
    }
}

function handlespinner(flag) {
    if (flag) {
        spinner.classList.remove("d-none")
    } else {
        spinner.classList.add("d-none")
    }
}


function snackBar(msg, icons) {
    Swal.fire({
        title: msg,
        icon: icons,
        timer: 3000
    })
}
function rating(rating) {

    if (rating >= 7) {
        return "badge-success"
    } else if (rating >= 5 && rating < 8) {
        return "badge-warning"
    } else {
        return "badge-danger"
    }

}

function rendersfun(arr) {
    let result = ``;
    arr.forEach(movie => {
        result += `<div class="col-md-3 mb-4" id="${movie.Id}>
                <div class="card movieCard">
                    <div class="card-header">
                        <div class="row">
                            <div class="col-10">
                                <h4 class="m-0">${movie.title}</h4>
                                <small>udated at : ${movie.udatedAt}</small>
                            </div>
                            <div class="col-2">
                                <h5><span class="badge ${rating(movie.Rating)}">${movie.Rating}</span></h5>
                            </div>
                        </div>
                    </div>
                    <div class="card-body">
                        <figure>
                            <img src="${movie.poster}" alt="${movie.movieName}" title="${movie.title}">
                            <figcaption>
                                <h5>${movie.title}</h5>
                                <p>${movie.Description}</p>
                            </figcaption>                            
                        </figure>
                    </div>                   
                    <div class="card-footer d-flex justify-content-between">
                        <button onclick="onEditMovie(this)" type="button" class="btn btn-sm btn-sec"> Edit</button>
                        <button onclick="onRemoveMovie(this)" type="button" class="btn btn-sm btn-pri">Remove</button>
                    </div>
                </div>
            </div>`

    })
    movieContainer.innerHTML = result;
}

function makeApiCall(url, methodName, body = null) {
    body = body ? JSON.stringify(body) : null
    return fetch(url, {
        method: methodName,
        body: body,
        headers: {
            "content-type": "appliction/json",
            "authorization": "JWT Token from LS"
        }
    })
        .then(res => {
            if (!res.ok) {
                throw new Error("Http Error" + res.status)
            }
            return res.json()
        })

}

function onModelToggle() {
    movieModel.classList.toggle('active')
    backDrop.classList.toggle('active')
    MovieForm.reset()

}
function fetchMovie() {
    handlespinner(true)
    makeApiCall(MOVIE_URL, "GET")
        .then(data => {
            cl(data)
            movieObj(data)
            // cl(state)
            rendersfun(state.moviesArr)

        })
        .catch(err => {
            cl(err)
        })
        .finally(() => {
            handlespinner()
        })
}


function onAddMovie(eve) {
    eve.preventDefault();
    const NEW_MOVIE_OBJ = {
        year: year.value,
        CreatredAt: new Date(),
        UdatedAt: new Date(),
        title: title.value,
        poster: poster.value,
        Description: Description.value,
        Rating: Rating.value,
        genere: "Romance"


    }
    handlespinner(true)
    makeApiCall(MOVIE_URL, "POST", NEW_MOVIE_OBJ)
        .then(res => {
            NEW_MOVIE_OBJ.id = res.name;
            state.moviesArr.unshift(NEW_MOVIE_OBJ)
            let col = document.createElement("div")
            col.className = `col-md-3 mb-4`;
            col.id = NEW_MOVIE_OBJ.id;
            col.innerHTML = `<div class="card movieCard">
                    <div class="card-header">
                        <div class="row">
                            <div class="col-10">
                                <h4>${NEW_MOVIE_OBJ.title}</h4>
                            </div>
                            <div class="col-2">
                                <h5><span class="badge ${rating(NEW_MOVIE_OBJ.Rating)}">${NEW_MOVIE_OBJ.Rating}</span></h5>
                            </div>
                        </div>
                    </div>
                    <div class="card-body">
                        <figure>
                            <img src="${NEW_MOVIE_OBJ.poster}" alt="${NEW_MOVIE_OBJ.title}" title="${NEW_MOVIE_OBJ.title}">
                            <figcaption>
                                <h5>${NEW_MOVIE_OBJ.title}</h5>
                                <p>${NEW_MOVIE_OBJ.Description}</p>
                            </figcaption>                            
                        </figure>
                    </div>                   
                    <div class="card-footer d-flex justify-content-between">
                        <button onclick="onEditMovie(this)" type="button" class="btn btn-sm btn-sec"> Edit</button>
                        <button onclick="onRemoveMovie(this)" type="button" class="btn btn-sm btn-pri">Remove</button>
                    </div>
                </div>`;
            movieContainer.prepend(col)
            onModelToggle()
            MovieForm.reset();
            snackBar(`The New Movie ${NEW_MOVIE_OBJ.title} is added successfully`, `success`);
        })
        .catch(err => {
            snackBar(err, "error")
        })
        .finally(() => {
            handlespinner()
        })
}

function onEditMovie(ele) {
    let EDIT_ID = ele.closest(".col-md-3").id;
    state.editMovie = EDIT_ID;
    let EDIT_URL = `${BASE_URL}/movies/${EDIT_ID}.json`
    handlespinner(true)
    makeApiCall(EDIT_URL, "GET")
        .then(res => {
            cl(new Date(res.year).toLocaleDateString());
            onModelToggle()
            title.value = res.title,
                poster.value = res.poster,
                Description.value = res.Description,
                Rating.value = res.Rating,
                //  year.value = new Date(res.year).toLocaleDateString();
                year.vlaue = `${res.year}`

            addMovieBtn.classList.add('d-none')
            updateBtn.classList.remove('d-none')
            addMovie.classList.add('d-none')
            updateMovie.classList.remove('d-none')
        })
        .catch(err => {
            cl(err, `error`)
        })
        .finally(() => {
            handlespinner()
        })
}

function onUpdateMovie(ele) {
    let UPDATE_ID = state.editMovie
    let UPDATE_URL = `${BASE_URL}/movies/${UPDATE_ID}.json`
    let OLD_OBJ = state.moviesArr.find(m => m.id === state.editMovie)
    let UPDATE_OBJ = {
        year: year.value,
        title: title.value,
        poster: poster.value,
        Description: Description.value,
        Rating: Rating.value,
        genere: "Romance",
        id: UPDATE_ID

    }
    handlespinner(true)
    makeApiCall(UPDATE_URL, "PATCH", UPDATE_OBJ)
        .then(res => {
            let getIndex = state.moviesArr.findIndex(m => m.id === UPDATE_ID)
            state.editMovie = null;
            state.moviesArr[getIndex] = UPDATE_OBJ;
            let col = document.getElementById(UPDATE_ID)
            col.innerHTML = `<div class="card movieCard">
                    <div class="card-header">
                        <div class="row">
                            <div class="col-10">
                                <h4>${UPDATE_OBJ.title}</h4>
                            </div>
                            <div class="col-2">
                                <h5><span class="badge ${rating(UPDATE_OBJ.Rating)}">${UPDATE_OBJ.Rating}</span></h5>
                            </div>
                        </div>
                    </div>
                    <div class="card-body">
                        <figure>
                            <img src="${UPDATE_OBJ.poster}" alt="${UPDATE_OBJ.UPDATE_OBJName}" title="${UPDATE_OBJ.title}">
                            <figcaption>
                                <h5>${UPDATE_OBJ.title}</h5>
                                <p>${UPDATE_OBJ.Description}</p>
                            </figcaption>                            
                        </figure>
                    </div>                   
                    <div class="card-footer d-flex justify-content-between">
                        <button onclick="onEditMovie(this)" type="button" class="btn btn-sm btn-sec"> Edit</button>
                        <button onclick="onRemoveMovie(this)" type="button" class="btn btn-sm btn-pri">Remove</button>
                    </div>
                    </div>`
                    
                    snackBar(`The Movie with id ${UPDATE_ID} is Updated successfully!!!`, `success`)
                    onModelToggle()
                    updateBtn.classList.add('d-none')
                    addMovieBtn.classList.remove('d-none')
                    updateMovie.classList.add('d-none')
                    addMovie.classList.remove('d-none')
        })
        .catch(err => {
            cl(err , `error`)
        })
        .finally(() => {
            handlespinner()
        })
}

function onRemoveMovie(ele) {
    let REMOVE_ID = ele.closest('.col-md-3').id;

    Swal.fire({
        title: "Are you sure Remove From UI?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#5781a9",
        cancelButtonColor: "rgb(176, 55, 55)",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.isConfirmed) {
            let REMOVE_URL = `${BASE_URL}/movies/${REMOVE_ID}.json`

            handlespinner(true)
            makeApiCall(REMOVE_URL, "DELETE")
                .then(res => {
                    let getIndex = state.moviesArr.findIndex(m => m.id === REMOVE_ID)
                    state.moviesArr.splice(getIndex)
                    ele.closest('.col-md-3').remove();
                    snackBar(`The Movie with id ${REMOVE_ID} is Deleted Successfully`, `success`)
                })
                .catch(err => {
                    cl(err)
                })
                .finally(() => {
                    handlespinner()
                })
        }
    });
}

MovieForm.addEventListener('submit', onAddMovie)
showModelBtn.addEventListener('click', onModelToggle)
updateBtn.addEventListener('click', onUpdateMovie)

closeModel.forEach(m => {
    m.addEventListener('click', onModelToggle)
})

