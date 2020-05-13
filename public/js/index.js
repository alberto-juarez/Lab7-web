
const API_TOKEN = '2abbf7c3-245b-404f-9473-ade729ed4653';

function addStudentFech( name, id ){
    let url = '/api/createStudent';

    let data = {
        name : name,
        id : Number(id)
    }

    let settings = {
        method : 'POST',
        headers : {
            Authorization : `Bearer ${API_TOKEN}`,
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify( data )
    }

    let results = document.querySelector( '.results' );

    fetch( url, settings )
        .then( response => {
            if( response.ok ){
                return response.json();
            }
            throw new Error( response.statusText );
        })
        .then( responseJSON => {
            fetchStudents();
        })
        .catch( err => {
            results.innerHTML = `<div> ${err.message} </div>`;
        });
}

function addBookmark( title,rating,description,url){
    let url2 = '/bookmarks';

    let data = {
        title: title,
        rating: rating,
        description: description,
        url: url
    }

    let settings = {
        method : 'POST',
        headers : {
            Authorization : `Bearer ${API_TOKEN}`,
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify( data )
    }

    let results = document.querySelector( '.bookmarks-all' );

    fetch( url2, settings )
        .then( response => {
            if( response.ok ){
                return response.json();
            }
            throw new Error( response.statusText );
        })
        .then( responseJSON => {
            fetchBookmarks();
        })
        .catch( err => {
            results.innerHTML = `<div> ${err.message} </div>`;
        });
}

function deleteBookmark( id){
    let url3 = `/bookmark/${id}`;
    // console.log(url3);

    let settings = {
        method : 'DELETE',
        headers : {
            Authorization : `Bearer ${API_TOKEN}`
        }
    }

    let results = document.querySelector( '.bookmarks-all' );

    fetch( url3, settings )
        .then( response => {
            if( response.ok ){
                // console.log("Si se borro");
                return fetchBookmarks();
            }
            throw new Error( response.statusText );
        })
        .catch( err => {
            results.innerHTML = `<div> ${err.message} </div>`;
        });
}

function updateBookmark( id,title,rating,description,url){
    let url4 = `/bookmark/${id}`;

    let data = {
        id: id,
        title: title,
        rating: rating,
        description: description,
        url: url
    }

    let settings = {
        method : 'PATCH',
        headers : {
            Authorization : `Bearer ${API_TOKEN}`,
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify( data )
    }

    let results = document.querySelector( '.bookmarks-all' );

    fetch( url4, settings )
        .then( response => {
            if( response.ok ){
                return response.json();
            }
            throw new Error( response.statusText );
        })
        .then( responseJSON => {
            fetchBookmarks();
        })
        .catch( err => {
            results.innerHTML = `<div> ${err.message} </div>`;
        });
}

function getTitle(title){
    let url5 = `/bookmark?title=${title}`;

    let settings = {
        method : 'GET',
        headers : {
            Authorization : `Bearer ${API_TOKEN}`
        }
    }

    let resultsGet = document.querySelector( '.resultadosGet' );

    fetch( url5, settings )
        .then( response => {
            if( response.ok ){
                return response.json();
            }
            throw new Error( response.statusText );
        })
        .then( responseJSON => {
          resultsGet.innerHTML = "";
          for ( let i = 0; i < responseJSON.length; i ++ ){
            resultsGet.innerHTML += `
            <div class="row">
              <div class="col-8">
                <div class="row">
                  Titulo: ${responseJSON[i].title}
                </div>
                <div class="row">
                  ID: ${responseJSON[i].id}
                </div>
                <div class="row">
                  Descripcion: ${responseJSON[i].description}
                </div>
              </div>
              <div class="col-4">
              <div class="row">
                Rating: ${responseJSON[i].rating}
              </div>
              </div>
            </div>

            `;
          }
          console.log(responseJSON);
            // fetchBookmarks();
        })
        .catch( err => {
            resultsGet.innerHTML = `<div> ${err.message} </div>`;
        });
}


function fetchStudents(){

    let url = '/api/students';
    let settings = {
        method : 'GET',
        headers : {
            Authorization : `Bearer ${API_TOKEN}`
        }
    }
    let results = document.querySelector( '.results' );

    fetch( url, settings )
        .then( response => {
            if( response.ok ){
                return response.json();
            }
            throw new Error( response.statusText );
        })
        .then( responseJSON => {
            results.innerHTML = "";
            for ( let i = 0; i < responseJSON.length; i ++ ){
                results.innerHTML += `<div> ${responseJSON[i].name} </div>`;
            }
        })
        .catch( err => {
            results.innerHTML = `<div> ${err.message} </div>`;
        });

}

function watchStudentsForm(){
    let studentsForm = document.querySelector( '.students-form' );

    studentsForm.addEventListener( 'submit', ( event ) => {
        event.preventDefault();

        fetchStudents();
    });
}

function watchAddBookmarkForm(){
    let studentsForm = document.querySelector( '.new-bookmark-form' );

    studentsForm.addEventListener( 'submit' , ( event ) => {
        event.preventDefault();
        let title = document.getElementById( 'bTitle' ).value;
        let rating = document.getElementById( 'bRating' ).value;
        let url = document.getElementById( 'bURL' ).value;
        let description = document.getElementById( 'bDescription' ).value;
        addBookmark(title, rating, description,url);
        // addStudentFech( name, id );
    })
}

function watchDeleteBookmarkForm(){
    let studentsForm = document.querySelector( '.delete-bookmark-form' );

    studentsForm.addEventListener( 'submit' , ( event ) => {
        event.preventDefault();
        let id = document.getElementById( 'deleteID' ).value;
        deleteBookmark(id);
        // addStudentFech( name, id );
    })
}

function watchGetTitleForm(){
    let studentsForm = document.querySelector( '.get-bookmark-title-form' );

    studentsForm.addEventListener( 'submit' , ( event ) => {
        event.preventDefault();
        let title = document.getElementById( 'getTitle' ).value;
        getTitle(title);
        // addStudentFech( name, id );
    })
}

function watchUpdateBookmarkForm(){
    let studentsForm = document.querySelector( '.update-bookmark-form' );

    studentsForm.addEventListener( 'submit' , ( event ) => {
        event.preventDefault();
        let id = document.getElementById( 'updateID' ).value;
        let title = document.getElementById( 'updateTitle' ).value;
        let rating = document.getElementById( 'updateRating' ).value;
        let url = document.getElementById( 'updateURL' ).value;
        let description = document.getElementById( 'updateDescription' ).value;
        updateBookmark(id,title,rating,description,url);
        // addStudentFech( name, id );
    })
}

function fetchBookmarks(){
    let allBookmarks = document.querySelector( '.bookmarks-all' );
    let url = '/bookmarks';

    let settings = {
        method : 'GET',
        headers : {
            Authorization : `Bearer ${API_TOKEN}`
        }
    }

    fetch( url, settings )
        .then( response => {
            if( response.ok ){
                return response.json();
            }
            throw new Error( response.statusText );
        })
        .then( responseJSON => {
          // console.log(responseJSON);
          allBookmarks.innerHTML = `<div class="row">`;
          for ( let i = 0; i < responseJSON.length; i ++ ){
             if (i % 3 === 0){
               allBookmarks.innerHTML +=`<div class="row">`
             }
              allBookmarks.innerHTML += `
              <div class="col-4">
              <div class="card">
                <div class="card-body">
                  <h5 class="card-title"> ${responseJSON[i].title} </h5>
                  <h6 class="card-subtitle mb-2 text-muted">${responseJSON[i].url}</h6>
                  <h6 class="card-subtitle mb-2 text-muted">ID: ${responseJSON[i].id}</h6>
                  <p class="card-text"> ${responseJSON[i].description}</p>
                  <div class="card-footer text-muted">
                    Rating: ${responseJSON[i].rating}
                  </div>
                </div>
              </div>
              </div>
              `;
              if (i % 3 === 0){
                allBookmarks.innerHTML +=`</div>`
              }
          }
          allBookmarks.innerHTML += `</div>`;
        })
        .catch( err => {
            allBookmarks.innerHTML = `<div> ${err.message} </div>`;
        });

}

function init(){
    fetchBookmarks();
    // watchStudentsForm();
    watchAddBookmarkForm();
    watchDeleteBookmarkForm();
    watchUpdateBookmarkForm();
    watchGetTitleForm();
}

init();
