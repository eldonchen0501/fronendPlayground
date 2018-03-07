/**
 * The config object of the entire application:
 *   - Environment-specific config object will override defaultConfig if they have same properties.
 *   - Use the env variable `REACT_APP_ENV` to control which env-specific config to use,
 *     for example: `$ REACT_APP_ENV=production npm run build`
 *   - default env config is `config.local.js`
 */
import localConfig from './config.local';
import productionConfig from './config.production';
import devConfig from './config.development';

const defaultConfig = {
  defaultDisappearAfter: 1500, // alert will disappear after 1.5 sec
  navItems: [
    { name: 'Restaurants', href: '/#restaurants', iconClassName: 'fa fa-cutlery' },
    { name: 'Cards', href: '/#cards', iconClassName: 'fa fa-picture-o' },
    { name: 'Cuisine Types', href: '/#cuisine-types', iconClassName: 'fa fa-file-code-o' },
    { name: 'Reports', href: '/#reports', iconClassName: 'fa fa-flag' },
  ],
};

let envConfig;
switch (process.env.REACT_APP_ENV) {
  case 'production':
  case 'prod': {
    envConfig = productionConfig;
    break;
  }
  case 'development':
  case 'dev': {
    envConfig = devConfig;
    break;
  }
  case 'local':
  default: {
    envConfig = localConfig;
    break;
  }
}

export default {
  ...defaultConfig,
  ...envConfig,
};
