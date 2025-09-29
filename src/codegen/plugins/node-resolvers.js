// Custom GraphQL Code Generator plugin.
// Relay Node を実装する型に対し、共通の resolveNode/normalize 関数を自動生成する。
const { isInterfaceType, isObjectType } = require('graphql')

/**
 * @typedef {{
 *   entries: Array<
 *     | { typeName: string; loader: { importFrom: string; namedImport: string } }
 *     | { typeName: string; contextLoader: { property: string } }
 *   >
 * }} NodeResolverPluginConfig
 */

const HEADER = '/* This file was automatically generated. DO NOT UPDATE MANUALLY. */'

/** @type {import('@graphql-codegen/plugin-helpers').PluginFunction<NodeResolverPluginConfig>} */
const plugin = (schema, _documents, config) => {
  if (!schema) {
    throw new Error('Schema is required to generate node resolvers.')
  }

  const nodeInterface = schema.getType('Node')
  if (!nodeInterface || !isInterfaceType(nodeInterface)) {
    return `${HEADER}\n`
  }

  const baseImports = new Set([
    "import type { Context } from '../context'",
    "import type { ResolversInterfaceTypes, ResolversParentTypes } from './types.generated'",
    "import { fromGlobalId } from './base/global-id'",
  ])
  const loaderImports = new Set()
  const normalizeFunctions = []
  const switchCases = []

  for (const entry of config?.entries ?? []) {
    const typeName = entry.typeName
    const type = schema.getType(typeName)
    if (!type || !isObjectType(type)) {
      throw new Error(`Type \"${typeName}\" is not an object type.`)
    }
    const implementsNode = type.getInterfaces().some(iface => iface.name === 'Node')
    if (!implementsNode) {
      throw new Error(`Type \"${typeName}\" does not implement the Node interface.`)
    }

    const parentType = `ResolversParentTypes['${typeName}']`
    const normalizeName = `normalize${typeName}`
    normalizeFunctions.push(
      `// ${typeName} 用: 取得したデータを resolver が扱いやすいようコピーする補助関数。`,
      `export function ${normalizeName}(record: ${parentType} | null | undefined): ${parentType} | null {`,
      '  if (!record) return null',
      '  return { ...record } as ' + parentType,
      '}',
      '',
    )

    if (Object.prototype.hasOwnProperty.call(entry, 'loader')) {
      loaderImports.add(`import { ${entry.loader.namedImport} } from '${entry.loader.importFrom}'`)
      switchCases.push(
        '    // DB ヘルパーを直接呼んで単一レコードを取得し、GraphQL resolver が扱いやすい形に整える',
        `    case '${typeName}': {\n` +
          `      const record = await ${entry.loader.namedImport}(decoded.rawId)\n` +
          `      const normalized = ${normalizeName}(record)\n` +
          `      return normalized ? { __typename: '${typeName}' as const, ...normalized } : null\n` +
          `    }`
      )
    } else if (Object.prototype.hasOwnProperty.call(entry, 'contextLoader')) {
      switchCases.push(
        `    // DataLoader 越しで取得するパターン。${typeName} のようにキャッシュが効く型はこちら。`,
        `    case '${typeName}': {\n` +
          `      const record = await context.loaders.${entry.contextLoader.property}.load(decoded.rawId)\n` +
          `      const normalized = ${normalizeName}(record)\n` +
          `      return normalized ? { __typename: '${typeName}' as const, ...normalized } : null\n` +
          `    }`
      )
    }
  }

  const lines = [
    HEADER,
    ...Array.from(baseImports),
    ...Array.from(loaderImports),
    '',
    "type NodeUnion = ResolversInterfaceTypes<ResolversParentTypes>['Node']",
    '',
    ...normalizeFunctions,
    'export async function resolveNode(globalId: string, context: Context): Promise<NodeUnion | null> {',
    '  const decoded = fromGlobalId(globalId)',
    '  if (decoded == null) {',
    '    return null',
    '  }',
    '  // Global ID に含まれる型名ごとに取得処理を振り分ける。',
    '  switch (decoded.typeName) {',
    ...switchCases,
    '    default:',
    '      return null',
    '  }',
    '}\n',
  ]

  return lines.join('\n')
}

module.exports = { plugin }
