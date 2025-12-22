import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validatePlugin,
  addPlugin,
  removePlugin,
  listPlugins,
  getHookPoints,
  HOOK_POINTS,
  executeHooks,
  loadPluginRegistry,
  savePluginRegistry,
} from '../../src/dd/plugins.mjs';
import { createTempProject, cleanupTempProject } from '../utils/fixtures.mjs';
import fs from 'node:fs';
import path from 'node:path';

test('plugins: addPlugin with valid file plugin', async () => {
  const tempDir = createTempProject();

  try {
    // Create a valid plugin file
    const pluginPath = path.join(tempDir, 'test-plugin.mjs');
    const pluginContent = `
export default {
  name: 'test-plugin',
  version: '1.0.0',
  description: 'Test plugin',
  hooks: {
    'pre:export': async (context) => ({ success: true }),
  },
};
`;
    fs.writeFileSync(pluginPath, pluginContent);

    const plugin = await addPlugin(pluginPath, tempDir);
    assert.equal(plugin.name, 'test-plugin');
    assert.equal(plugin.version, '1.0.0');

    // Check registry was updated
    const plugins = listPlugins(tempDir);
    assert.equal(plugins.length, 1);
    assert.equal(plugins[0].name, 'test-plugin');
  } finally {
    cleanupTempProject(tempDir);
  }
});

test('plugins: addPlugin rejects plugin without name', async () => {
  const tempDir = createTempProject();

  try {
    const pluginPath = path.join(tempDir, 'bad-plugin.mjs');
    const pluginContent = `
export default {
  version: '1.0.0',
  hooks: {},
};
`;
    fs.writeFileSync(pluginPath, pluginContent);

    await assert.rejects(
      async () => await addPlugin(pluginPath, tempDir),
      /name/i
    );
  } finally {
    cleanupTempProject(tempDir);
  }
});

test('plugins: addPlugin rejects plugin without version', async () => {
  const tempDir = createTempProject();

  try {
    const pluginPath = path.join(tempDir, 'bad-plugin.mjs');
    const pluginContent = `
export default {
  name: 'bad-plugin',
  hooks: {},
};
`;
    fs.writeFileSync(pluginPath, pluginContent);

    await assert.rejects(
      async () => await addPlugin(pluginPath, tempDir),
      /version/i
    );
  } finally {
    cleanupTempProject(tempDir);
  }
});

test('plugins: addPlugin rejects plugin with unknown hook', async () => {
  const tempDir = createTempProject();

  try {
    const pluginPath = path.join(tempDir, 'bad-plugin.mjs');
    const pluginContent = `
export default {
  name: 'bad-plugin',
  version: '1.0.0',
  hooks: {
    'unknown:hook': async () => ({ success: true }),
  },
};
`;
    fs.writeFileSync(pluginPath, pluginContent);

    await assert.rejects(
      async () => await addPlugin(pluginPath, tempDir),
      /unknown hook/i
    );
  } finally {
    cleanupTempProject(tempDir);
  }
});

test('plugins: removePlugin removes from registry', async () => {
  const tempDir = createTempProject();

  try {
    // Add a plugin first
    const pluginPath = path.join(tempDir, 'test-plugin.mjs');
    const pluginContent = `
export default {
  name: 'removable-plugin',
  version: '1.0.0',
  hooks: {
    'pre:export': async () => ({ success: true }),
  },
};
`;
    fs.writeFileSync(pluginPath, pluginContent);
    await addPlugin(pluginPath, tempDir);

    // Now remove it
    removePlugin('removable-plugin', tempDir);

    // Check it's gone
    const plugins = listPlugins(tempDir);
    assert.equal(plugins.length, 0);
  } finally {
    cleanupTempProject(tempDir);
  }
});

test('plugins: executeHooks runs plugin hooks', async () => {
  const tempDir = createTempProject();

  try {
    // Create and add a plugin
    const pluginPath = path.join(tempDir, 'hook-plugin.mjs');
    const pluginContent = `
export default {
  name: 'hook-plugin',
  version: '1.0.0',
  hooks: {
    'pre:export': async (context) => {
      return { success: true, message: 'Hook executed' };
    },
  },
};
`;
    fs.writeFileSync(pluginPath, pluginContent);
    await addPlugin(pluginPath, tempDir);

    // Execute hooks
    const hookResult = await executeHooks('pre:export', { projectDir: tempDir }, tempDir);
    assert(hookResult.hookPoint === 'pre:export');
    assert(Array.isArray(hookResult.results));
    assert(hookResult.results.length > 0);
    assert(hookResult.results[0].success);
  } finally {
    cleanupTempProject(tempDir);
  }
});

test('plugins: executeHooks handles hook errors gracefully', async () => {
  const tempDir = createTempProject();

  try {
    // Create a plugin with a failing hook
    const pluginPath = path.join(tempDir, 'failing-plugin.mjs');
    const pluginContent = `
export default {
  name: 'failing-plugin',
  version: '1.0.0',
  hooks: {
    'pre:export': async () => {
      throw new Error('Hook failed');
    },
  },
};
`;
    fs.writeFileSync(pluginPath, pluginContent);
    await addPlugin(pluginPath, tempDir);

    // Execute hooks should not throw
    const hookResult = await executeHooks('pre:export', {}, tempDir);
    assert(Array.isArray(hookResult.results));
    // Hook should have failed
    assert(!hookResult.allSucceeded);
  } finally {
    cleanupTempProject(tempDir);
  }
});

