
module.exports = {
  devServer: {
    open: true,
    port: 8002,
    https: false,
    hotOnly: false,   
    // http 代理配置
    proxy: {      
      '/api': {
        target: 'http://localhost:3030',
        changeOrigin: true,
        // pathRewrite: {          
        //   '^/api': '/api'
        // }
      },
      '/upload/ueditor/image': {
        target: 'http://localhost:3030',
        changeOrigin: true
      },
      '/upload/ueditor/video': {
        target: 'http://localhost:3030',
        changeOrigin: true
      }
    },
    before: (app) => {}
  },
  publicPath:''
}
