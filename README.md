# Big Data Pipeline Monitor

Big Data Pipeline Monitor is a full-stack web application for managing, running and monitoring simulated data pipelines.

The project was created as an individual school project for the MSWA course. Its purpose is to demonstrate the ability to design a client-server application, implement a REST API, connect it to a frontend application, and explain the architectural decisions during an oral defense.

The application simulates systems used in real data platforms, such as Apache Airflow, Databricks Jobs or AWS Glue. It does not perform real distributed data processing. The goal is to model the architecture and monitoring logic of such a system.

---

## Project goal

The goal of this project is to design and implement a system for monitoring data pipelines.

The application allows users to:

- register datasets,
- create pipelines above existing datasets,
- manually run pipelines,
- monitor pipeline runs,
- inspect run details and run steps,
- create alert rules,
- generate alert events when a run fails or exceeds a runtime threshold,
- view a dashboard summary of the current system state.

---

## Main idea

In a real data platform, data pipelines are used to process datasets. A pipeline can be scheduled or manually triggered. Each execution of a pipeline creates a run. A run has a status, timing information, processed record count and optionally an error message.

This project simulates that behavior.

A typical flow is:

1. A dataset is created.
2. A pipeline is created above that dataset.
3. The pipeline is manually started.
4. A new run is created with status `running`.
5. The run is later marked as `success` or `failed`.
6. If the run fails or exceeds a configured runtime threshold, an alert is created.
7. The user can monitor runs and alerts in the frontend.

---

## Technologies used

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- REST API
- dotenv
- cors

### Frontend

- React
- React Router
- Axios
- CSS

### Development tools

- Git
- GitHub
- Insomnia
- MongoDB Compass

---

## Architecture

The application uses a classic client-server architecture.

React SPA frontend  
↓ HTTP / JSON  
Express REST API backend  
↓ Mongoose  
MongoDB database

The frontend and backend are separated.

The frontend is a React single-page application. It communicates with the backend using HTTP requests and receives data in JSON format.

The backend is a RESTful web service. It exposes resources such as datasets, pipelines, runs, alert rules and alerts.

MongoDB stores the application data.

---

## Backend architecture

The backend is divided into several layers:

- `backend/src/config`
- `backend/src/controllers`
- `backend/src/middleware`
- `backend/src/models`
- `backend/src/routes`
- `backend/src/services`
- `backend/src/validators`
- `backend/src/app.js`
- `backend/src/server.js`

### Layers

#### Routes

Routes define API endpoints and connect them to controllers.

Example endpoints:

- `GET /api/pipelines`
- `POST /api/pipelines/:id/run`
- `PATCH /api/runs/:id`

#### Controllers

Controllers handle HTTP requests and responses. They receive input from the request, call the service layer and return a JSON response.

#### Services

Services contain business logic. For example:

- a pipeline cannot be created above a non-existing dataset,
- only an active pipeline can be started,
- only a running run can be finished,
- an alert is created when a run fails or exceeds the runtime threshold.

#### Models

Models define MongoDB documents using Mongoose schemas.

#### Validators

Validators check request input before the data reaches the business logic.

#### Middleware

Middleware handles shared behavior such as error handling.

---

## Domain model

The project uses the following domain entities:

### Dataset

Represents a metadata record of a data source.

Example datasets:

- customer transactions,
- customer events,
- logs.

A dataset does not represent a real physical big data file in this project. It only stores metadata.

### Pipeline

Represents a data processing process created above a dataset.

A pipeline contains:

- name,
- description,
- schedule,
- active status,
- reference to a dataset.

A pipeline can only be started if it is active.

### PipelineVersion

Represents a version of a pipeline configuration.

A pipeline version contains:

- version number,
- engine,
- list of steps,
- active flag.

The application creates an initial active version automatically when a pipeline is created.

### JobRun

Represents one execution of a pipeline.

A run contains:

- pipeline reference,
- pipeline version reference,
- status,
- startedAt,
- finishedAt,
- recordsProcessed,
- errorMessage.

Allowed statuses:

- `pending`
- `running`
- `success`
- `failed`

The project recognizes the `pending` status in the model, but created runs are started directly as `running`.

### JobRunStep

Represents a step inside a pipeline run.

Example steps:

- `extract`
- `transform`
- `load`

### AlertRule

Defines a condition when an alert should be created.

Supported rule types:

- `FAILED_RUN`
- `RUNTIME_EXCEEDED`

### AlertEvent

Represents a concrete alert created when a rule condition is met.

An alert contains:

