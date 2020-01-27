import React, { useState, useContext } from 'react'
import Router, { useRouter } from 'next/router'
import FileUploader from 'react-firebase-file-uploader'
import {FirebaseContext} from '../firebase'
import Layout from '../components/layout/Layout'
import useValidacion from '../hooks/useValidacion'
import {Formulario, Campo, InputSubmit, Error} from '../components/ui/Formulario'
import validarCrearProducto from '../validacion/validarCrearProducto'
import Error404 from '../components/layout/404'


const STATE_INICIAL = {
  nombre: '',
  empresa: '',
  imagen: '',
  url: '',
  descripcion: '',
}

const NewProduct = () => {

  const [nombreImg, setNombreImg] = useState('');
  const [subiendo, setSubiendo] = useState(false);
  const [progreso, setProgreso] = useState(0);
  const [urlImg, setUrlImg] = useState('');
  const [error, setError] = useState(false);

  const {valores, errores, handleSubmit, handleChange, handleBlur} = useValidacion(STATE_INICIAL, validarCrearProducto, crearProducto);
  const {nombre, empresa, imagen, url, descripcion} = valores;

  const { usuario, firebase } = useContext(FirebaseContext);

  const router = useRouter()

  async function crearProducto() {
    if (!usuario) {
      return router.push('/login')
    }
    const producto = { 
      nombre,
      empresa,
      url,
      urlImg,
      descripcion,
      votos: 0,
      comentarios: [],
      creado: Date.now(),
      creador: {
        id: usuario.uid,
        nombre: usuario.displayName
      },
      haVotado : []
    }

    firebase.db.collection('productos').add(producto);
    return router.push('/');
  }

  const handleUploadStart = () => {
    setProgreso(0);
    setSubiendo(true);
  };

  const handleProgress = progreso => setProgreso({ progreso });

  const handleUploadError = error => {
    setError(error);
    console.error(error);
  };

  const handleUploadSuccess = nombre => {
    setProgreso(100);
    setSubiendo(false);
    setNombreImg(nombre)
    firebase
      .storage
      .ref("productos")
      .child(nombre)
      .getDownloadURL()
      .then( url => {
        console.log(url);
        setUrlImg(url);
      } );
  };

  return (
    <div>
      <Layout>
        { !usuario ? <Error404 /> : ( 
          <>
          <h1>Nuevo producto</h1>
          <style jsx>{`
            h1 {
              text-align: center;
              margin-top: 5rem;
            }
          `}</style>
          <Formulario
            onSubmit={handleSubmit}
            noValidate
          >
            <fieldset>
              <legend>Informacion sobre tu empresa</legend>
              <Campo>
                <label htmlFor="nombre">Nombre</label>
                <input
                  type="text"
                  id="nombre"
                  placeholder="Nombre del producto"
                  name="nombre"
                  value={nombre}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Campo>
              {errores.nombre && <Error>{errores.nombre}</Error>}

              <Campo>
                <label htmlFor="empresa">Empresa</label>
                <input
                  type="text"
                  id="empresa"
                  placeholder="Tu empresa"
                  name="empresa"
                  value={empresa}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Campo>
              {errores.empresa && <Error>{errores.empresa}</Error>}

              <Campo>
                <label htmlFor="imagen">Imagen</label>
                <FileUploader
                  accept="image/*"
                  type="file"
                  id="imagen"
                  name="imagen"
                  randomizeFilename
                  storageRef={firebase.storage.ref("productos")}
                  onUploadStart={handleUploadStart}
                  onUploadError={handleUploadError}
                  onUploadSuccess={handleUploadSuccess}
                  onProgress={handleProgress}
                />
              </Campo>

              <Campo>
                <label htmlFor="url">URL</label>
                <input
                  type="url"
                  id="url"
                  name="url"
                  placeholder="URL de tu empresa"
                  value={url}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Campo>
              {errores.url && <Error>{errores.url}</Error>}

            </fieldset>

            <fieldset>
              <legend>Sobre tu producto</legend>
              <Campo>
                <label htmlFor="descripcion">Descripcion</label>
                <textarea
                  id="descripcion"
                  name="descripcion"
                  value={descripcion}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Campo>
              {errores.descripcion && <Error>{errores.descripcion}</Error>}
            </fieldset>

            <InputSubmit
              type="submit"
              value="Crear producto"
            />
            {error && <Error>{error}</Error>}
          </Formulario>
          </>
        )}
      </Layout>
    </div>
  )
}

export default NewProduct
