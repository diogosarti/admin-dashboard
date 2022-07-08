import { useState } from "react";
import AuthInput from "../components/auth/AuthInput";
import { IconeWarning } from "../components/icons";

export default function Autenticacao(){
    const [erro, setErro] = useState(null)
    const [modo, setModo] = useState<'login' | 'register'>('login')
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')

    function exibirErro(msg, tempoEmSegundo = 7){
        setErro(msg)
        setTimeout(() => setErro(null), tempoEmSegundo * 1000)
    }

    function submeter(){
        if(modo === 'login'){
            console.log('login')
            exibirErro('Login Invalido')
        } else{
            console.log('cadastrar')
            exibirErro('Cadastro não encontrado')
        }
    }
    return(
        <div className="flex h-screen items-center justify-center">
            <div className="hidden md:block md:w-1/2 lg:w-2/3">
                <img 
                    src="https://source.unsplash.com/random" 
                    alt="Imagem tela de login"
                    className="h-screen w-full object-cover"
                
                />
            </div>
            <div className={`
                w-full md:w-1/2 lg:w-1/3
                p-10 m-10 rounded-lg
            `}>
                <h1 className={`
                    text-3xl font-bold mb-5
                `}>
                    {modo === 'login' ? 'Entre com a sua conta' : 'Cadastre-se na plataforma'}
                </h1>

                {erro ? (
                    <div className={`
                        flex items-center bg-red-400 text-white py-3 px-5 my-2 border border-red-700 rounded-lg
                    `}>
                        {IconeWarning()}
                        <span className="ml-3 text-sm">{erro}</span>
                    </div>
                ) : false}
                

                <AuthInput 
                    label="Email"
                    type="email"
                    valor={email}
                    valorMudou={setEmail}
                    obrigatorio
                />
                <AuthInput 
                    label="Senha"
                    type="password"
                    valor={senha}
                    valorMudou={setSenha}
                    obrigatorio
                />

                <button onClick={submeter} className={`
                    w-full bg-indigo-500 hover:bg-indigo-400
                    text-white rounded-lg px-4 py-3 mt-6
                `}>
                    {modo === 'login' ? 'Entrar' : 'Cadastrar'}
                </button>

                <hr className="my-6 border-gray-300 w-full"/>

                <button onClick={submeter} className={`
                    w-full bg-red-500 hover:bg-red-400
                    text-white rounded-lg px-4 py-3
                `}>
                    Entrar com Google
                </button>

                {modo === 'login' ? (
                    <div>
                        <p className="mt-8">
                            Novo por aqui?
                            <a onClick={() => setModo('register')} className={`
                                text-blue-500 hover:text-blue-700 font-semibold cursor-pointer
                            `}> Crie uma conta</a>
                        </p>
                        <p className="mt-2">
                        Esqueceu a senha?
                        <a onClick={() => null} className={`
                            text-blue-500 hover:text-blue-700 font-semibold cursor-pointer
                        `}> Recuperar Senha</a>
                    </p>
                    </div>
                    
                    
                ) : (
                    <p className="mt-8">
                        Possui uma conta?
                        <a onClick={() => setModo('login')} className={`
                            text-blue-500 hover:text-blue-700 font-semibold cursor-pointer
                        `}> Login</a>
                    </p>
                )}
            </div>
        </div>
    )
}