- related rule,
- related pipeline,
- related run,
- message,
- severity,
- status.

---

## Business rules

The application implements the following business rules:

### Pipeline creation

A pipeline can only be created if the referenced dataset exists.

### Pipeline start

A pipeline can only be started if:

- the pipeline exists,
- the pipeline is active,
- the pipeline has an active version.

### Run lifecycle

A run is created when a pipeline is started.

The main run status lifecycle is:

- `running → success`
- `running → failed`

This means that only a running run can be finished.

### Alert creation

An alert can be created when:

- a run ends with status `failed`,
- a run runtime exceeds a configured threshold.

---

## REST API endpoints

The backend API is available under:

`http://localhost:5000/api`

### Datasets

- `POST /api/datasets`
- `GET /api/datasets`
- `GET /api/datasets/:id`

### Pipelines

- `POST /api/pipelines`
- `GET /api/pipelines`
- `GET /api/pipelines/:id`
- `POST /api/pipelines/:id/run`

### Runs

- `GET /api/runs`
- `GET /api/runs/:id`
- `PATCH /api/runs/:id`

### Alert rules

- `POST /api/alert-rules`
- `GET /api/alert-rules`
- `GET /api/alert-rules/:id`
- `PATCH /api/alert-rules/:id`
- `DELETE /api/alert-rules/:id`

### Alerts

- `GET /api/alerts`
- `GET /api/alerts/:id`

### Dashboard

- `GET /api/dashboard/summary`

---

## Frontend features

The frontend contains the following main pages:

### Dashboard

Shows a summary of the system:

- number of datasets,
- number of pipelines,
- number of active pipelines,
- number of runs,
- number of failed runs,
- number of open alerts.

### Datasets

Allows the user to:

- view datasets,
- create a new dataset.

### Pipelines

Allows the user to:

- view pipelines,
- create a new pipeline,
- start a pipeline,
- see last run,
- see last status,
- open pipeline detail.

### Pipeline detail

Shows:

- pipeline metadata,
- related dataset,
- active version,
- pipeline steps,
- run statistics,
- related runs,
- related alerts,
- button to start the pipeline.

### Runs

Allows the user to:

- view all runs,
- filter runs by pipeline,
- filter runs by status,
- filter runs by date,
- see runtime,
- mark a running run as success,
- mark a running run as failed.

### Run detail

Shows:

- pipeline,
- pipeline version,
- status,
- start time,
- finish time,
- runtime,
- processed records,
- error message,
- run steps.

### Alert rules

Allows the user to:

- create alert rules,
- view alert rules,
- enable or disable alert rules,
- delete alert rules.

### Alerts

Allows the user to:

- view alerts,
- open alert detail,
- inspect related pipeline and run.

---

## Loading, empty and error states

The frontend implements basic UI states:

- loading state when data is being loaded,
- empty state when no data exists,
- error state when an API request fails.

These states are implemented as reusable React components.

---

## Installation and setup

### Requirements

Before running the project, make sure you have installed:

- Node.js
- npm
- MongoDB
- Git

MongoDB can run locally, for example through MongoDB Community Server.

---

## Backend setup

Open terminal in the backend folder:

`cd backend`

Install dependencies:

`npm install`

Create a `.env` file in the `backend` folder:

`PORT=5000`  
`MONGO_URI=mongodb://127.0.0.1:27017/big-data-pipeline-monitor`

Start the backend:

`npm run dev`

The backend should run on:

`http://localhost:5000`

Test root endpoint:

`GET http://localhost:5000/`

Expected response:

`{ "message": "Big Data Pipeline Monitor API is running" }`

---

## Frontend setup

Open another terminal in the frontend folder:

`cd frontend`

Install dependencies:

`npm install`

Start the frontend:

`npm start`

The frontend should run on:

`http://localhost:3000`

---

## Example demo scenario

This scenario can be used during the project defense.

### 1. Create a dataset

Open the Datasets page and create a dataset:

- Name: `customer_transactions`
- Description: `Customer transactions from e-shop orders`
- Owner: `analytics-team`
- Schema version: `1`

### 2. Create a pipeline

Open the Pipelines page and create a pipeline above the dataset:

- Dataset: `customer_transactions`
- Name: `daily_aggregation`
- Description: `Daily aggregation of customer transactions`
- Schedule: `0 2 * * *`
- Active: `true`

### 3. Create an alert rule

Open the Alert Rules page and create a rule:

- Type: `FAILED_RUN`
- Name: `Failed run alert`
- Severity: `high`
- Enabled: `true`

Optionally create a runtime rule:

