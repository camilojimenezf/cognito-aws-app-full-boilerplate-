function pascalCase(str) {
  return str.replace(/(^\w|-\w)/g, clearAndUpper).replace(/-/g, '');

  function clearAndUpper(txt) {
    return txt.replace(/-/, '').toUpperCase();
  }
}

export default function (plop) {
  plop.setHelper('pascalCase', pascalCase);

  plop.setGenerator('feature-module', {
    description: 'Generate a new feature module (Clean Architecture – TS)',
    prompts: [
      {
        type: 'input',
        name: 'name',
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

      const { name } = answers;
      const pascal = pascalCase(name);

      const base = `src/modules/${name}`;

      return [
        // Domain ─ entities
        {
          type: 'add',
          path: `${base}/domain/entities/${name}.entity.ts`,
          templateFile: 'plop-templates/domain/entities/entity.hbs',
        },
        // Domain ─ DTOs
        {
          type: 'add',
          path: `${base}/domain/dtos/create-${name}.dto.ts`,
          templateFile: 'plop-templates/domain/dtos/create-dto.hbs',
        },
        {
          type: 'add',
          path: `${base}/domain/dtos/update-${name}.dto.ts`,
          templateFile: 'plop-templates/domain/dtos/update-dto.hbs',
        },
        // Domain ─ Actions
        {
          type: 'add',
          path: `${base}/domain/actions/create-${name}.action.ts`,
          templateFile: 'plop-templates/domain/actions/create-action.hbs',
        },
        {
          type: 'add',
          path: `${base}/domain/actions/list-${name}s.action.ts`,
          templateFile: 'plop-templates/domain/actions/list-action.hbs',
        },
        {
          type: 'add',
          path: `${base}/domain/actions/update-${name}.action.ts`,
          templateFile: 'plop-templates/domain/actions/update-action.hbs',
        },
        {
          type: 'add',
          path: `${base}/domain/actions/get-${name}.action.ts`,
          templateFile: 'plop-templates/domain/actions/get-action.hbs',
        },
        {
          type: 'add',
          path: `${base}/domain/actions/delete-${name}.action.ts`,
          templateFile: 'plop-templates/domain/actions/delete-action.hbs',
        },

        // Infrastructure ─ implementations
        {
          type: 'add',
          path: `${base}/infrastructure/actions/create-${name}.api.ts`,
          templateFile: 'plop-templates/infrastructure/actions/create-impl.hbs',
        },
        {
          type: 'add',
          path: `${base}/infrastructure/actions/update-${name}.api.ts`,
          templateFile: 'plop-templates/infrastructure/actions/update-impl.hbs',
        },
        {
          type: 'add',
          path: `${base}/infrastructure/actions/list-${name}s.api.ts`,
          templateFile: 'plop-templates/infrastructure/actions/list-impl.hbs',
        },
        {
          type: 'add',
          path: `${base}/infrastructure/actions/get-${name}.api.ts`,
          templateFile: 'plop-templates/infrastructure/actions/get-impl.hbs',
        },
        {
          type: 'add',
          path: `${base}/infrastructure/actions/delete-${name}.api.ts`,
          templateFile: 'plop-templates/infrastructure/actions/delete-impl.hbs',
        },
        {
          type: 'add',
          path: `${base}/infrastructure/actions/index.ts`,
          templateFile: 'plop-templates/infrastructure/actions/index.hbs',
        },

        // Infrastructure ─ mappers
        {
          type: 'add',
          path: `${base}/infrastructure/mappers/${name}.mapper.ts`,
          templateFile: 'plop-templates/infrastructure/mappers/mapper.hbs',
        },

        // Infrastructure ─ interfaces
        {
          type: 'add',
          path: `${base}/infrastructure/interfaces/create-response.ts`,
          templateFile: 'plop-templates/infrastructure/interfaces/create-response.hbs',
        },
        {
          type: 'add',
          path: `${base}/infrastructure/interfaces/get-response.ts`,
          templateFile: 'plop-templates/infrastructure/interfaces/get-response.hbs',
        },
        {
          type: 'add',
          path: `${base}/infrastructure/interfaces/update-response.ts`,
          templateFile: 'plop-templates/infrastructure/interfaces/update-response.hbs',
        },

        // Presentation ─ composable
        {
          type: 'add',
          path: `${base}/presentation/composables/use${pascal}.ts`,
          templateFile: 'plop-templates/presentation/composables/use-composable.hbs',
        },
        // Presentation ─ component
        {
          type: 'add',
          path: `${base}/presentation/components/${pascal}Component.vue`,
          templateFile: 'plop-templates/presentation/components/component.hbs',
        },
        // Presentation ─ page
        {
          type: 'add',
          path: `${base}/presentation/pages/${pascal}Page.vue`,
          templateFile: 'plop-templates/presentation/pages/page.hbs',
        },
        // Presentation ─ store
        {
          type: 'add',
          path: `${base}/presentation/store/${name}.store.ts`,
          templateFile: 'plop-templates/presentation/store/store.hbs',
        },

        // Update vite.config.ts
        {
          type: 'modify',
          path: 'vite.config.ts',
          transform: (content, answers) => {
            const name = answers.name;
            const aliasLine = `      '@${name}': fileURLToPath(new URL('./src/modules/${name}', import.meta.url)),`;

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
          path: 'tsconfig.app.json',
          transform: (content, answers) => {
            const name = answers.name;
            const aliasLine = `      "@${name}/*": ["./src/modules/${name}/*"],`;

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
}
