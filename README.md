# BlackIn Frontend

## Project Description

BlackIn is an agentic AI powered code editor built for smart contract development on Base. It brings writing, auditing, and deploying smart contracts into a single browser based environment, designed for developers who want to ship on Base without the overhead of manual tooling and configuration.

## BlackIn - Agentic Smart Contract Auditor

BlackIn is an agentic AI powered code editor built specifically for smart contracts on Base. It runs entirely in the browser, so there is nothing to install and nothing to configure. It is similar to Cursor in interaction style, but purpose built for blockchain development with security and deployment integrated directly into the generation process.

Building on Base today often requires a developer to understand Solidity deeply, set up Foundry, configure Chainlink Runtime Environment manually, write workflow files by hand, and then wire everything together before a single production meaningful contract line is ready. That setup can consume a full day or more, and each manual step increases the chance of shipping vulnerable code that manages real value. Many teams skip security review early in development or delay it until late in the cycle.

BlackIn eliminates both problems at once. You open BlackIn, describe your project in plain language, and the AI takes over. It plans the application, writes Solidity smart contracts, generates frontend files, and creates Chainlink Runtime Environment workflow files in one pass. While contracts are being written, BlackIn runs audit oriented checks against known vulnerability patterns so developers can review code that is already screened during generation.

After initial generation, the project can be refined through chat in the same workspace by asking for function additions, logic changes, and structural updates. When the project is ready, deployment can be initiated for Base Sepolia or Base Mainnet. The deployment path runs through Chainlink Runtime Environment lifecycle stages including simulate, deploy, and activate so the workflow is not only deployed but brought to an active runtime state.

The final outcome is one prompt producing a complete Base application package with contracts, frontend, Chainlink Runtime Environment workflow, security aware generation, and deployment readiness. Work that previously took days of setup can be reduced to minutes of guided execution.

## Project Links

The product walkthrough video is available at https://www.youtube.com/watch?v=UGXNKP0y-ZM. The Chainlink integration reference for this product is documented at https://github.com/Black-in/lighthouse-main/blob/main/Chainlink.md.

## How to Build and Run the Frontend

Install dependencies with `pnpm install`, ensure backend API and socket services from `lighthouse-main` are running, and start the frontend with `pnpm --filter web dev`. The web application runs on port `3000` and reads backend and socket endpoints through environment variables such as `NEXT_PUBLIC_BACKEND_URL` and `NEXT_PUBLIC_SOCKET_URL`. For validation and build quality, run `pnpm --filter web lint` and `pnpm --filter web build`.

## Frontend Project Structure

Frontend application routes and layouts are implemented in `apps/web/app`. Reusable UI modules and product panels are implemented in `apps/web/src/components`. Request utilities, runtime adapters, and server client helpers are implemented in `apps/web/src/lib`. Interaction orchestration logic is implemented in `apps/web/src/hooks`, while global client state is maintained in `apps/web/src/store`. This structure allows prompt flow, file rendering, terminal interaction, and deployment controls to stay connected in one interface.

## Project Architecture Diagram

```mermaid
flowchart LR
    U["User in Browser"] --> FE["BlackIn Frontend (lighthouse-club)"]
    FE --> API["Backend API (apps/server)"]
    FE --> WS["Socket Runtime (apps/socket)"]
    API --> GEN["Prompt Planning and Code Generation"]
    GEN --> OBJ["Object Store and Workspace Files"]
    API --> Q["CRE Deploy Queue"]
    Q --> WORKER["CRE Runtime Worker"]
    WORKER --> CRE["Chainlink CRE CLI Lifecycle"]
    CRE --> SIM["workflow simulate"]
    CRE --> DEP["workflow deploy"]
    CRE --> ACT["workflow activate"]
    WORKER --> BASE["Base Sepolia or Base Mainnet"]
    API --> DB["Postgres (Contracts, Build Jobs, Deployments)"]
    API --> REDIS["Redis PubSub and Queue Transport"]
    WS --> REDIS
    REDIS --> FE
```
