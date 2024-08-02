import resolve from 'rollup-plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'

export default {
  input: './src/index.ts', // 入口文件
  output: [
    {
      format: 'cjs', // 打包为commonjs格式
      file: 'dist/lines-webpack-plugin.cjs.js', // 打包后的文件路径名称
      name: 'LinesWebpackPlugin' // 打包后的默认导出文件名称
    },
  ],
  plugins: [typescript({ tsconfig: './tsconfig.json' }), resolve()]
}
