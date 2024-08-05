# Spaced Repetition Journal Todoist Extension

## Overview

This is an extension for the [Todoist](https://todoist.com) application.
It creates a very simple spaced repetition journal in Todoist, that can be useful for students that want to automate the
spacing of their reviews.

The idea for this has been taken from [this video](https://youtu.be/Lt54CX9DmS4?si=U7_SDdFLWDqU6o--&t=2237).

## Usage

To use it you just need to create a task, click on the context menu and select this extension. Four subtasks will be
created with spaced due dates (the following day, in 1 week, in 3 weeks and in 6 weeks).

It is possible to edit the interval for each one of the four subtasks. You just need to open this integration settings
and edit the numbers in the text fields.

For now, it is only possible to edit the interval for four tasks, editing the number of subtasks is not possible.

## Getting started

You will need to create a Todoist app. To do so go to
Todoist's [App Management Console](https://developer.todoist.com/appconsole.html) and select "Create a new app" and give
it a name.
In the "UI Extensions" section, click "Add a new UI extension", give it a name, select "Context menu" as "Extension
type", select "Task" as "Context type". In "Data exchange URL" text field you will put the domain name of the
application (see next sections on how to do that) and add `/process` at the end of it.

Create also a settings extension by clicking on "Add a settings extension" instead of "Add a new UI extension". In "Data
exchange endpoint URL" put the same URL you used in the previous step.

![assets/ui-extension-creation.png](assets/ui-extension-creation.png)

Then back in the application menu, in the "UI Extensions" section make sure you have the checkbox with `data:read_write`
checked. This makes Todoist send a short-lived token, within the request to this application, that will be used for
authentication.

![short-lived-token.png](assets/short-lived-token.png)

You will need to assign as environment variable (named `TODOIST_VERIFICATION_TOKEN`) the string you find in section "App
settings" in the "Verification token" textbox. The application needs this to verify that the request actually came from
Todoist's servers.

### Running locally for development

First start the database with docker:

```
docker compose -f .docker/docker-compose-db.yml --env-file ./.env -p srj-db up -d
```

where with `.env` file the following environment variables are passed:

- `DB_USERNAME`
- `DB_PASSWORD`
- `DB_HOST` (set to `localhost` for local development)
- `DB_PORT`
- `DB_NAME` (should be set to `srj-pg`)
- `DATABASE_URL` (set to `postgresql://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`)
- `DB_ADMIN_USER`
- `DB_ADMIN_PASSWORD`

Now install the needed dependencies:

```
npm ci
```

Then run the application in development mode:

```
npm run dev
```

Then you will need to create a tunnel to expose it to the internet. You can use tools like ngrok, localtunnel or
CloudflareTunnels.
For example in order to expose port 3000 to the internet with ngrok run:

```
ngrok http 3000
```

Paste the domain name of the tunnel in the UI extension settings, as explained above, followed by `/process`.

Create in the root of the project a `.env` file and put there the value of the variable `TODOIST_VERIFICATION_TOKEN` (
explained above where to find it).

Now everything should be up and running! You can test it opening the context menu of a task and clicking on the
extension name.

### Running with docker

You can build and deploy your version of the application with the project `Dockerfile` (currently no official image
exist).

To build image run the following command in the project root:

```
docker build -t srj-todoist-extension .
```

Then you can run `docker-compose.yml` to start both the database and the extension container at the same time:

```
docker compose -f .docker/docker-compose.yml --env-file ./.env -p srj-full-stack up -d
```

where with `.env` the following environment variables are passed:

- `TODOIST_VERIFICATION_TOKEN` (explained above where to find this)
- `DB_USERNAME`
- `DB_PASSWORD`
- `DB_HOST` (must be set to `db` for compose to work)
- `DB_PORT`
- `DB_NAME` (should be set to `srj-pg`)
- `DATABASE_URL` (set to `postgresql://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`)
- `DB_ADMIN_USER`
- `DB_ADMIN_PASSWORD`

If you are running this container locally you will still need to create a tunnel (as explained
in [Running locally for development](#running-locally-for-development)).

Paste the domain name of the tunnel (or of your server if you deployed the container) in the UI extension settings, as
explained above, followed by `/process`.

Now everything should be up and running! You can test it opening the context menu of a task and clicking on the
extension name.

## Project structure

- `app.ts` - Contains the endpoints.
- `service/` - Contains services for requests to Todoist's APIs and for handling incoming requests.
- `utils/` - Contains utilities such as templates for bridges, interfaces or custom errors.
