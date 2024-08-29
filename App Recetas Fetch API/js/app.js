document.addEventListener("DOMContentLoaded", iniciarApp);

//Funcion que inicia el proyecto 
function iniciarApp(){
    //Selectores html
    const selectCategorias = document.querySelector("#categorias");
    const divResultado = document.querySelector("#resultado");
    const modal = new bootstrap.Modal("#modal", {});
    const favoritosDiv = document.querySelector(".favoritos")

    //Eventos 
    if (selectCategorias) {
        selectCategorias.addEventListener("change", seleccionarCategorias);  
        //Mandamos a llamar la funcion que obtiene las categorias
        obtenerCategorias(); 
    }
    if(favoritosDiv){
        //Llamamos a la funcion que obtiene los favoritos del localSstore
        obtenerFavoritos();
    }
    
    //Definimos funcion que obtiene todas las categorias de recentas
    function obtenerCategorias(){
        //URL de la API de categorias
        const url = "https://www.themealdb.com/api/json/v1/1/categories.php";

        //Arrancamos la API
        fetch(url).then((respuesta) =>{
            //Regresamos la respuesta en tipo json
            return respuesta.json();
        }).then((datos) =>{
            //Llamamos la funcion que va a procesar los datos de la API
            mostrarCategorias(datos.categories)
        }).catch((error)=>{
            //Mandamos posibles errors de respuesta de la API
            console.log(error);
        });
    }

    //Definimos funcion que llena el select de categorias con los datos de la API
    function mostrarCategorias(datos){ 
        //Por cada categoria que haya en el arreglo, creamos un opcion para el select
        datos.forEach((categoria) =>{
            const option = document.createElement("option");
            option.value = categoria.strCategory;
            option.textContent = categoria.strCategory; 

            //Agregamos el option al html 
            selectCategorias.appendChild(option);
        });
    }

    //Funcion que obtiene las recetas de una categoria especificada
    function seleccionarCategorias(e){
        //Variable que contiene la categoria que se selecciono 
        const categoriaSeleccionada = e.target.value;
        
        //Url de la api, inyectamos la categoria selecccionada para que filtre
        const url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoriaSeleccionada}`;

        //Disparamos la api
        fetch(url).then((resultado) =>{
            //Regresamos el resultado
            return resultado.json();
        }).then((datos) =>{
            //Llamamos a la funcion que procesa los datos de la API
            obtenerPlatillo(datos.meals);
        }).catch((error) =>{
            //Procesamos posible error
            console.log(error);
        });
    }

    //Funcion que obtiene los datos de los platillos acorde a a la categoria seleccionada
    function obtenerPlatillo(datos){
        //Vaciamos el div de resultado
        divResultado.textContent = "";

        //Creamos heading para verificar si hubo resultados o no 
        const heading = document.createElement("h2");
        heading.classList.add("text-center", "text-black", "my-5");
        if(datos.length){
            heading.textContent = "Resultados"
            divResultado.appendChild(heading);
        }else{
            heading.textContent = "No hay resultados";
            divResultado.appendChild(heading);
        }

        //Iteramos el arreglo de datos
        datos.forEach((receta) =>{
            //Destructuring de cada receta, obtenemos titulo, imagen y id
            const {strMeal, strMealThumb, idMeal} = receta;

            //Por cada receta que haya en el arreglo, creamos un contenedor
            const recetaContenedor = document.createElement("div");
            recetaContenedor.classList.add("col-md-4");

            //Creamos card para cada receta
            const recetaCard = document.createElement("div");
            recetaCard.classList.add("card", "mb-4");

            //Creamos imagen de la receta 
            const recetaImagen = document.createElement("img");
            recetaImagen.classList.add("card-img-top");
            recetaImagen.alt = `Imagen de la receta ${strMeal}`;
            recetaImagen.src = strMealThumb;

            //Creamos body para cada card
            const recetaCardBody = document.createElement("div");
            recetaCardBody.classList.add("card-body")
            
            //Creamos heading de cada card
            const recetaHeading = document.createElement("h3");
            recetaHeading.classList.add("card-title", "mb-3");
            recetaHeading.textContent = strMeal;

            //Creamos un boton para cada card
            const btnReceta = document.createElement("button");
            btnReceta.classList.add("btn", "btn-danger", "w-100");
            btnReceta.textContent = "Ver receta";
            // btnReceta.dataset.bsTarget = "#modal";
            // btnReceta.dataset.bsToggle = "modal";

            //Agregamos evento al btnRecenta 
            btnReceta.onclick = function(){
                //Llamamos a la funcion seleccionarReceta
                seleccionarReceta(idMeal);
            }
            
            //Inyectamos el scripting en el html
            recetaCardBody.appendChild(recetaHeading);
            recetaCardBody.appendChild(btnReceta);

            recetaCard.appendChild(recetaImagen);
            recetaCard.appendChild(recetaCardBody);

            recetaContenedor.appendChild(recetaCard);

            //Agrgeamos recentaContenedor como hijo del div con id "resultado"
            divResultado.appendChild(recetaContenedor);
        });
    }

    //Funcion que obtiene la informacion de una receta determinada 
    function seleccionarReceta(idMeal){        
        //Definimos url
        const url = `https://themealdb.com/api/json/v1/1/lookup.php?i=${idMeal}`;

        //Disparamos la api 
        fetch(url).then((resultado) =>{
            //Regresamos el resultado 
            return resultado.json();
        }).then((datos) =>{
            //Llamamos a la funcion que procesa los datos de la recenta especificada
            informacionReceta(datos.meals);
        }).catch((error) =>{
            //Posibles mensajes de erro
            console.log(error);
        })
    }

    //Funcion que maneja la informacion de una receta especifica
    function informacionReceta(informacion){
        //Destrcuring del arreglo 
        const {idMeal, strMeal, strInstructions, strMealThumb} = informacion[0];

        //Definimos variable para el titulo y body del modal
        const modalTitle = document.querySelector(".modal .modal-title");
        const modalBody = document.querySelector(".modal .modal-body");
        const modalFooter = document.querySelector(".modal .modal-footer"); 

        //Limpiamos el modalFooter
        modalFooter.textContent = "";

        //Agregamos contenido al title y body
        modalTitle.textContent = strMeal;
        modalBody.innerHTML = `
            <img class="img-fluid" src = "${strMealThumb}" alt = "Recenta de ${strMeal}"/>
            <h3 class="my-3">Instrucciones</h3>
            <p>${strInstructions}</p>
            <h3 class="my-3">Ingredientes y Cantidades </h3>
        `;

        //Creamos un lista desordenada que va a contener los ingredientes y cantidades
        const listGroup = document.createElement("ul");
        listGroup.classList.add("list-group");

        //Mostramos la cantidades e ingredientes
        let recentaObjeto = informacion[0];
        for(let i=1; i<=20; i++){
            if(recentaObjeto[`strIngredient${i}`]){
                //Si hay un ingredientes creamos una variable de ingrediente y cantidad
                const ingrediente = recentaObjeto[`strIngredient${i}`];
                const cantidad = recentaObjeto[`strMeasure${i}`];

                //Por cada ingrediente y cantidad que haya creamos un li con cada uno
                const ingredienteLi = document.createElement("li");
                ingredienteLi.classList.add("list-group-item");
                ingredienteLi.textContent = `${ingrediente} - ${cantidad}`;

                //Agregamos cada li al ul
                listGroup.appendChild(ingredienteLi);
            }
        }
        //Agregamos la UL como hijo del modalBody
        modalBody.appendChild(listGroup);

        //Botones de cerrar y favorito 
        const btnFavorito = document.createElement("button");
        btnFavorito.classList.add("btn", "btn-danger", "col");
        btnFavorito.textContent = existeStorage(idMeal) ? "Eliminar de Favoritos" : "Agregar a Favoritos";

        const btnCerrar = document.createElement("button");
        btnCerrar.classList.add("btn", "btn-secondary", "col" );
        btnCerrar.textContent = "Cerrar";
        //Si damos click en btnCerrar, oculatamos el modal
        btnCerrar.onclick = function(){
            modal.hide();
        }

        //Agregamos los botones al modalFooter
        modalFooter.appendChild(btnFavorito);
        modalFooter.appendChild(btnCerrar);

        //Almacenamos en el localStorage la receta 
        btnFavorito.onclick = function(){
            //Llamamos a la funcion que comprueba si ya existe una receta en el localStorage 
            if(existeStorage(idMeal)){
                //Llamamos a la funcion que elimina un objeto del localStorage
                eliminarFavoritos(idMeal);
                //Si eliminamos, el btnFavorito va a cambiar su textContent
                btnFavorito.textContent = "Guardar Favorito";
                //Llamamos a la funcion que muestra un toast
                mostrarToast("Receta eliminada");
                //Si ya existe una receta con el mismo id hacemos return y evitar llamar a la funcion agregarFavoritos
                return;
            }

            //Llamamos a la funcion que almacena en el localStorage. Le pasamos un objeto que es la receta
            agregarFavoritos({
                id: idMeal,
                titulo: strMeal,
                img: strMealThumb
            });
            //Mostramos notificacion
            mostrarToast("Receta agregada a favoritos");
            //Si estamos agregando, el btnFavorito va a cambiar  su textContent 
            btnFavorito.textContent = "Eliminar Favorito";
        }

        //Mostramos el modal 
        modal.show();
    }

    //Funcion que agrega a los favoritos las recetas seleccionadas
    function agregarFavoritos(objetoReceta){
        //Obtenemos los favoritos del localStorga, si no existe, creamos el arreglo
        const favoritos = JSON.parse(localStorage.getItem("favoritos")) ?? [];

        //Agregamos el objetoRecenta 
        localStorage.setItem("favoritos", JSON.stringify([...favoritos, objetoReceta]));
    }

    //Funcion que elimina de los favoritos
    function eliminarFavoritos(id){
        //Obtenemos los favoritos del localStorga, si no existe, creamos el arreglo
        const favoritos = JSON.parse(localStorage.getItem("favoritos")) ?? [];

        //Nuevo arreglo de favoritos que va a eliiminar el elemento que se selecciono
        const nuevosFavoritos = favoritos.filter((favorito) =>{
            return favorito.id !== id;
        });

        //Agregamos nuevosFavoritos al localStorage
        localStorage.setItem("favoritos", JSON.stringify(nuevosFavoritos));
    }

    //Funcion que evita productos duplicados en el localStorage
    function existeStorage(id){
        //Obtenemos los favoritos del localStorga, si no existe, creamos el arreglo
        const favoritos = JSON.parse(localStorage.getItem("favoritos")) ?? [];
        return favoritos.some(favorito => favorito.id === id);
    }

    //Funcion para notificaciones en el toast
    function mostrarToast(mensaje){
        const toastDiv = document.querySelector("#toast");
        const toastBody = document.querySelector(".toast-body");

        //Generamos nuevo toast
        const toast = new bootstrap.Toast(toastDiv);
        //Agregamos contenido al body del toast
        toastBody.textContent = mensaje;

        //Mostramos el toasg
        toast.show();
    }

    //Funcion que obtiene los favoritos del localStore
    function obtenerFavoritos(){
        //Verificamos la existencia del localStorage de favoritos
        const favoritos = JSON.parse(localStorage.getItem("favoritos")) ?? [];

        if(favoritos.length){
            //Iteramos el arreglo 
            favoritos.forEach((favorito) =>{
                //Obtenemos cada objeto de favorito y hacemos destructuring 
                const {id, titulo, img} = favorito; 

                //Por cada receta que haya en el arreglo, creamos un contenedor
                const recetaContenedor = document.createElement("div");
                recetaContenedor.classList.add("col-md-4");

                //Creamos card para cada receta
                const recetaCard = document.createElement("div");
                recetaCard.classList.add("card", "mb-4");

                //Creamos imagen de la receta 
                const recetaImagen = document.createElement("img");
                recetaImagen.classList.add("card-img-top");
                recetaImagen.alt = `Imagen de la receta ${titulo}`;
                recetaImagen.src = img;

                //Creamos body para cada card
                const recetaCardBody = document.createElement("div");
                recetaCardBody.classList.add("card-body")
                
                //Creamos heading de cada card
                const recetaHeading = document.createElement("h3");
                recetaHeading.classList.add("card-title", "mb-3");
                recetaHeading.textContent = titulo;

                const btnReceta = document.createElement("button");
                btnReceta.classList.add("btn", "btn-danger", "w-100");
                btnReceta.textContent = "Ver receta";

                 //Agregamos evento al btnRecenta 
                btnReceta.onclick = function(){
                    //Llamamos a la funcion seleccionarReceta
                    seleccionarReceta(id);
                }

                //Inyectamos el scripting en el html
                recetaCardBody.appendChild(recetaHeading);
                recetaCardBody.appendChild(btnReceta);

                recetaCard.appendChild(recetaImagen);
                recetaCard.appendChild(recetaCardBody);

                recetaContenedor.appendChild(recetaCard);

                //Agrgeamos recentaContenedor como hijo del div con id "resultado"
                divResultado.appendChild(recetaContenedor);
                
            });
            return;
        }
        
        //Si favoritos esta vacio mandamos un parrafo de alerta
        const noFavoritos = document.createElement("p");
        noFavoritos.textContent = "No hay favoritos aun";
        noFavoritos.classList.add("fs-4", "text-center", "fond-bold", "mt-5");

        //Agregamos el parrafo al divResultado
        divResultado.appendChild(noFavoritos);
    }
}
