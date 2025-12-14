# InviteManager Discord Bot

## Leírás

Ez a kódja a InviteManager Discord Botnak

## Dokumentáció

[Kattints ide a dokumentáció megtekintéséhez](https://invitemanager.cc)

## Saját hostolás gyors beállítás

### Előfeltételek

- NodeJS (tesztelve v14)
- Adatbázis (tesztelve `MySQL` 8.0, `MariaDB` 10.4+ működik)

### Beállítás

1. `npm install`
1. Adatbázisok beállítása
   1. Használd a `scripts/db/setup_db0.sql` scriptet a globális adatbázis `im_0` beállításához
   1. Használd a `scripts/db/setup_dbx.sql` scriptet a adatbázisok `im_1`, `im_2`, ... beállításához (legalább egy szükséges)
1. Másold a `config.example.json` fájlt `config.json` néven és kitöltöld a szükséges adatokat
1. `npm start` parancs futtatásával indítsd el a botot.
