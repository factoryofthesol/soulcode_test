
# Marvin Test repo

This project contains an example Django application configured
to use [Prefect 2.0](https://prefect.io) for workflows and tasks.

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

# Setup
This repo is uses Poetry and installs the backend folder as required by Prefect to use Django Apps as dependencies.

System Requirements include:
- Python3.10
- Poetry
- Node.js LTS(18) & Usage of [PNPM](https://pnpm.io/) is preferred as indicated by Package.json, it will save you disk space! Enable pnpm with `corepack enable` in a terminal running as administrator.
- Install node_modules with `pnpm install`; this will automatically run `postinstall` script and activate git-hooks.

## Commitizen
This repo uses [commitizen](https://github.com/commitizen/cz-cli) to keep along with [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/)
enabled with [gitmojis](https://gitmoji.dev/). Commits will be linted with [commitlint cli](https://github.com/conventional-changelog/commitlint) activated as a precommit git hook with [simple-git-hooks](https://github.com/toplenboren/simple-git-hooks) to provide a clean changelog of features.
* To begin using these tools easily with your commits, just begin by typing `pnpm commit`

## Project structure - Python
```
.
├── README.md
├── .env.example
├── Makefile
├── backend
│   ├── __init__.py
│   ├── manage.py
│   ├── config
│   ├── notebooks
│   ├── www
│   └── apps
|       ├── core
|       ├── users
│       └── workflows
│           ├── __init__.py
│           ├── apps.py
│           ├── management
│           │   └── commands
│           │       └── prefectcli.py
│           ├── test_flow-deployment.yaml
│           ├── test_flow.py
│           └── tests.py
├── Dockerfile
├── docker-compose.yml
├── package.json
└── pyproject.toml
```

The important parts for our consideration are:

- The Prefect flow: `myapi/workflows/test_flow.py`
- An example Deployment definition for the flow: `myapi/workflows/test_flow-deployment.py`
- A Django management command for running Prefect CLI commands within a Django environment: `myapi/workflows/management/commands/prefectcli.py`
- Django views that demonstrate how to run the flow: `myapi/myapi/views.py`

You can read these files in depth to see how they work. This README will
walk you through _using_ the bundled management command and example Django
views.

Next, **set up Django**. This example assumes you are familiar with the setup
that Django requires, like running initial migrations and creating a superuser.

1. `make check` - check that system requirements are met
2. `make poetry-install` - install poetry dependencies
3. `make poetry-makemigrations && make poetry-migrate` - run django migrations
4. `make poetry-createsuperuser` - create django superuser

**NOTE**: You will need at least one user in your database for this example to
work!

## Run Prefect and Django

For this example, you should have a Prefect API server running.

NOTE: This example project includes a management command, `prefectcli`, that
runs any Prefect CLI command. For consistency, this README will use the
`prefectcli` wrapper for all Prefect commands.

Run the server like this:

5. `make poetry-prefect-server` - start prefect server
In yet another terminal, start the Django API:

6. `make poetry-runserver` - start django server
OK! Don't try to use the API yet. Before we do that, we're going to create a
Deployment for the example flow.

## Create a Deployment

This example includes an example Deployment YAML file in
`workflows/example-deployment.yaml`, but this is just so you can see a working
file. **You will need to build your own Deployment YAML for this example.**

You should build your own Deployment YAML by running the following command
from the root of the project:

7. `make poetry-prefect-build` - build example deployment from test-flow.py
The output will be a YAML file. You can check it out if you want, but you
can also just _apply_ it -- this sets up your new Deployment in the Prefect
API:

8. `make poetry-prefect-deploy` - "apply" deployment file, you just created
NOTE: Remember to apply **your** YAML file -- the YAML file that you just
built with the `build` command, not the example YAML file.

## Start the Prefect Agent

Once you have the Prefect API running and have created a Deployment, you can
start the Prefect Agent.

In a new terminal, run the following command:

9. `make poetry-prefect-agent` - start prefect agent
You should now have three processes running:

- The Django development server
- The Prefect API
- The Prefect agent

Now, you're ready to run some flows!

## Running flow immediately

You can run a Prefect flow immediately by calling it. Let's see how this works
from a Django view.

### The code

If you look in the file `config/views.py`, you'll see the following Django view:

```python
from django.http import HttpResponse

from workflows.test_flow import test_flow


def run_flow_immediately(request):
    """
    Calling a flow runs it in the current Python process, which may not be what
    you want during a web request but is still possible.
    """
    test_flow()
    return HttpResponse(status=200)
```

This view imports the Prefect flow `test_flow` and calls it. Doing so runs the
flow immediately in the current Python process, which means that the flow will
run to completion before the Django view returns an HTTP response.

### Seeing it work

To see how this works, open a browser and visit: http://localhost:8000/run_flow_immediately

**NOTE**: You should still have the processes we started earlier running,
e.g. the Django development server, Prefect API, and Prefect agent.

Now check your Django server output. You should see something like this:

```
00:43:41.622 | INFO    | prefect.engine - Created flow run 'conscious-tuna' for flow 'test-flow'
Hello! andrew
00:43:41.772 | INFO    | Flow run 'conscious-tuna' - Finished in state Completed()
[14/Oct/2022 00:43:41] "GET /run_flow_immediately HTTP/1.1" 200 0
```

What happened? Your flow ran in the server process. It finished, and then
Django returned an HTTP response.

## Scheduling a flow run

What you _probably_ want to do in a web request is schedule a flow to run
"at some time" and return an HTTP response to the user without waiting for
the flow run to complete. Let's see how to do that from a Django view.

### The code

You can schedule a flow to run outside the current Python process using
a Deployment. Once you've created a deployment for your flow, you can use
the `run_deployment()` helper to schedule a flow run.

Once again in the `config/views.py` file, you'll see the following Django view:

```python
from django.http import HttpResponse

from prefect.deployments import run_deployment


def schedule_flow_run(request):
    """
    Once a deployment exists for your flow, you can use `run_deployment()` to
    schedule a flow run.
  
    By default, `run_deployment()` will wait for the flow run to complete
    before returning. However, if you set `timeout=0`, the function returns
    immediately: the Django web request continues, and sometime later, your
    Prefect agent process will run the flow.
    """
    run_deployment('test-flow/test-flow', timeout=0)
    return HttpResponse(status=200)
```

### Seeing it work

That's exactly what will happen if you visit
the following URL: http://localhost:8000/schedule_flow_run

If you check out the console output for your running Prefect agent, you should
see something like this:

```
./manage.py prefectcli agent start -q default
Starting v2.6.0 agent connected to http://localhost:4200/api...

  ___ ___ ___ ___ ___ ___ _____     _   ___ ___ _  _ _____
 | _ \ _ \ __| __| __/ __|_   _|   /_\ / __| __| \| |_   _|
 |  _/   / _|| _|| _| (__  | |    / _ \ (_ | _|| .` | | |
 |_| |_|_\___|_| |___\___| |_|   /_/ \_\___|___|_|\_| |_|


Agent started! Looking for work from queue(s): default...
00:48:11.140 | INFO    | prefect.agent - Submitting flow run '23df07af-2f29-4997-8db2-5051d6c9b2c7'
00:48:11.212 | INFO    | prefect.infrastructure.process - Opening process 'grumpy-lemur'...
00:48:11.217 | INFO    | prefect.agent - Completed submission of flow run '23df07af-2f29-4997-8db2-5051d6c9b2c7'
00:48:24.331 | INFO    | Flow run 'grumpy-lemur' - Finished in state Completed()
Hello! andrew
00:48:26.706 | INFO    | prefect.infrastructure.process - Process 'grumpy-lemur' exited cleanly.
```

That's your Prefect flow running in the agent process -- not in your web request! Just the way it should be. 😎
