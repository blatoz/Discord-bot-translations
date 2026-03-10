import Head from "next/head";
import { useEffect } from "react";

export default function Logout(_props: any) {
    useEffect(() => {
        window.location.href = "/api/logout"
    }, []);

    return <>
        <Head>
            <title>Kijelentkezés | Discord Zene Bot</title>
        </Head>
        <p>Átirányítás a kijelentkezéshez…</p>
    </>
}
