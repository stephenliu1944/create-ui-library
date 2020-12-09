import webpackMerge from 'webpack-merge';
import TerserPlugin from 'terser-webpack-plugin';
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import getBaseConfig from './webpack.config.base';
import { name } from './package.json';

const parcels = [{
    // 非压缩配置
    mode: 'none'
}, {
    // 压缩配置
    mode: 'production',
    optimization: {
        minimizer: [
            new TerserPlugin(),
            new OptimizeCSSAssetsPlugin()
        ]
    }
}];

export default parcels.map((parcel, index) => {
    let mode = parcel.mode;
    let baseConfig = getBaseConfig({
        jsFile: mode === 'none' ? `${name}.js` : `${name}.min.js`, 
        cssFile: mode === 'none' ? `${name}.css` : `${name}.min.css`,
        isClean: index === 0
    });

    return webpackMerge(baseConfig, parcel);
});