test('plugins: getHookPoints returns all hooks', () => {
  const hookPoints = getHookPoints();
  assert(Array.isArray(hookPoints));
  assert(hookPoints.length > 0);
  assert(hookPoints.some(h => h.name === 'pre:export'));
  assert(hookPoints.some(h => h.name === 'post:export'));
});

test('plugins: HOOK_POINTS includes pre and post export hooks', () => {
  assert(HOOK_POINTS['pre:export']);
  assert(HOOK_POINTS['post:export']);
  assert(HOOK_POINTS['pre:build']);
  assert(HOOK_POINTS['post:build']);
});

test('plugins: loadPluginRegistry creates empty registry if none exists', () => {
  const tempDir = createTempProject();

  try {
    const registry = loadPluginRegistry(tempDir);
    assert(Array.isArray(registry.plugins));
    assert.equal(registry.plugins.length, 0);
  } finally {
    cleanupTempProject(tempDir);
  }
});

test('plugins: savePluginRegistry creates .dd directory', () => {
  const tempDir = createTempProject();

  try {
    const registry = {
      version: '1.0',
      plugins: [],
    };
    savePluginRegistry(registry, tempDir);

    const ddDir = path.join(tempDir, '.dd');
    assert(fs.existsSync(ddDir));

    const registryPath = path.join(ddDir, 'plugins.json');
    assert(fs.existsSync(registryPath));
  } finally {
    cleanupTempProject(tempDir);
  }
});

test('plugins: addPlugin with optional fields', async () => {
  const tempDir = createTempProject();

  try {
    const pluginPath = path.join(tempDir, 'optional-plugin.mjs');
    const pluginContent = `
export default {
  name: 'optional-plugin',
  version: '1.0.0',
  description: 'Plugin with optional fields',
  author: 'Test Author',
  capabilities: ['build', 'deploy'],
  hooks: {
    'pre:export': async () => ({ success: true }),
  },
};
`;
    fs.writeFileSync(pluginPath, pluginContent);

    const plugin = await addPlugin(pluginPath, tempDir);
    assert.equal(plugin.name, 'optional-plugin');
    assert.equal(plugin.description, 'Plugin with optional fields');
    assert.equal(plugin.author, 'Test Author');
    assert(Array.isArray(plugin.capabilities));
    assert.equal(plugin.capabilities.length, 2);
  } finally {
    cleanupTempProject(tempDir);
  }
});

test('plugins: listPlugins returns plugin metadata', async () => {
  const tempDir = createTempProject();

  try {
    // Add two plugins
    const plugin1Path = path.join(tempDir, 'plugin1.mjs');
    fs.writeFileSync(plugin1Path, `
export default {
  name: 'plugin-one',
  version: '1.0.0',
  hooks: { 'pre:export': async () => ({ success: true }) },
};
`);

    const plugin2Path = path.join(tempDir, 'plugin2.mjs');
    fs.writeFileSync(plugin2Path, `
export default {
  name: 'plugin-two',
  version: '2.0.0',
  hooks: { 'post:export': async () => ({ success: true }) },
};
`);

    await addPlugin(plugin1Path, tempDir);
    await addPlugin(plugin2Path, tempDir);

    const plugins = listPlugins(tempDir);
    assert.equal(plugins.length, 2);
    assert(plugins.some(p => p.name === 'plugin-one'));
    assert(plugins.some(p => p.name === 'plugin-two'));
  } finally {
    cleanupTempProject(tempDir);
  }
});

test('plugins: executeHooks with skipNext stops execution', async () => {
  const tempDir = createTempProject();

  try {
    // Create first plugin that sets skipNext
    const plugin1Path = path.join(tempDir, 'skip-plugin.mjs');
    fs.writeFileSync(plugin1Path, `
export default {
  name: 'skip-plugin',
  version: '1.0.0',
  hooks: {
    'pre:export': async () => ({ success: true, skipNext: true }),
  },
};
`);

    // Create second plugin that should not run
    const plugin2Path = path.join(tempDir, 'second-plugin.mjs');
    fs.writeFileSync(plugin2Path, `
export default {
  name: 'second-plugin',
  version: '1.0.0',
  hooks: {
    'pre:export': async () => ({ success: true, message: 'I ran!' }),
  },
};
`);

    await addPlugin(plugin1Path, tempDir);
    await addPlugin(plugin2Path, tempDir);

    const hookResult = await executeHooks('pre:export', {}, tempDir);
    // First plugin should run, second should be skipped
    assert(hookResult.results.length >= 1);
    // Only one hook should have executed
    assert.equal(hookResult.executed, 1);
  } finally {
    cleanupTempProject(tempDir);
  }
});
