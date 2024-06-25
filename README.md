# gabrielcastillo.xyz

## Description

This is my personal website, built with [NextJS](https://nextjs.org/) and using [NX](https://nx.dev/) for monorepo management.

[@mdx-js/mdx](https://mdxjs.com/) is used to generate React components from [markdown](https://www.markdownguide.org/) files. All metadata is parsed from [YAML frontmatter](https://mdxjs.com/guides/frontmatter/) using [gray-matter](https://github.com/jonschlinkert/gray-matter).

Raw content files are ignored by git and live in the `@gxxc-blob/content` package. I edit them using [Obsidian](https://obsidian.md/).

## Adding content

There are two types of content: posts and pages and both are generated from markdown files that use frontmatter to define metadata.

To add a new post or page, create a new markdown file in the `@gxxc-blob/content` package. The file name will be used as the url slug and the frontmatter will be used to generate the post metadata.

Note, while you could edit your files directly in your IDE, I recommend using [Obsidian](https://obsidian.md/) for a better editing experience.

### Publishing content

To mark content as available to the public, set the `published` field in the frontmatter to `true`. This will make the post visible in the UI.  The `date` field is used to restrict posts from being accidentally published too early.

Once you've updated your content, create a new build and deploy the site with the latest changes.

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

You can execute tasks with Nx use the following syntax:
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


