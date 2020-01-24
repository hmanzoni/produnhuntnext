import React, { useState } from 'react'
import Router from 'next/router'
import firebase from '../firebase'
import Layout from '../components/layout/Layout'
import useValidacion from '../hooks/useValidacion'
import {Formulario, Campo, InputSubmit, Error} from '../components/ui/Formulario'
import validarIniciarSesion from '../validacion/validarIniciarSesion'

const Login = () => {

  const [error, setError] = useState(false);

  const STATE_INICIAL = {
    email: '',
    password: '',
  }

  const {valores, errores, handleSubmit, handleChange, handleBlur} = useValidacion(STATE_INICIAL, validarIniciarSesion, iniciarSesion);
  const {email, password} = valores;

  async function iniciarSesion() {
    try {
      await firebase.login(email, password);
      Router.push('/');
    } catch (error) {
      console.error('Error: ', error.message)
      setError(error.message);
    }
  }

  return (
    <div>
      <Layout>
        <h1>Login</h1>
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
          <Campo>
            <label htmlFor="email">Email</label>
            <input
              type="text"
              id="email"
              placeholder="Tu email"
              name="email"
              value={email}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </Campo>
          {errores.email && <Error>{errores.email}</Error>}
          <Campo>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Tu password"
              name="password"
              value={password}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </Campo>
          {errores.password && <Error>{errores.password}</Error>}
          <InputSubmit
            type="submit"
            value="Login"
          />
          {error && <Error>{error}</Error>}
        </Formulario>
      </Layout>
    </div>
  )
}

export default Login
