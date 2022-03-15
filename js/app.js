//Variables

const carrito = document.querySelector('#carrito');

const contenedorCarrito = document.querySelector('#lista-carrito tbody');

const listaCursos = document.querySelector('#lista-cursos');

const vaciarCarrito = document.querySelector('#vaciar-carrito');

let articulosCarrito = [];

cargarEventListener();

function cargarEventListener() {
    //cuando agregas un curso agregar al carrito
    listaCursos.addEventListener('click', agregarCurso);


    //Elimina cursos del carrito
    carrito.addEventListener('click', eliminarCurso);

    //muestra los cursos de localstorage
    document.addEventListener('DOMContentLoaded', () => {
        articulosCarrito = JSON.parse(localStorage.getItem('carrito')) || [];

        carritoHTML();
    })
    //Vaciar carrito
    vaciarCarrito.addEventListener('click', () => {
        articulosCarrito = []; //reseteamos el arreglo
        // limpiarHTML();
        carritoHTML();
    });
}


//Funciones
function agregarCurso(event) {
    event.preventDefault(); // es para evitar el # en el HTML

    if (event.target.classList.contains('agregar-carrito')) {
        const cursoSeleccionado = event.target.parentElement.parentElement

        leerDatosCurso(cursoSeleccionado);

    }
}


//Eliminar curso
function eliminarCurso(event) {
    console.log(event.target.classList);

    if (event.target.classList.contains('borrar-curso')) {
        const cursoId = event.target.getAttribute('data-id');

        //eliminar del arreglo de articulosCarrito por el data-id

        articulosCarrito = articulosCarrito.filter(curso => curso.id !== cursoId);

        carritoHTML(); //iterar sobre el carrito y mostrar su HTML
    }
}



//Leer el contenido del html al que le dimos click y extrae la informacion del curso
function leerDatosCurso(curso) {
    console.log(curso);

    //crear un objeto con el contenido del curso actual
    const infoCurso = {
        imagen: curso.querySelector('img').src,
        tituloCurso: curso.querySelector('h4').textContent,
        autor: curso.querySelector('p').textContent,
        precioDescuento: curso.querySelector('.precio span').textContent,
        id: curso.querySelector('a').getAttribute('data-id'), //seleccionar el id data-id="1"
        cantidad: 1
    }

    //Revisa si un elemento ya existe en el carrito
    const existe = articulosCarrito.some(curso => curso.id === infoCurso.id);
    if (existe) {
        //actualizamos la cantidad
        const cursos = articulosCarrito.map(curso => {
            if (curso.id === infoCurso.id) {
                curso.cantidad++;
                return curso; //retorna el objeto actualizado
            } else {
                return curso; // retorna los objetos que no son duplicados
            }
        });
        articulosCarrito = [...cursos];
    } else {
        //Agregamos el curso al carrito - Agregar o mostrar curso al carrito de compras
        articulosCarrito = [...articulosCarrito, infoCurso];
    }

    carritoHTML();

    console.log(articulosCarrito);
}

//muestra el carrito de compras en el html
function carritoHTML() {

    //Limpiar el HTML
    limpiarHTML();

    //Recorre el carrito y general el HTML
    articulosCarrito.forEach(curso => {
        const {
            imagen,
            tituloCurso,
            precioDescuento,
            cantidad,
            id
        } = curso;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><img src="${imagen}" width="100"></td>
            <td>${tituloCurso}</td>
            <td>${precioDescuento}</td>
            <td>${cantidad}</td>
            <td>
                <a href="#" class="borrar-curso" data-id="${id}"> X </a>
            </td>
        `;

        //Agrega el HTML del carrito en el tbody

        contenedorCarrito.appendChild(row);
    });

    //sincronizar con storage
    sincronizarStorage();
}

function sincronizarStorage() {
    localStorage.setItem('carrito', JSON.stringify(articulosCarrito));
}


//Eliminar curso del tbody

function limpiarHTML() {
    //Forma Lenta
    //contenedorCarrito.innerHTML = '';

    while (contenedorCarrito.firstChild) {
        contenedorCarrito.removeChild(contenedorCarrito.firstChild)
    }
}