import path from 'path';
import fs from 'fs';

const projectRoot = process.cwd();

function pascalCase(str) {
  return str.replace(/(^\w|-\w)/g, clearAndUpper).replace(/-/g, '');

  function clearAndUpper(txt) {
    return txt.replace(/-/, '').toUpperCase();
  }
}

export default function (plop) {
  plop.setHelper('pascalCase', pascalCase);

  plop.setGenerator('skeleton', {
    description: 'Create an empty feature skeleton (no resources)',
    prompts: [
      {
        type: 'input',
        name: 'feature',
        message: 'Feature name (kebab-case, e.g. "catalog")',
        validate: (v) =>
          /^[a-z0-9]+(-[a-z0-9]+)*$/.test(v) || 'Usa kebab-case (solo minúsculas y guiones)',
      },
    ],
    actions: (answers) => {
      const { feature } = answers;
      const base = path.join(projectRoot, `src/features/${feature}`);

      // if the feature already exists, abort
      if (fs.existsSync(base)) {
        throw new Error(`Feature "${feature}" ya existe en src/features/${feature}`);
      }

      // We only create empty folders with .gitkeep in each one
      const dirs = [
        `${base}/domain/entities`,
        `${base}/domain/dtos`,
        `${base}/domain/actions`,
        `${base}/infrastructure/actions`,
        `${base}/infrastructure/mappers`,
        `${base}/infrastructure/interfaces`,
        `${base}/presentation/composables`,
        `${base}/presentation/components`,
        `${base}/presentation/pages`,
        `${base}/presentation/store`,
      ];

      return [
        // For each folder, we add a .gitkeep
        ...dirs.map((dir) => ({
          type: 'add',
          path: `${dir}/.gitkeep`,
          templateFile: 'plop-templates/empty.gitkeep.hbs',
        })),
        // And we update the aliases
        {
          type: 'modify',
          path: path.join(projectRoot, 'vite.config.ts'),
          skip: () => !fs.existsSync(path.join(projectRoot, 'vite.config.ts')) && 'skip',
          transform: (content) => {
            const aliasLine = `      '@${feature}': fileURLToPath(new URL('./src/features/${feature}', import.meta.url)),`;
            return content.replace(
              /(alias:\s*{)([\s\S]*?)(^\s*}),/m,
              (_, start, inner, close) => `${start}${inner.trimEnd()}\n${aliasLine}\n${close}`,
            );
          },
        },
        {
          type: 'modify',
          path: path.join(projectRoot, 'tsconfig.app.json'),
          skip: () => !fs.existsSync(path.join(projectRoot, 'tsconfig.app.json')) && 'skip',
          transform: (content) => {
            const aliasLine = `      "@${feature}/*": ["./src/features/${feature}/*"],`;
            return content.replace(
              /("paths"\s*:\s*{\s*)([\s\S]*?)(\s*}\s*)/m,
              (_, before, inner, after) => {
                const t = inner.trimEnd();
                const withComma = t.endsWith(',') ? t : `${t},`;
                return `${before}${withComma}\n${aliasLine}\n${after}`;
              },
            );
          },
        },
      ];
    },
  });

  plop.setGenerator('feature', {
    description: 'Generate a new feature (Clean Architecture – TS)',
    prompts: [
      {
        type: 'input',
        name: 'feature',
        message: 'Feature name (kebab-case, e.g. "todo-item")',
        validate: (value) =>
          value && /^[a-z0-9]+(-[a-z0-9]+)*$/.test(value)
            ? true
            : 'Use kebab-case (lowercase, hyphens allowed)',
      },
    ],
    actions: (answers) => {
      if (!answers) {
        throw new Error('Answers are required');
      }

      answers.resource = answers.feature; // resource is used inside templates

      const { feature } = answers;
      const pascal = pascalCase(feature);

      const base = `src/features/${feature}`;

      return [
        // Domain ─ entities
        {
          type: 'add',
          path: path.join(projectRoot, `${base}/domain/entities/${feature}.entity.ts`),
          templateFile: 'plop-templates/domain/entities/entity.hbs',
        },
        // Domain ─ DTOs
        {
          type: 'add',
          path: path.join(projectRoot, `${base}/domain/dtos/${feature}/create-${feature}.dto.ts`),
          templateFile: 'plop-templates/domain/dtos/create-dto.hbs',
        },
        {
          type: 'add',
          path: path.join(projectRoot, `${base}/domain/dtos/${feature}/update-${feature}.dto.ts`),
          templateFile: 'plop-templates/domain/dtos/update-dto.hbs',
        },
        // Domain ─ Actions
        {
          type: 'add',
          path: path.join(
            projectRoot,
            `${base}/domain/actions/${feature}/create-${feature}.action.ts`,
          ),
          templateFile: 'plop-templates/domain/actions/create-action.hbs',
        },
        {
          type: 'add',
          path: path.join(
            projectRoot,
            `${base}/domain/actions/${feature}/list-${feature}s.action.ts`,
          ),
          templateFile: 'plop-templates/domain/actions/list-action.hbs',
        },
        {
          type: 'add',
          path: path.join(
            projectRoot,
            `${base}/domain/actions/${feature}/update-${feature}.action.ts`,
          ),
          templateFile: 'plop-templates/domain/actions/update-action.hbs',
        },
        {
          type: 'add',
          path: path.join(
            projectRoot,
            `${base}/domain/actions/${feature}/get-${feature}.action.ts`,
          ),
          templateFile: 'plop-templates/domain/actions/get-action.hbs',
        },
        {
          type: 'add',
          path: path.join(
            projectRoot,
            `${base}/domain/actions/${feature}/delete-${feature}.action.ts`,
          ),
          templateFile: 'plop-templates/domain/actions/delete-action.hbs',
        },

        // Infrastructure ─ implementations
        {
          type: 'add',
          path: path.join(
            projectRoot,
            `${base}/infrastructure/actions/${feature}/create-${feature}.api.ts`,
          ),
          templateFile: 'plop-templates/infrastructure/actions/create-impl.hbs',
        },
        {
          type: 'add',
          path: path.join(
            projectRoot,
            `${base}/infrastructure/actions/${feature}/update-${feature}.api.ts`,
          ),
          templateFile: 'plop-templates/infrastructure/actions/update-impl.hbs',
        },
        {
          type: 'add',
          path: path.join(
            projectRoot,
            `${base}/infrastructure/actions/${feature}/list-${feature}s.api.ts`,
          ),
          templateFile: 'plop-templates/infrastructure/actions/list-impl.hbs',
        },
        {
          type: 'add',
          path: path.join(
            projectRoot,
            `${base}/infrastructure/actions/${feature}/get-${feature}.api.ts`,
          ),
          templateFile: 'plop-templates/infrastructure/actions/get-impl.hbs',
        },
        {
          type: 'add',
          path: path.join(
            projectRoot,
            `${base}/infrastructure/actions/${feature}/delete-${feature}.api.ts`,
          ),
          templateFile: 'plop-templates/infrastructure/actions/delete-impl.hbs',
        },
        {
          type: 'add',
          path: path.join(projectRoot, `${base}/infrastructure/actions/${feature}/index.ts`),
          templateFile: 'plop-templates/infrastructure/actions/index.hbs',
        },

        // Infrastructure ─ mappers
        {
          type: 'add',
          path: path.join(projectRoot, `${base}/infrastructure/mappers/${feature}.mapper.ts`),
          templateFile: 'plop-templates/infrastructure/mappers/mapper.hbs',
        },

        // Infrastructure ─ interfaces
        {
          type: 'add',
          path: path.join(
            projectRoot,
            `${base}/infrastructure/interfaces/${feature}/create-response.ts`,
          ),
          templateFile: 'plop-templates/infrastructure/interfaces/create-response.hbs',
        },
        {
          type: 'add',
          path: path.join(
            projectRoot,
            `${base}/infrastructure/interfaces/${feature}/get-response.ts`,
          ),
          templateFile: 'plop-templates/infrastructure/interfaces/get-response.hbs',
        },
        {
          type: 'add',
          path: path.join(
            projectRoot,
            `${base}/infrastructure/interfaces/${feature}/update-response.ts`,
          ),
          templateFile: 'plop-templates/infrastructure/interfaces/update-response.hbs',
        },

        // Presentation ─ composable
        {
          type: 'add',
          path: path.join(
            projectRoot,
            `${base}/presentation/composables/${feature}/use${pascal}.ts`,
          ),
          templateFile: 'plop-templates/presentation/composables/use-composable.hbs',
        },
        // Presentation ─ component
        {
          type: 'add',
          path: path.join(
            projectRoot,
            `${base}/presentation/components/${feature}/${pascal}Component.vue`,
          ),
          templateFile: 'plop-templates/presentation/components/component.hbs',
        },
        // Presentation ─ page
        {
          type: 'add',
          path: path.join(projectRoot, `${base}/presentation/pages/${feature}/${pascal}Page.vue`),
          templateFile: 'plop-templates/presentation/pages/page.hbs',
        },
        // Presentation ─ store
        {
          type: 'add',
          path: path.join(projectRoot, `${base}/presentation/store/${feature}/${feature}.store.ts`),
          templateFile: 'plop-templates/presentation/store/store.hbs',
        },

        // Update vite.config.ts
        {
          type: 'modify',
          path: path.join(projectRoot, 'vite.config.ts'),
          transform: (content, answers) => {
            const feature = answers.feature;
            const aliasLine = `      '@${feature}': fileURLToPath(new URL('./src/features/${feature}', import.meta.url)),`;

            // We search the alias: { ... } block
            return content.replace(
              /(alias:\s*{)([\s\S]*?)(^\s*}),/m,
              (_, start, inner, closing) => `${start}${inner.trimEnd()}\n${aliasLine}\n${closing}`,
            );
          },
        },

        // Update tsconfig.app.json
        {
          type: 'modify',
          path: path.join(projectRoot, 'tsconfig.app.json'),
          transform: (content, answers) => {
            const feature = answers.feature;
            const aliasLine = `      "@${feature}/*": ["./src/features/${feature}/*"],`;

            return content.replace(
              /("paths"\s*:\s*{\s*)([\s\S]*?)(\s*}\s*)/m,
              (_, before, inner, after) => {
                // 1) We trim the spaces at the end
                const trimmed = inner.trimEnd();
                // 2) If it doesn't end with a comma, we add it
                const withComma = trimmed.endsWith(',') ? trimmed : `${trimmed},`;
                // 3) We reconstruct everything with the new line
                return `${before}${withComma}\n${aliasLine}\n${after}`;
              },
            );
          },
        },
      ];
    },
  });

  plop.setGenerator('resource', {
    description: 'Add a resource to an existing feature',
    prompts: [
      {
        type: 'list',
        name: 'feature',
        message: 'Select the destination feature',
        choices: () => {
          const dir = 'src/features';
          if (!fs.existsSync(dir)) return [];
          return fs.readdirSync(dir).filter((f) => fs.statSync(path.join(dir, f)).isDirectory());
        },
      },
      {
        type: 'input',
        name: 'resource',
        message: 'Resource name (kebab-case)',
        validate: (v) =>
          /^[a-z0-9]+(-[a-z0-9]+)*$/.test(v) || 'Use kebab-case (lowercase, hyphens allowed)',
      },
    ],
    actions: (answers) => {
      const { feature, resource } = answers;
      const pascal = pascalCase(resource);
      const base = `src/features/${feature}`;

      // If for some reason the feature does not exist, abort
      if (!fs.existsSync(base)) {
        throw new Error(`The feature "${feature}" does not exist.`);
      }

      return [
        // Domain
        {
          type: 'add',
          path: path.join(projectRoot, `${base}/domain/entities/${resource}.entity.ts`),
          templateFile: 'plop-templates/domain/entities/entity.hbs',
        },
        {
          type: 'add',
          path: path.join(projectRoot, `${base}/domain/dtos/${resource}/create-${resource}.dto.ts`),
          templateFile: 'plop-templates/domain/dtos/create-dto.hbs',
        },
        {
          type: 'add',
          path: path.join(projectRoot, `${base}/domain/dtos/${resource}/update-${resource}.dto.ts`),
          templateFile: 'plop-templates/domain/dtos/update-dto.hbs',
        },
        {
          type: 'add',
          path: path.join(
            projectRoot,
            `${base}/domain/actions/${resource}/create-${resource}.action.ts`,
          ),
          templateFile: 'plop-templates/domain/actions/create-action.hbs',
        },
        {
          type: 'add',
          path: path.join(
            projectRoot,
            `${base}/domain/actions/${resource}/list-${resource}s.action.ts`,
          ),
          templateFile: 'plop-templates/domain/actions/list-action.hbs',
        },
        {
          type: 'add',
          path: path.join(
            projectRoot,
            `${base}/domain/actions/${resource}/get-${resource}.action.ts`,
          ),
          templateFile: 'plop-templates/domain/actions/get-action.hbs',
        },
        {
          type: 'add',
          path: path.join(
            projectRoot,
            `${base}/domain/actions/${resource}/update-${resource}.action.ts`,
          ),
          templateFile: 'plop-templates/domain/actions/update-action.hbs',
        },
        {
          type: 'add',
          path: path.join(
            projectRoot,
            `${base}/domain/actions/${resource}/delete-${resource}.action.ts`,
          ),
          templateFile: 'plop-templates/domain/actions/delete-action.hbs',
        },

        // Infrastructure
        {
          type: 'add',
          path: path.join(
            projectRoot,
            `${base}/infrastructure/actions/${resource}/create-${resource}.impl.ts`,
          ),
          templateFile: 'plop-templates/infrastructure/actions/create-impl.hbs',
        },
        {
          type: 'add',
          path: path.join(
            projectRoot,
            `${base}/infrastructure/actions/${resource}/list-${resource}s.impl.ts`,
          ),
          templateFile: 'plop-templates/infrastructure/actions/list-impl.hbs',
        },
        {
          type: 'add',
          path: path.join(
            projectRoot,
            `${base}/infrastructure/actions/${resource}/get-${resource}.impl.ts`,
          ),
          templateFile: 'plop-templates/infrastructure/actions/get-impl.hbs',
        },
        {
          type: 'add',
          path: path.join(
            projectRoot,
            `${base}/infrastructure/actions/${resource}/update-${resource}.impl.ts`,
          ),
          templateFile: 'plop-templates/infrastructure/actions/update-impl.hbs',
        },
        {
          type: 'add',
          path: path.join(
            projectRoot,
            `${base}/infrastructure/actions/${resource}/delete-${resource}.impl.ts`,
          ),
          templateFile: 'plop-templates/infrastructure/actions/delete-impl.hbs',
        },
        {
          type: 'add',
          path: path.join(projectRoot, `${base}/infrastructure/actions/${resource}/index.ts`),
          templateFile: 'plop-templates/infrastructure/actions/index.hbs',
        },

        // Infrastructure ─ interfaces
        {
          type: 'add',
          path: path.join(
            projectRoot,
            `${base}/infrastructure/interfaces/${resource}/create-response.ts`,
          ),
          templateFile: 'plop-templates/infrastructure/interfaces/create-response.hbs',
        },
        {
          type: 'add',
          path: path.join(
            projectRoot,
            `${base}/infrastructure/interfaces/${resource}/get-response.ts`,
          ),
          templateFile: 'plop-templates/infrastructure/interfaces/get-response.hbs',
        },
        {
          type: 'add',
          path: path.join(
            projectRoot,
            `${base}/infrastructure/interfaces/${resource}/update-response.ts`,
          ),
          templateFile: 'plop-templates/infrastructure/interfaces/update-response.hbs',
        },

        // Infrastructure ─ mappers
        {
          type: 'add',
          path: path.join(projectRoot, `${base}/infrastructure/mappers/${resource}.mapper.ts`),
          templateFile: 'plop-templates/infrastructure/mappers/mapper.hbs',
        },

        // Presentation
        {
          type: 'add',
          path: path.join(
            projectRoot,
            `${base}/presentation/composables/${resource}/use${pascal}.ts`,
          ),
          templateFile: 'plop-templates/presentation/composables/use-composable.hbs',
        },
        {
          type: 'add',
          path: path.join(
            projectRoot,
            `${base}/presentation/components/${resource}/${pascal}Component.vue`,
          ),
          templateFile: 'plop-templates/presentation/components/component.hbs',
        },
        {
          type: 'add',
          path: path.join(projectRoot, `${base}/presentation/pages/${resource}/${pascal}Page.vue`),
          templateFile: 'plop-templates/presentation/pages/page.hbs',
        },
        {
          type: 'add',
          path: path.join(
            projectRoot,
            `${base}/presentation/store/${resource}/${resource}.store.ts`,
          ),
          templateFile: 'plop-templates/presentation/store/store.hbs',
        },
      ];
    },
  });
}
