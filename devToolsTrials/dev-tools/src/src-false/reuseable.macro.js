const babelPluginMacros = require('babel-plugin-macros');
const createMacro = babelPluginMacros.createMacro;
const MacroError = babelPluginMacros.MacroError;

const babelPlugin = require('babel-plugin-reusable').default;

const babelHelperModuleImports = require('@babel/helper-module-imports');
const addDefault = babelHelperModuleImports.addDefault;
const addNamed = babelHelperModuleImports.addNamed;

const allowedImports = ['createStore'];

function reuseableMacro({ references, state, babel: { types: t }, config = {} }) {
  const program = state.file.path;

  // FIRST STEP : replace `reusable/macro` by `reusable
  // references looks like this
  // { default: [path, path], css: [path], ... }
  let customImportName;
  Object.keys(references).forEach(refName => {
    if (!allowedImports.includes(refName)) {
      throw new MacroError(
        `Invalid import: ${refName}. You can only import ${allowedImports.join(
          ', '
        )} from 'reusable/macro'.`
      );
    }

    // generate new identifier
    let id;
    if (refName === 'default') {
      id = addDefault(program, 'reusable', { nameHint: 'reusable' });
      customImportName = id;
    } else {
      id = addNamed(program, refName, 'reusable', { nameHint: refName });
    }

    // update references with the new identifiers
    references[refName].forEach(referencePath => {
      // eslint-disable-next-line no-param-reassign
      referencePath.node.name = id.name;
    });
  });

  // SECOND STEP : apply babel-plugin-reusable to the file
  const stateWithOpts = { ...state, opts: config, customImportName };
  program.traverse(babelPlugin({ types: t }).visitor, stateWithOpts);
}

module.exports = createMacro(reuseableMacro);
