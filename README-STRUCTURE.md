# Backend Project Structure Standard (NestJS + TypeScript)

## Purpose
This document defines the company-wide, reusable project structure for all backend services. It standardizes folder layout, file placement, and module boundaries to enable long-term scalability, clear ownership, and safe evolution into multiple microservices. This is a standard, not a tutorial.

## Philosophy
- Structure must make ownership obvious: each domain feature should be isolated and easy to extract into its own service.
- Dependency direction must be explicit: domain and application code must not depend on transport or infrastructure.
- Clarity over cleverness: the directory tree should answer "where does this belong?" at a glance.
- Teams should be able to work independently: minimal shared areas, explicit contracts, and stable boundaries.

## Standard Folder Layout
```text
src/
  main.ts
  app.module.ts

  config/
    env.ts
    logger.config.ts
    transport.config.ts

  modules/
    <feature>/
      <feature>.module.ts

      domain/
        entities/
        value-objects/
        ports/
        events/

      application/
        services/
        use-cases/
        dto/

      infrastructure/
        adapters/
        repositories/
        mappers/

      presentation/
        http/
          controllers/
          dto/
        grpc/
          controllers/
          proto/
        queues/
          consumers/
          producers/
        cron/
          jobs/

  integrations/
    <external-system>/
      client/
      contracts/
      mappers/

  infrastructure/
    database/
    messaging/
    cache/
    logging/
    metrics/
    tracing/

  shared/
    value-objects/
    types/
    errors/
    constants/

  @types/
```

## Top-Level Folder Responsibilities
- `config/`: Environment and system configuration. Only configuration and wiring helpers live here.
- `modules/`: Feature-based domains. Each module is a vertical slice with its own domain, application, infrastructure, and presentation concerns.
- `integrations/`: External system clients and contracts. All outbound integration code is centralized here.
- `infrastructure/`: Cross-cutting technical adapters used by multiple modules (database, messaging, logging).
- `shared/`: Small, stable primitives used across multiple modules. This must remain minimal and dependency-free.
- `@types/`: Global TypeScript definitions only.

## Naming Conventions
- Modules: `<feature>.module.ts`, folder name matches feature, kebab-case for folders, PascalCase for classes.
- Services: `<feature>.service.ts` for application services; `<feature>.use-case.ts` for single-use-case orchestration.
- Controllers: `<feature>.controller.ts`, transport-specific folder (`presentation/http`, `presentation/grpc`).
- DTOs: `<action>.dto.ts` for input, `<action>.response.dto.ts` for output, per transport folder if transport-specific.
- Config files: `<topic>.config.ts` inside `config/`, no domain coupling.

## Rules
- New features go in `src/modules/<feature>/`.
- Shared code is allowed only if:
  - It is genuinely domain-neutral.
  - It has no dependency on infrastructure or transport.
  - It is used by at least two modules.
- Infrastructure-related code lives only in `src/infrastructure/` or in a module's `infrastructure/` subfolder.
- Explicitly forbidden:
  - `utils/` dumping grounds.
  - `common/` as a catch-all.
  - Cross-module imports that bypass module boundaries.
  - Controllers or transport-specific code outside `presentation/`.
  - Direct infrastructure access from domain layer.

## DO / DON'T
- DO: Place external API clients in `integrations/<external-system>/client/`.
- DON'T: Put external clients inside `modules/<feature>/application/`.

- DO: Keep domain entities in `modules/<feature>/domain/entities/`.
- DON'T: Place domain entities in `shared/` unless truly cross-domain.

- DO: Add HTTP controllers under `modules/<feature>/presentation/http/controllers/`.
- DON'T: Put controllers under `modules/<feature>/application/`.

- DO: Put adapters and mappers in `modules/<feature>/infrastructure/`.
- DON'T: Put adapters in `shared/` or `config/`.

## Guidelines for Growth
- Add new transports by extending `presentation/` for each module, not by mixing logic into existing controllers.
- Prefer duplicating small DTOs per transport over sharing a single DTO across transports.
- Keep module boundaries clean by enforcing imports only from a module's public surface.

## Splitting a Module into a New Microservice
- Ensure the module does not import from other modules except through explicit contracts.
- Move the module as a unit: domain, application, infrastructure, presentation together.
- Replace internal integration with an external contract under `integrations/`.

## Keeping Boundaries Clean as Teams Grow
- Treat each module as a team-owned unit with clear code ownership.
- Prevent `shared/` growth by requiring justification and review for new shared additions.
- Use `integrations/` as the only home for outbound API coupling.

## Decision Checklist
1. Is this code domain-specific and owned by one module?
2. Does it depend on transport or infrastructure?
3. Will it be used by more than one module?
4. Is it an external integration or a module concern?
5. If extracted into a separate service, would its boundaries still hold?

If any answer is unclear, default to placing the code inside the relevant `modules/<feature>/` subfolder and keep it local.
