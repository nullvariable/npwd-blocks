import App from './App';
import { AppIcon } from './icon';

interface Settings {
  language: 'en';
}

export const path = '/npwd_app_blocks';
export default (settings: Settings) => ({
  id: 'npwd_app_blocks',
  path,
  nameLocale: "Blocks",
  color: '#83BBCE',
  backgroundColor: '#fff',
  icon: AppIcon,
  notificationIcon: AppIcon,
  app: App,
});
