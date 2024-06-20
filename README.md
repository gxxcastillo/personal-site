# gabrielcastillo.xyz

## Description

This is my personal website, built with [NextJS](https://nextjs.org/) and using [NX](https://nx.dev/) for monorepo management.

[@mdx-js/mdx](https://mdxjs.com/) is used to generate React components from [markdown](https://www.markdownguide.org/) files. All metadata is parsed from [YAML frontmatter](https://mdxjs.com/guides/frontmatter/) using [gray-matter](https://github.com/jonschlinkert/gray-matter).

Raw content files live in the `@gxxc-blob/content` package and all page urls are auto-generated from the file names. Content files are ignored by git and I edit them using [Obsidian](https://obsidian.md/).

## Start the app

### Dependencies

I'm using pnpm as the package manager and nvm for managing node versions.

Install node via nvm
```bash
nvm use
```

Install pnpm
```
corepack enable pnpm
```

Install dependencies
```
pnpm install
```

Start the development server run `nx serve blog`. Open your browser and navigate to http://localhost:4200/.

## Running Tasks

To execute tasks with Nx use the following syntax:
```
nx <target> <project> <...options>
```

You can also run multiple targets:
```
nx run-many -t <target1> <target2>
```

..or add `-p` to filter specific projects
```
nx run-many -t <target1> <target2> -p <proj1> <proj2>
```

## Options

### Environment Variables
```
SHOW_PUBLISHED_ONLY | boolean | default: false
```
When set to true, only published posts will be shown.


