import { createContext, useEffect, useState } from 'react'
import app from '../../firebase/config'
import Cookies from 'js-cookie'
import { User, getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth"
import Usuario from '../../model/Usuario'
import route from 'next/router'

interface AuthContextProps{
    usuario?: Usuario
    carregando?: boolean
    login?: (email: string, senha: string) => Promise<void>
    cadastrar?: (email: string, senha: string) => Promise<void>
    loginGoogle?: () => Promise<void>
    logout?: () => Promise<void>
}

const auth = getAuth(app)
const provider = new GoogleAuthProvider();

const AuthContext = createContext<AuthContextProps>({})

async function usuarioNormalizado(usuarioFirebase: User): Promise<Usuario> {
    const token = await usuarioFirebase.getIdToken()
    return {
        uid: usuarioFirebase.uid,
        nome:usuarioFirebase.displayName,
        email: usuarioFirebase.email,
        token,
        provedor: usuarioFirebase.providerData[0].providerId,
        imageUrl: usuarioFirebase.photoURL
    }
}

function gerenciarCookie(logado: boolean){
    if(logado) {
        Cookies.set('admin-template-diogo-auth', logado,{
            expires: 7
        })
    }else{
        Cookies.remove('admin-template-diogo-auth')
    }
}

export function AuthProvider(props){
    const [carregando, setCarregando] =  useState(true)
    const [usuario, setUsuario] =  useState<Usuario>(null)

    async function configurarSessao(usuarioFirebase){
        if(usuarioFirebase?.email){
            const usuario = await usuarioNormalizado(usuarioFirebase)
            setUsuario(usuario)
            gerenciarCookie(true)
            setCarregando(false)
            return usuario.email
        }else{
            setUsuario(null)
            gerenciarCookie(false)
            setCarregando(false)
            return false
        }
    }

    async function login(email, senha){
        try{
            setCarregando(true)
            const resp = await signInWithEmailAndPassword(auth, email, senha)
            
            await configurarSessao(resp.user)
            route.push('/')
        }finally{
           setCarregando(false)
        }
    }

    async function cadastrar(email, senha){
        try{
            setCarregando(true)
            const resp = await createUserWithEmailAndPassword(auth, email, senha)
            
            await configurarSessao(resp.user)
            route.push('/')
        }finally{
           setCarregando(false)
        }
    }

    async function loginGoogle(){
        try{
            setCarregando(true)
            const resp = await signInWithPopup(auth, provider)
            
            await configurarSessao(resp.user)
            route.push('/')
        }finally{
           setCarregando(false)
        }
    }

    async function logout(){
        try{
            setCarregando(true)
            await auth.signOut()
            await configurarSessao(null)
        }finally{
            setCarregando(false)
        }
    }

    useEffect(() => {
        if(Cookies.get('admin-template-diogo-auth')) {
            const cancelar = auth.onIdTokenChanged(configurarSessao)
            return () => cancelar()
        } else{
            setCarregando(false)
        }
    },[])
    return(
        <AuthContext.Provider value={{
            usuario,
            carregando,
            login,
            cadastrar,
            loginGoogle,
            logout
        }}>
            {props.children}
        </AuthContext.Provider>
    )
}

export default AuthContext