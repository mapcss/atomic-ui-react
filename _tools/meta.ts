import { BuildOptions } from "https://deno.land/x/dnt@0.23.0/mod.ts";

export const makeOptions = (version: string): BuildOptions => ({
  test: false,
  shims: {
    deno: false,
  },
  typeCheck: true,
  entryPoints: ["./mod.ts"],
  outDir: "./npm",
  package: {
    name: "@atomic-ui/react",
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

export function cleanVersion(version: string): string {
  return version.replace(/^v(.+)$/, "$1");
}
