import {
  BuildOptions,
  EntryPoint,
} from "https://deno.land/x/dnt@0.23.0/mod.ts";
import {
  dirname,
  fromFileUrl,
  join,
} from "https://deno.land/std@0.135.0/path/mod.ts";

export const makeOptions = (version: string): BuildOptions => ({
  test: false,
  shims: {
    deno: false,
  },
  typeCheck: true,
  entryPoints: ["./mod.ts", ...makeEntryPoint()],
  outDir: "./npm",
  package: {
    name: "@atomic_ui/react",
    version,
    description:
      "Tiny, Unstyled, Accessible React components/hooks, designed to integrate with Atomic CSS.",
    keywords: [
      "react",
      "component",
      "hooks",
      "mapcss",
      "tailwindcss",
      "ui",
      "atomic-css",
      "headless-ui",
    ],
    license: "MIT",
    homepage: "https://github.com/mapcss/atomic-ui-react",
    repository: {
      type: "git",
      url: "git+https://github.com/mapcss/atomic-ui-react.git",
    },
    bugs: {
      url: "https://github.com/mapcss/atomic-ui-react/issues",
    },
    sideEffects: false,
    type: "module",
    peerDependency: {
      "react": "^17.0.2",
    },
    devDependencies: {
      "@types/react": "^17.0.2",
    },
    publishConfig: {
      access: "public",
    },
  },
  packageManager: "pnpm",
});

const url = fromFileUrl(import.meta.url);
const PROJECT_ROOT = join(dirname(url), "..");

export const packages: { name: string; entrypoint: string; rootDir: string }[] =
  [{
    name: "tab",
    entrypoint: join(PROJECT_ROOT, "tab", "mod.ts"),
    rootDir: join(PROJECT_ROOT, "tab"),
  }, {
    name: "switch",
    entrypoint: join(PROJECT_ROOT, "switch", "mod.ts"),
    rootDir: join(PROJECT_ROOT, "switch"),
  }, {
    name: "transition",
    entrypoint: join(PROJECT_ROOT, "transition", "mod.ts"),
    rootDir: join(PROJECT_ROOT, "transition"),
  }, {
    name: "ssr",
    entrypoint: join(PROJECT_ROOT, "ssr", "mod.ts"),
    rootDir: join(PROJECT_ROOT, "ssr"),
  }, {
    name: "tooltip",
    entrypoint: join(PROJECT_ROOT, "tooltip", "mod.ts"),
    rootDir: join(PROJECT_ROOT, "tooltip"),
  }, {
    name: "disclosure",
    entrypoint: join(PROJECT_ROOT, "disclosure", "mod.ts"),
    rootDir: join(PROJECT_ROOT, "disclosure"),
  }, {
    name: "breadcrumb",
    entrypoint: join(PROJECT_ROOT, "breadcrumb", "mod.ts"),
    rootDir: join(PROJECT_ROOT, "breadcrumb"),
  }, {
    name: "alert",
    entrypoint: join(PROJECT_ROOT, "alert", "mod.ts"),
    rootDir: join(PROJECT_ROOT, "alert"),
  }, {
    name: "hooks",
    entrypoint: join(PROJECT_ROOT, "hooks", "mod.ts"),
    rootDir: join(PROJECT_ROOT, "hooks"),
  }];

function makeEntryPoint(): EntryPoint[] {
  return packages.map(({ name, entrypoint }) => {
    return {
      name: `./${name}`,
      path: entrypoint,
    };
  });
}

export function cleanVersion(version: string): string {
  return version.replace(/^v(.+)$/, "$1");
}
