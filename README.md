# 🚀 Deployment

For deployment we use CloudFront and S3.
You can find the CloudFront distribution ID and S3 bucket in the AWS console.
Also you need a profile in your AWS credentials file to deploy the frontend with the right permissions.

## 1. Set the variables using `.env.template` to create `.env.<environment>` file.

- This variables are used to run the frontend app in the environment. Are used inside the app using `import.meta.env`

```bash
cp .env.template .env.staging
```

```bash
cp .env.template .env.development
```

```bash
cp .env.template .env.production
```

## 2. Create `.deploy.<environment>.env` file from `.deploy.template.env` and set the variables

- This variables are used to deploy the frontend to the environment. They are used in the deploy script to build the frontend and deploy it to the environment.

```bash
cp .deploy.template.env .deploy.staging.env
```

```bash
cp .deploy.template.env .deploy.development.env
```

```bash
cp .deploy.template.env .deploy.production.env
```

## 3. Use node version > 20

recommended:

```bash
nvm use 20.15.0
```

## 4. Deploy command

```bash
./scripts/deploy/deploy.sh staging
```

## Development

```bash
./scripts/deploy/deploy.sh development
```

## Production

```bash
./scripts/deploy/deploy.sh production
```

## ⚙️ Scaffolding with Plop.js

This project uses [Plop.js](https://plopjs.com/) to quickly scaffold new **features** and **resources** following our Clean Architecture.

### 📁 Structure

- **Plopfile**: Located at `scripts/generators/plopfile.js`
- **Templates**: Located in `scripts/generators/plop-templates/`
- Output files are placed in `src/features/<feature>/...`

---

### 🚀 Available Scripts

| Command                   | Description                                                                                                    |
| ------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `npm run create:feature`  | Create a full **feature module** with domain, infrastructure, and presentation layers.                         |
| `npm run create:resource` | Add a new **resource** (entity, DTOs, actions, mappers, store, etc.) to an existing feature.                   |
| `npm run create:skeleton` | Generate a **feature skeleton** with only folders (and `.gitkeep` files) to start organizing modular features. |

---

### 🧱 Feature vs Resource

- A **feature** is a top-level module (e.g., `auth`, `search`, `catalog`) that groups one or more related resources.
- A **resource** is a unit inside a feature (e.g., `product`, `user`, `order`) that represents a domain entity and related logic.

_Note: the difference between a feature and a resource is that a feature is a module that groups one or more resources. But depends on the context, a resource can be a feature too._

---

### ✨ 1. Create a New Feature

```bash
npm run create:feature
```

- Prompts for a `feature` name in kebab-case (e.g., `todo-item`)
- Generates folders and files under `src/features/<feature>/`
- Adds the proper aliases in:
  - `vite.config.ts` → for `@<feature>`
  - `tsconfig.app.json` → for `@<feature>/*`

Creates:

```
src/features/<feature>/
├─ domain/
│  ├─ entities/
│  ├─ dtos/<feature>/
│  └─ actions/<feature>/
├─ infrastructure/
│  ├─ actions/<feature>/
│  ├─ interfaces/<feature>/
│  └─ mappers/
└─ presentation/
   ├─ composables/<feature>/
   ├─ components/<feature>/
   ├─ pages/<feature>/
   └─ store/<feature>/
```

---

### 🧩 2. Add a Resource to an Existing Feature

```bash
npm run create:resource
```

- Prompts for a `feature` and a `resource` name.
- Adds a new entity and all related files (`DTOs`, `actions`, `mapper`, `store`, `page`, `composable`, `component`) scoped inside the selected feature.
- Resource files are organized under subfolders like `actions/<resource>/`, `components/<resource>/`, etc., to keep things modular.

---

### 🧼 3. Create an Empty Feature Skeleton

```bash
npm run create:skeleton
```

- Only creates the folder structure and `.gitkeep` placeholders for a new feature.
- Useful for creating non-entity-based features like `catalog`, `search`, `settings`.

---

### 🧠 Extending the Generators

All scaffolding logic is defined in `tools/generators/plopfile.js`. You can customize:

- Naming conventions
- Folder structure
- Aliases handling (e.g., modifying `vite.config.ts`, `tsconfig.app.json`)
- Add support for tests, services, etc.

---

### 💡 Tips

- All names should be written in **kebab-case** (`e.g., field-sample`, `todo-reminder`)
- The generators automatically use `PascalCase` when needed in file content (class names, interfaces, etc.)
- Alias generation ensures imports like `@todo/...` work seamlessly across the app

---
