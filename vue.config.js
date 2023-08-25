const Timestamp = new Date().getTime();

module.exports = {
    devServer: {
        open: true, //打开浏览器
        port: 3002, //设置端口号
        hot: true, //开启热更新
    },
    outputDir: process.env.VUE_APP_OUTPUTDIR,     // 根据环境去打包
    configureWebpack: {
        output: {
            filename: `js/[name].${Timestamp}.js`,
            chunkFilename: `js/[name].${Timestamp}.js`
        },
    }
}