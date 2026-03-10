import Head from "next/head";
import Content from "../components/content";
import Server from "../components/server";

export default function Servers(_props: any) {
    return <Content>
        <Head>
            <title>Serverek | Discord Zene Bot</title>
        </Head>
        <h1>Válasz egy szervert</h1>
        <div style={ {
            display: 'flex',
        } }>
            <Server
                icon="https://cdn.discordapp.com/icons/855346696258060338/93317b7b5c163ecaa21ed16db455066f.png?size=4096"
                name="Kódolás amogussal fordította Daniyt_th" id=";-;"/>
            <Server
                icon="https://cdn.discordapp.com/icons/855346696258060338/93317b7b5c163ecaa21ed16db455066f.png?size=4096"
                name="Kódolás amogussal fordította Daniyt_th" id=";-;"/>
            <Server
                icon="https://cdn.discordapp.com/icons/855346696258060338/93317b7b5c163ecaa21ed16db455066f.png?size=4096"
                name="Kódolás amogussal fordította Daniyt_th" id=";-;"/>
        </div>
    </Content>
}