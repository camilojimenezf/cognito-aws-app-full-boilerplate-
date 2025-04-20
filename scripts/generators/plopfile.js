function pascalCase(str) {
  return str.replace(/(^\w|-\w)/g, clearAndUpper).replace(/-/g, '');

  function clearAndUpper(txt) {
    return txt.replace(/-/, '').toUpperCase();
  }
}

export default function (plop) {
  plop.setHelper('pascalCase', pascalCase);

  plop.setGenerator('feature', {
    description: 'Generate a new feature (Clean Architecture – TS)',
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

      const base = `src/features/${name}`;

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
          path: `${base}/domain/dtos/${name}/create-${name}.dto.ts`,
          templateFile: 'plop-templates/domain/dtos/create-dto.hbs',
        },
        {
          type: 'add',
          path: `${base}/domain/dtos/${name}/update-${name}.dto.ts`,
          templateFile: 'plop-templates/domain/dtos/update-dto.hbs',
        },
        // Domain ─ Actions
        {
          type: 'add',
          path: `${base}/domain/actions/${name}/create-${name}.action.ts`,
          templateFile: 'plop-templates/domain/actions/create-action.hbs',
        },
        {
          type: 'add',
          path: `${base}/domain/actions/${name}/list-${name}s.action.ts`,
          templateFile: 'plop-templates/domain/actions/list-action.hbs',
        },
        {
          type: 'add',
          path: `${base}/domain/actions/${name}/update-${name}.action.ts`,
          templateFile: 'plop-templates/domain/actions/update-action.hbs',
        },
        {
          type: 'add',
          path: `${base}/domain/actions/${name}/get-${name}.action.ts`,
          templateFile: 'plop-templates/domain/actions/get-action.hbs',
        },
        {
          type: 'add',
          path: `${base}/domain/actions/${name}/delete-${name}.action.ts`,
          templateFile: 'plop-templates/domain/actions/delete-action.hbs',
        },

        // Infrastructure ─ implementations
        {
          type: 'add',
          path: `${base}/infrastructure/actions/${name}/create-${name}.api.ts`,
          templateFile: 'plop-templates/infrastructure/actions/create-impl.hbs',
        },
        {
          type: 'add',
          path: `${base}/infrastructure/actions/${name}/update-${name}.api.ts`,
          templateFile: 'plop-templates/infrastructure/actions/update-impl.hbs',
        },
        {
          type: 'add',
          path: `${base}/infrastructure/actions/${name}/list-${name}s.api.ts`,
          templateFile: 'plop-templates/infrastructure/actions/list-impl.hbs',
        },
        {
          type: 'add',
          path: `${base}/infrastructure/actions/${name}/get-${name}.api.ts`,
          templateFile: 'plop-templates/infrastructure/actions/get-impl.hbs',
        },
        {
          type: 'add',
          path: `${base}/infrastructure/actions/${name}/delete-${name}.api.ts`,
          templateFile: 'plop-templates/infrastructure/actions/delete-impl.hbs',
        },
        {
          type: 'add',
          path: `${base}/infrastructure/actions/${name}/index.ts`,
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
          path: `${base}/infrastructure/interfaces/${name}/create-response.ts`,
          templateFile: 'plop-templates/infrastructure/interfaces/create-response.hbs',
        },
        {
          type: 'add',
          path: `${base}/infrastructure/interfaces/${name}/get-response.ts`,
          templateFile: 'plop-templates/infrastructure/interfaces/get-response.hbs',
        },
        {
          type: 'add',
          path: `${base}/infrastructure/interfaces/${name}/update-response.ts`,
          templateFile: 'plop-templates/infrastructure/interfaces/update-response.hbs',
        },

        // Presentation ─ composable
        {
          type: 'add',
          path: `${base}/presentation/composables/${name}/use${pascal}.ts`,
          templateFile: 'plop-templates/presentation/composables/use-composable.hbs',
        },
        // Presentation ─ component
        {
          type: 'add',
          path: `${base}/presentation/components/${name}/${pascal}Component.vue`,
          templateFile: 'plop-templates/presentation/components/component.hbs',
        },
        // Presentation ─ page
        {
          type: 'add',
          path: `${base}/presentation/pages/${name}/${pascal}Page.vue`,
          templateFile: 'plop-templates/presentation/pages/page.hbs',
        },
        // Presentation ─ store
        {
          type: 'add',
          path: `${base}/presentation/store/${name}/${name}.store.ts`,
          templateFile: 'plop-templates/presentation/store/store.hbs',
        },

        // Update vite.config.ts
        {
          type: 'modify',
          path: 'vite.config.ts',
          transform: (content, answers) => {
            const name = answers.name;
            const aliasLine = `      '@${name}': fileURLToPath(new URL('./src/features/${name}', import.meta.url)),`;

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
            const aliasLine = `      "@${name}/*": ["./src/features/${name}/*"],`;

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
        name: 'name',
        message: 'Resource name (kebab-case)',
        validate: (v) =>
          /^[a-z0-9]+(-[a-z0-9]+)*$/.test(v) || 'Use kebab-case (lowercase, hyphens allowed)',
      },
    ],
    actions: (answers) => {
      const { feature, name } = answers;
      const pascal = pascalCase(name);
      const base = `src/features/${feature}`;

      // If for some reason the feature does not exist, abort
      if (!fs.existsSync(base)) {
        throw new Error(`The feature "${feature}" does not exist.`);
      }

      return [
        // Domain
        {
          type: 'add',
          path: `${base}/domain/entities/${name}.entity.ts`,
          templateFile: 'plop-templates/domain/entity.hbs',
        },
        {
          type: 'add',
          path: `${base}/domain/dtos/${name}/create-${name}.dto.ts`,
          templateFile: 'plop-templates/domain/create-dto.hbs',
        },
        {
          type: 'add',
          path: `${base}/domain/dtos/${name}/update-${name}.dto.ts`,
          templateFile: 'plop-templates/domain/update-dto.hbs',
        },
        {
          type: 'add',
          path: `${base}/domain/actions/${name}/create-${name}.action.ts`,
          templateFile: 'plop-templates/domain/actions/create-action.hbs',
        },
        {
          type: 'add',
          path: `${base}/domain/actions/${name}/get-${name}s.action.ts`,
          templateFile: 'plop-templates/domain/actions/get-action.hbs',
        },
        {
          type: 'add',
          path: `${base}/domain/actions/${name}/update-${name}.action.ts`,
          templateFile: 'plop-templates/domain/actions/update-action.hbs',
        },
        {
          type: 'add',
          path: `${base}/domain/actions/${name}/delete-${name}.action.ts`,
          templateFile: 'plop-templates/domain/actions/delete-action.hbs',
        },
        {
          type: 'add',
          path: `${base}/domain/actions/${name}/index.ts`,
          templateFile: 'plop-templates/domain/actions/index.hbs',
        },

        // Infrastructure
        {
          type: 'add',
          path: `${base}/infrastructure/actions/${name}/create-${name}.impl.ts`,
          templateFile: 'plop-templates/infrastructure/actions/create-impl.hbs',
        },
        {
          type: 'add',
          path: `${base}/infrastructure/actions/${name}/get-${name}s.impl.ts`,
          templateFile: 'plop-templates/infrastructure/actions/get-impl.hbs',
        },
        {
          type: 'add',
          path: `${base}/infrastructure/actions/${name}/update-${name}.impl.ts`,
          templateFile: 'plop-templates/infrastructure/actions/update-impl.hbs',
        },
        {
          type: 'add',
          path: `${base}/infrastructure/actions/${name}/delete-${name}.impl.ts`,
          templateFile: 'plop-templates/infrastructure/actions/delete-impl.hbs',
        },
        {
          type: 'add',
          path: `${base}/infrastructure/actions/${name}/index.ts`,
          templateFile: 'plop-templates/infrastructure/actions/index.hbs',
        },
        {
          type: 'add',
          path: `${base}/infrastructure/mappers/${name}.mapper.ts`,
          templateFile: 'plop-templates/infrastructure/mapper.hbs',
        },

        // Presentation
        {
          type: 'add',
          path: `${base}/presentation/composables/${name}/use-${name}.ts`,
          templateFile: 'plop-templates/presentation/composables/use-composable.hbs',
        },
        {
          type: 'add',
          path: `${base}/presentation/components/${name}/${pascal}Component.vue`,
          templateFile: 'plop-templates/presentation/components/component.hbs',
        },
        {
          type: 'add',
          path: `${base}/presentation/pages/${name}/${pascal}Page.vue`,
          templateFile: 'plop-templates/presentation/pages/page.hbs',
        },
        {
          type: 'add',
          path: `${base}/presentation/store/${name}/${name}.store.ts`,
          templateFile: 'plop-templates/presentation/store/store.hbs',
        },
      ];
    },
  });
}
