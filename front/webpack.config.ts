import path from 'path';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import webpack from 'webpack';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'; // 타입스크립트 검사 시 블로킹 식으로 검사를 하는데, 다음 동작을 막아버리기 때문에 이 플러그인으로 타입스크립트 검사와 웹팩 동작이 동시에 될 수 있게 한다. = 성능 향상
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
//import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

const isDevelopment = process.env.NODE_ENV !== 'production';

const config: webpack.Configuration = {
  name: 'sleact',
  mode: isDevelopment ? 'development' : 'production',
  devtool: !isDevelopment ? 'hidden-source-map' : 'eval',
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    alias: {
      '@layouts': path.resolve(__dirname, 'layouts'),
      '@pages': path.resolve(__dirname, 'pages'),
    },
  },
  entry: {
    app: './client',
  },
  output: {
    // 번들링된 결과물을 app.js라는 이름으로 dist폴더에 저장.
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
    publicPath: '/dist/',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'babel-loader', // es6 -> es5로 변환할 때 사용.
        options: {
          presets: [
            [
              '@babel/preset-env',
              {
                targets: { browsers: ['last 2 chrome versions'] },
                debug: isDevelopment,
              },
            ],
            '@babel/preset-react',
            '@babel/preset-typescript',
          ],
          env: {
            development: {
              plugins: [['@emotion', { sourceMap: true }], require.resolve('react-refresh/babel')],
            },
            production: {
              plugins: ['@emotion'],
            },
          },
        },
        exclude: path.join(__dirname, 'node_modules'), // node_modules는 예외 처리
      },
      {
        test: /\.css?$/,
        use: ['style-loader', 'css-loader'], // css-loader : css를 js로 변환하여 로딩. style-loader : js로 변경된 css를 동적으로 돔에 추가.
      },
      {
        test: /\.(png|jpg|svg|gif)$/, // .png 확장자로 마치는 모든 파일
        loader: 'file-loader', // 파일 로더를 적용한다
        options: {
          publicPath: './dist/', // prefix를 아웃풋 경로로 지정
          name: '[name].[ext]?[hash]', // 파일명 형식
        },
      },
    ],
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin({
      async: false,
      // eslint: {
      //   files: "./src/**/*",
      // },
    }),
    new webpack.EnvironmentPlugin({ NODE_ENV: isDevelopment ? 'development' : 'production' }),
  ],
  devServer: {
    historyApiFallback: true, // react router 사용 시 필요한 설정
    port: 5001,
    publicPath: '/dist/',
    proxy: {
      '/api/': {
        target: 'http://localhost:5001',
        changeOrigin: true,
      },
    },
  },
};

if (isDevelopment && config.plugins) {
  config.plugins.push(new webpack.HotModuleReplacementPlugin());
  config.plugins.push(new ReactRefreshWebpackPlugin());
  config.plugins.push(new CleanWebpackPlugin());
  //config.plugins.push(new BundleAnalyzerPlugin({ analyzerMode: 'server', openAnalyzer: false }));
}
if (!isDevelopment && config.plugins) {
  //config.plugins.push(new webpack.LoaderOptionsPlugin({ minimize: true }));
  //config.plugins.push(new BundleAnalyzerPlugin({ analyzerMode: 'static' }));
}

export default config;

/* 
  로더 : 파일 단위로 처리.
  플러그인 : 번들된 결과물을 처리. 번들된 js를 난독화하거나 특정 텍스트를 추출하는 용도로 사용 가능.
*/
