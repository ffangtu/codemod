import GLOBAL from '@/utils/global.ts';
import CurrentUses from 'current-user';
import fetchCss from 'react-pm-utils/src/fetchCss';
import primary from 'react-pm-utils/src/primary';
import defaultSettings from '@/defaultSetting';

export async function render(oldRender: any) {
  if (!window.__POWERED_BY_QIANKUN__) {
    const current = new CurrentUses();
    await current.ssoFinished();
    oldRender()
  } else {
    oldRender()
  }
}

export const qiankun = {
  // 应用加载之前
  async bootstrap(props: any) {
    console.log('app1 bootstrap');
  },
  // 应用 render 之前触发
  async mount(props: any) {
    if (props) {
      GLOBAL.PMHOME = props.PMHOME
    } else {
      fetchCss();
      primary(defaultSettings.primary)
    }
    console.log('app1 mount');
  },
  // 应用卸载之后触发
  async unmount(props: any) {
    console.log('app1 unmount');
  },
};
