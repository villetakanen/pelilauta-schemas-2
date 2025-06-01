import { resolve } from "node:path";
// vite.config.ts
/// <reference types="vitest" />
import { defineConfig } from "vite";
import dts from "vite-plugin-dts"; // For generating .d.ts files during build

export default defineConfig({
  // Build configuration for your library
  build: {
    // Specifies that we are building a library
    lib: {
      // The entry point of your library. Vite will start bundling from here.
      // resolve(__dirname, 'src/index.ts') creates an absolute path to your src/index.ts.
      entry: resolve(__dirname, "src/index.ts"),

      // The name for the UMD (Universal Module Definition) build.
      // This is used when your library is included via a <script> tag in a browser
      // without a module loader. It will be available as `window.PelilautaSchemas`.
      name: "PelilautaSchemas", // You can change this to your preferred UMD name

      // Specifies the output filename for the generated bundles.
      // The `format` argument will be 'es' (ES Module) or 'cjs' (CommonJS).
      // This will result in files like `index.js` (for ESM) and `index.cjs` (for CJS).
      fileName: (format) => `index.${format === "es" ? "js" : format}`,

      // Specifies the module formats to output.
      // 'es' for modern ESM support (e.g., import ... from 'your-package').
      // 'cjs' for CommonJS support (e.g., const ... = require('your-package');).
      formats: ["es", "cjs"],
    },
    // Rollup specific options (Vite uses Rollup under the hood for library builds)
    rollupOptions: {
      // Defines external dependencies that should NOT be bundled into your library.
      // 'zod' is a peer dependency; the consuming project will provide it.
      external: ["zod"],

      output: {
        // Provides global variable names for externalized dependencies in the UMD build.
        // When using the UMD bundle in a browser via <script> tag, and 'zod' is also
        // loaded via a <script> tag, this tells Rollup that 'zod' maps to the global 'Zod' variable.
        globals: {
          zod: "Zod",
        },
      },
    },
    // Generates sourcemaps for the built files.
    // This helps with debugging in projects that consume your library.
    sourcemap: true,

    // Clears the output directory (default 'dist') before each build.
    emptyOutDir: true,
  },

  // Vite plugins
  plugins: [
    // `vite-plugin-dts` generates TypeScript declaration files (.d.ts) for your library.
    // This is crucial for TypeScript users of your package.
    dts({
      // Creates a single .d.ts entry file that aggregates types from your library.
      insertTypesEntry: true,
      // Optionally, specify the tsconfig file to use for declaration generation.
      // tsConfigFilePath: './tsconfig.json' // Often not needed if tsconfig.json is standard
    }),
  ],

  // Vitest specific configuration
  // This block configures how Vitest runs your tests.
  test: {
    // Enables global test APIs (describe, it, expect, etc.) without needing to import them in each test file.
    globals: true,

    // Specifies the environment for running tests.
    // 'node' is suitable for a library like this that doesn't interact with browser DOM.
    // Other options include 'jsdom' (simulates browser DOM), 'happy-dom'.
    environment: "node",

    // Configures code coverage reporting.
    coverage: {
      // Specifies the coverage provider. 'v8' uses V8's built-in coverage (faster).
      // 'istanbul' is another option, sometimes more feature-rich but slower.
      provider: "v8",

      // Defines the reporters for coverage output.
      // 'text': Shows a summary in the console.
      // 'json': For machine-readable output.
      // 'html': Generates an HTML report you can view in a browser.
      // 'lcov': Format often used by CI services like Codecov or Coveralls.
      reporter: ["text", "json", "html", "lcov"],

      // Directory where coverage reports will be generated.
      reportsDirectory: "./coverage",

      // If true, coverage will be calculated for all files specified in `include`,
      // even if they are not directly hit by any tests. This helps identify untested files.
      all: true,

      // Glob patterns for files to include in coverage analysis.
      include: ["src/**/*.ts"],

      // Glob patterns for files to exclude from coverage analysis.
      exclude: [
        "src/index.ts", // Entry files often just re-export and might not have testable logic.
        "src/vite-env.d.ts", // Vite specific type file.
        "**/*.test.ts", // Test files themselves.
        "**/types.ts", // If you have dedicated type definition files with no runtime logic.
        "dist/**", // Build output directory.
        // Add any other files or patterns you want to exclude.
      ],
    },

    // Optional: You can specify setup files that run before your tests.
    // Useful for global mocks, polyfills, or other test environment setup.
    // setupFiles: ['./tests/setup.ts'], // Uncomment and create this file if needed
  },
});
