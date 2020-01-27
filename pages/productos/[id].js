import React, { useEffect, useContext, useState } from 'react';
import {useRouter} from 'next/router';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import {es} from 'date-fns/locale'

import { FirebaseContext } from '../../firebase';
import Layout from '../../components/layout/Layout';
import Error404 from '../../components/layout/404';
import {Campo, InputSubmit} from '../../components/ui/Formulario';
import Boton from '../../components/ui/Boton';

const ContenedorProducto = styled.div`
   @media (min-width:768px) {
        display: grid;
        grid-template-columns: 2fr 1fr;
        column-gap: 2rem;
   }
`;
const CreadorProducto = styled.p`
    padding: .5rem 2rem;
    background-color: #DA552F;
    color: #fff;
    text-transform: uppercase;
    font-weight: bold;
    display: inline-block;
    text-align: center;
`

const Productos = () => {

    const [producto, setProducto] = useState({});
    const [error, setError] = useState(false);
    const [comentario, setComentario] = useState({});

    const router = useRouter();
    const {query: {id}} = router;

    const { firebase, usuario } = useContext(FirebaseContext);

    useEffect(()=> {
        if (id) {
            const obtenerProducto = async () => {
                const productoQuery = await firebase.db.collection('productos').doc(id);
                const producto = await productoQuery.get();
                if (producto.exists) {
                    setProducto(producto.data());
                } else {
                    setError(true);
                }
            }
            obtenerProducto();
        }
    }, [id, producto]);

    if(Object.keys(producto).length === 0) return 'Cargando...';

    const { nombre, empresa, url, urlImg, descripcion, votos, comentarios, creado, creador, haVotado } = producto;

    const votarProducto = () => {
        if(!usuario) return router.push('/');

        const votoMas1 = votos+1;

        if (haVotado.includes(usuario.uid)) return;

        const nuevoHaVotado = [...haVotado, usuario.uid];

        firebase.db.collection('productos').doc(id).update({ votos: votoMas1, haVotado: nuevoHaVotado });

        setProducto({
            ...producto,
            votos: votoMas1
        })
    };

    const handleChange = e => {
        setComentario({
            ...comentario,
            [e.target.name] : e.target.value
        })
    }
    const handleSubmit = e => {
        e.preventDefault();
        if(!usuario) return router.push('/');

        comentario.usuarioId = usuario.uid;
        comentario.usuarioNombre = usuario.displayName;
        
        const nuevosComentarios = [...comentarios, comentario];

        firebase.db.collection('productos').doc(id).update({ comentarios: nuevosComentarios });

        setProducto({
            ...producto,
            comentarios: nuevosComentarios
        });

    }
    return (
        <Layout>
            <>
                { error && <Error404 /> }
                <h1 css={css`
                    text-align: center;
                    margin-top: 5rem;
                `}>{nombre}</h1>
                <ContenedorProducto>
                    <div>
                        <p>Publicado hace: { formatDistanceToNow ( new Date(creado), {locale : es} ) }</p>
                        <p>Publicado por {creador.nombre} de {empresa} </p>
                        <img src={urlImg} />
                        <p>{descripcion}</p>
                        { usuario && (
                            <>
                                <h2>Agrega tu comentario</h2>
                                <form onSubmit={handleSubmit} >
                                    <Campo>
                                        <input 
                                            type="text"
                                            name="mensaje"
                                            onChange={handleChange}
                                        />
                                    </Campo>
                                    <InputSubmit 
                                        type="submit"
                                        value="Agregar comentario"
                                    />
                                </form>
                            </>
                        ) }
                        <h2 css={css`
                            margin-top: 3rem 0;
                        `}>Comentario</h2>
                        {comentarios.length === 0 ? "Aun no hay comentarios" : (
                            <ul>
                                {comentarios.map( (comentario, i) => (
                                    <li
                                        key={`${comentario.usuarioId}-${i}`}
                                        css={css`
                                            border: 1px solid #e1e1e1;
                                            padding: 2rem;
                                        `}
                                    >
                                        <p> {comentario.mensaje} </p>
                                        <p>Escrito por: 
                                            <span
                                                css={css`
                                                    font-weight:bold;
                                                `}
                                            >
                                                {''} {comentario.usuarioNombre}
                                            </span>
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <aside>
                        <Boton 
                            target="_blank"
                            bgColor="true"
                            href={url}
                        >Visitar URL</Boton>
                        <div
                            css={css`
                                margin-top: 5rem;
                            `}
                        >
                        <p css={css`
                            text-align: center;
                        `}> {votos} Votos</p>
                        { usuario && (
                            <Boton
                                onClick={votarProducto}
                            >Votar</Boton>
                        ) }
                        </div>
                    </aside>
                </ContenedorProducto>
            </>
        </Layout>
    );
};

export default Productos;