# ModBot
[![Discord](https://img.shields.io/discord/826482655893127248?style=plastic)](https://discord.gg/zYYhgPtmxw)
[![GitHub](https://img.shields.io/github/license/aternosorg/modbot?style=plastic)](https://github.com/aternosorg/modbot/blob/master/LICENSE)
[![GitHub contributors](https://img.shields.io/github/contributors/aternosorg/modbot?style=plastic)](https://github.com/aternosorg/modbot/graphs/contributors)
[![GitHub last commit](https://img.shields.io/github/last-commit/aternosorg/modbot?style=plastic)](https://github.com/aternosorg/modbot/commits/)

---
ModBot egy forráskódú moderációs bot, amelynek fejlesztője [Aternos](https://aternos.org/).

**Modern Discord funkciókat** használ, mint például slash-parancsok, kontextus menük, időkorlátok, gombok, kiválasztási menük
és modális ablakok, és minden szükséges funkciót biztosít a moderáláshoz. Ide tartoznak a trágár szavak és az automatikus válaszok
reguláris kifejezések támogatásával, a phishing URL-ek felismerése, ideiglenes letiltások, figyelmeztető rendszer, üzenetnaplózás
és számos más automatikus moderálási szűrő.


### Képernyőképek
A gombok, modális ablakok és kontextus menüknek köszönhetően a felhasználók moderálása és az információk megtekintése gyorsabb, mint valaha:

![User Embed](https://user-images.githubusercontent.com/45244473/196917527-cff86e16-f074-493d-8067-a85c0599c102.png)

ModBot figyelmeztető rendszerének köszönhetően nem fogja kétszer ugyanazon felhasználónak végtelenül küldeni figyelmeztető üzenetet.
Ha egy másik moderátor már figyelmeztetett ezt a felhasználót a utolsó 5 percben, akkor ModBot figyelmeztetést nem küldhet.

![Strike Confirmation](https://user-images.githubusercontent.com/45244473/196927951-5a3f8cda-8cda-4824-a094-ee868a335709.png)

### Add hozzá a ModBotot a szerveredhez
Hozzáadásával a szerveredre hozzáférhet a bot. Előfordulhat, hogy a botnak bizonyos jogosultságokat kell rendelnie a megfelelő működés érdekében. <br>
Meghívás: [Click me](https://discord.com/oauth2/authorize?client_id=790967448111153153&scope=bot%20applications.commands&permissions=1099780074646)

Az összes parancsot megtekintheti, ha egy perjelet `/` ír be a szövegbeviteli mezőbe.
Az összes parancs és opció egyértelmű leírással rendelkezik.

Van egy [Discord szerverünk is](https://discord.gg/zYYhgPtmxw). <br>
**Kérjük, vegye figyelembe: a ModBot számunkra egy mellékprojekt. 
Nem keresünk vele pénzt, elsősorban a saját szervereinken való használatra fejlesztjük. 
Nem tudunk minden problémában segíteni, és nem adunk hozzá olyan funkciókat, amelyekre nincs szükségünk.**

### Először is
- A beállításokat megtekintheti `/settings overview` parancsával
- A naplócsatorna beállításához használja `/settings log-channel <#channel>` parancsot
- A Vortex-ből importálhatja a figyelmeztetéseket, némításokat és bannokat `/import` parancs segítségével
- Ha YouTube-playlistet szeretne konfigurálni, használja `/settings playlist <url>` parancsot
- A Zendesk segédkönyvtár hozzáadásához használja `/settings helpcenter <url>` parancsot

### Támogatás
A parancsok használatát megtekintheti a `/help` parancs segítségével.<br>
Ha találsz egy hibát a ModBotban, kérjük, hozz létre egy [issue](https://github.com/aternosorg/modbot/issues). <br>
A biztonsági problémákhoz tekintse meg a [SECURITY.md](./SECURITY.md).

### Saját hostolás
Ha saját magad szeretnéd üzemeltetni a botot, használhatod előre elkészített docker képünket, vagy közvetlenül telepítheted.
Mindkét esetben szükséged lesz egy [MySQL](https://dev.mysql.com/downloads/mysql/) adatbázisra és egy 
[Discord alkalmazásra](https://discord.com/developers/applications/):

1. Hozzon létre egy [Discord alkalmazást](https://discord.com/developers/applications/) és engedélyezze a SERVER MEMBERS szándékot.
   A botnak erre van szüksége ahhoz, hogy újra hozzárendelje a némított szerepkört, amikor egy némított felhasználó csatlakozik a szerveréhez.
2. Add a bot to the application and copy the auth token
3. Konfigurálja a botot (lásd [CONFIGURATION.md](./CONFIGURATION.md))
4. Hozzon létre egy [Discord botot](https://discord.com/developers/applications/) és másolja be a hitelesítési tokenjét
5. Hozzon létre egy [MySQL](https://dev.mysql.com/downloads/mysql/) adatbázist és másolja be a hitelesítési tokenjét
6. Hozzon létre egy [Discord szerveret](https://discord.com/developers/applications/) és másolja be a szerver ID-jét a konfigurációs fájlba
7. Folyassa tovább a telepítési utasításokat a választott telepítési mód szerint

#### Docker
Követelmények: [Docker](https://docs.docker.com/get-docker/)
```bash 
docker run -e MODBOT_AUTH_TOKEN="<discord-auth-token>" -e MODBOT_DATABASE_HOST="<database-host>" -e MODBOT_DATABASE_PASSWORD="<database-password>" ghcr.io/aternosorg/modbot
```

#### Közvetlen telepítés
Követelmények: [Node.js](https://nodejs.org/en/download/) (v22+), egy [MySQL](https://dev.mysql.com/downloads/mysql/) adatbázis
1. Töltse le a kódot és futtassa `npm ci`
2. Futtassa `npm start` hogy elindítsa a botot

### Hozzájárulás
Ha szeretnél hozzájárulni, akkor [forkold](https://docs.github.com/en/github/getting-started-with-github/fork-a-repo)
a repository-t, majd add hozzá a változásokat a fork-odhoz, és hozz létre egy [pull request-et](https://github.com/aternosorg/modbot/compare).
Javasoljuk továbbá, hogy nézd meg a discord.js [dokumentációját](https://discord.js.org/#/docs/). Ha bármilyen kérdésed van,
hozz létre egy problémát, vagy csatlakozz a [discordunkhoz](#add-modbot-to-your-server).
Ha hibát találsz a fordításban akkor csatlakozz a [Discord szerverünkhöz](https://discord.gg/8c6sAqmE9V)
Fordítást készítette: daniyt_th (Daniyt_th)