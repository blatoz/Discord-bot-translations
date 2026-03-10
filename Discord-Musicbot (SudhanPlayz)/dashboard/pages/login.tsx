import Head from "next/head";
import {useEffect} from "react";

const Login = (_props: any) => {
    useEffect(() => {
        window.location.href = "/api/login"
    });

    return <>
        <Head>
            <title>Bejelentkezés | Discord Zene Bot</title>
        </Head>
        <p>Átírányítás a bejelentkezés...</p>
    </>
}


export default Login
