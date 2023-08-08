FROM node:18-bullseye-slim as client-builder

ARG APP_HOME=/app
WORKDIR ${APP_HOME}

COPY ./package.json ${APP_HOME}
RUN npm install && npm cache clean --force
COPY . ${APP_HOME}
RUN npm run build

# define an alias for the specific python version used in this file.
FROM python:3.11.4 as base

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    POETRY_VERSION='1.4.1'

ARG SOURCE_TAG
ENV SOURCE_TAG=$SOURCE_TAG

RUN useradd --create-home --home-dir /app --shell /bin/bash django

WORKDIR ${APP_HOME}
RUN pip install "poetry==$POETRY_VERSION"
COPY poetry.lock pyproject.toml ./

FROM base AS prod
ARG APP_HOME=/app
WORKDIR ${APP_HOME}
COPY . ${APP_HOME}
RUN POETRY_VIRTUALENVS_CREATE=false poetry install --only main

# copy application code to WORKDIR
COPY --from=client-builder --chown=django:django ${APP_HOME} ${APP_HOME}

# make django owner of the WORKDIR directory as well. 
RUN chown -R django:django /app
USER django

FROM base AS local
WORKDIR ${APP_HOME}
COPY . ${APP_HOME}
RUN POETRY_VIRTUALENVS_CREATE=false poetry install --with dev
USER django