- Type: `RUNTIME_EXCEEDED`
- Name: `Runtime exceeded alert`
- Threshold minutes: `1`
- Severity: `medium`
- Enabled: `true`

### 4. Start a pipeline

Open the Pipelines page and click:

`Run pipeline`

A new run is created with status:

`running`

### 5. Monitor the run

Open the Runs page.

The run is visible in the run list with:

- pipeline,
- status,
- startedAt,
- finishedAt,
- runtime,
- recordsProcessed.

### 6. Finish the run

Mark the run as:

`success`

or:

`failed`

If the run is marked as failed, the system creates an alert if a matching alert rule exists.

### 7. Inspect alert

Open the Alerts page and inspect the created alert.

The alert detail shows:

- message,
- severity,
- status,
- related rule,
- related pipeline,
- related run.

### 8. Inspect pipeline detail

Open the pipeline detail.

The detail shows:

- metadata,
- active version,
- run statistics,
- list of runs,
- list of related alerts.

---

## Example API requests

### Create dataset

Endpoint: `POST /api/datasets`

Body:

{
  "name": "customer_transactions",
  "description": "Customer transactions from e-shop orders",
  "owner": "analytics-team",
  "schemaVersion": 1
}

### Create pipeline

Endpoint: `POST /api/pipelines`

Body:

{
  "datasetId": "DATASET_ID_HERE",
  "name": "daily_aggregation",
  "description": "Daily aggregation of customer transactions",
  "schedule": "0 2 * * *",
  "active": true
}

### Start pipeline

Endpoint: `POST /api/pipelines/PIPELINE_ID_HERE/run`

### Finish run successfully

Endpoint: `PATCH /api/runs/RUN_ID_HERE`

Body:

{
  "status": "success",
  "recordsProcessed": 152340
}

### Finish run with failure

Endpoint: `PATCH /api/runs/RUN_ID_HERE`

Body:

{
  "status": "failed",
  "recordsProcessed": 4200,
  "errorMessage": "Transformation step failed because input schema is invalid"
}

### Create failed run alert rule

Endpoint: `POST /api/alert-rules`

Body:

{
  "pipelineId": "PIPELINE_ID_HERE",
  "name": "Failed run alert",
  "type": "FAILED_RUN",
  "severity": "high",
  "enabled": true
}

### Create runtime exceeded alert rule

Endpoint: `POST /api/alert-rules`

Body:

{
  "pipelineId": "PIPELINE_ID_HERE",
  "name": "Runtime exceeded alert",
  "type": "RUNTIME_EXCEEDED",
  "thresholdMinutes": 1,
  "severity": "medium",
  "enabled": true
}

---

## Error handling

The backend uses a centralized error handler.

Errors are returned in JSON format.

Example:

`{ "message": "Pipeline not found" }`

Validation errors are also returned as JSON responses.

---

## Why REST

REST was chosen because it fits the client-server architecture of the project.

The main reasons are:

- clear separation between frontend and backend,
- stateless communication,
- simple JSON data exchange,
- easy testing through Insomnia,
- endpoints represent domain resources,
- suitable architecture for a React SPA.

The backend does not store client session state. Each request contains all necessary information.

---

## What the application does not do

This project intentionally does not implement a real big data platform.

It does not:

- run Spark jobs,
- orchestrate real Airflow DAGs,
- process real big data files,
- run a real cron scheduler,
- manage a physical cluster,
- implement production authentication.

The goal is to simulate the architecture, domain model and monitoring logic of a pipeline monitoring system.

---

## Possible future improvements

Possible future improvements include:

- user authentication,
- user roles: admin, operator, viewer,
- cloud deployment,
- MongoDB Atlas database,
- pipeline activation and deactivation,
- more advanced alert lifecycle management,
- real scheduled runs,
- charts and historical analytics,
- connection to real orchestration systems such as Airflow.

---

## Project defense summary

During the oral defense, the project can be explained as follows:

This project is a full-stack monitoring application for simulated data pipelines. The frontend is a React SPA and the backend is an Express REST API. Data is stored in MongoDB through Mongoose models.

The main architectural decision was to separate the application into frontend and backend parts. The frontend only displays data and sends user actions to the backend. The backend contains the business logic, validation and persistence.

The most important business rules are that a pipeline must reference an existing dataset, only an active pipeline can be started, a run can be finished as success or failed, and alerts are created when something goes wrong.

The project does not aim to implement a real big data engine. Instead, it models the architecture and monitoring behavior of systems like Airflow, Databricks Jobs or AWS Glue.