export default function validarCrearProducto(valores) {
    let errores = {};

    if (!valores.nombre) {
        errores.nombre = "El nombre es obligatorio"
    }
    if (!valores.empresa) {
        errores.empresa = "El nombre de la empresa es obligatorio"
    }
    if (!valores.url) {
        errores.url = "La URL es obligatoria"
    } else if (!/^(ftp|http|https):\/\/[^ "]+$/.test(valores.url)) {
        errores.url = "La URL no es valida"
    }
    if (!valores.descripcion) {
        errores.descripcion = "Agrega una descripcion del producto"
    }
    
    return errores;
}