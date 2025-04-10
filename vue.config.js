const path = require('path')
const resolve = dir => path.join(__dirname, dir)
 
module.exports = {
  assetsDir: "static",
  chainWebpack: config => {
    // 设置快捷路径， @ 表示 'src' ，components 表示 'src/components'
    config.resolve.alias
      .set('@', resolve('src'))
      .set('assets', resolve('src/assets'))
      .set('components', resolve('src/components'))
      .set('views', resolve('src/views'));
      
 
      //对swf解析的配置
      config.module
      .rule('swf')
      .test(/\.swf$/)
      .use('url-loader')
      .loader('url-loader')
      .options({
          limit: 10000
      });
      
  },
}