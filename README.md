# Project 1: Shared shopping list

Small shopping list project for
[CS-C3170](https://fitech101.aalto.fi/web-software-development/) with
functionality to crate and disable shopping lists, add items to individual
shopping lists and mark items as collected.

Uses [Deno](https://deno.land/) and [Postgres](https://www.postgresql.org/) as a
database.

Online deployment found [here](https://wsd-project1-production.up.railway.app/).

## Dependencies

[Deno](https://deno.land/manual@v1.28.2/getting_started/installation)

[Docker](https://docs.docker.com/get-docker/)

[Docker Compose](https://docs.docker.com/compose/install/)

## Development

### Envs

Use commands below to create .env file compatible with Docker database.

```
cp shopping-lists/.example.env shopping-lists/.env
```

### Database

For development postgres database run:

```
docker compose up
```

Uses flyway for migrations and data database initialization. In ./flyway/sql
commands to init db, currently no base data as generating basic data entries for
db is quite fast.

NOTE: Docker compose does not run application (makes no sense for dev), see
commands below.

### Running application

For running project locally (depends on db) use following commands, note TLS
certificate error is disabled for dev.

```
cd shopping-lists/
deno run --allow-net --allow-env --allow-read --unsafely-ignore-certificate-errors app.ts
```

## Lint

```
deno fmt
deno lint
```
