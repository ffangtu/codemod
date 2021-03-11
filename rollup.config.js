
import path from 'path'
import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve'; // 依赖引用插件
import commonjs from 'rollup-plugin-commonjs' // commonjs模块转换插件
import ts from 'rollup-plugin-typescript2';
import {uglify} from 'rollup-plugin-uglify';
import clear from 'rollup-plugin-clear';

const getPath = _path => path.resolve(__dirname, _path)
// ts
const extensions = [
    '.js',
    '.ts',
    '.tsx'
]
const tsPlugin = ts({
    tsconfig: getPath('./tsconfig.json'), // 导入本地ts配置
    extensions
})

export default {
    input: 'src/main.js',  // 入口文件
    output: {  // 输出 options
        file: 'dist/bundle.js',  // 输出文件名
        format: 'cjs'       // 输出格式
    },
    plugins: [ // 增加 plugins
        resolve(extensions),
        commonjs(),
        uglify(),
        babel({
            exclude: 'node_modules/**' // 不对node_modules进行编译
        }),
        tsPlugin,
        clear({targets: ['dist']}), //清除dist目录
    ]
}
