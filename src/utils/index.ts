/*
 * @Descripttion: 工具类
 * @version:
 * @Author: 小白
 * @Date: 2020-10-04 13:11:40
 * @LastEditors: 小白
 * @LastEditTime: 2022-02-16 23:53:34
 */
export const setAuth = (auth: string) => {
  window.localStorage.setItem('auth', auth);
};

export const getAuth = () => {
  const auth = window.localStorage.getItem('auth');
  return auth || '';
};
export const getCode = () => {
  return window.location.search
    ? searchObj(window.location.search).code
    : window.location.pathname.split('/')[2];
};
/**
 * 获取url参数
 * @param search url参数
 */
export const searchObj = (search: string) => {
  const body = JSON.parse(
    '{"'.concat(
      decodeURIComponent(search.substring(1))
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"'),
      '"}',
    ),
  );
  return body;
};

export const treeToList = (list: any[], parents: string | string[]) => {
  let adtaList: any[] = [];
  list.forEach((v) => {
    if (typeof parents === 'string') {
      if (v[parents]) {
        adtaList = [...adtaList, ...treeToList(v[parents], parents)];
      } else {
        adtaList.push(v);
      }
    } else {
      let isHave = false;
      parents.forEach((parent) => {
        if (v[parent]) {
          adtaList = [...adtaList, ...treeToList(v[parent], parents)];
          isHave = true;
        }
      });
      if (!isHave) {
        adtaList.push(v);
      }
    }
  });
  return adtaList;
};

export const setWindowHeight = () => {
  const windowWidth = window.innerWidth;
  let windowHeight = window.innerHeight;
  if (typeof windowWidth !== 'number') {
    if (document.compatMode === 'CSS1Compat') {
      windowHeight = document.documentElement.clientHeight;
    } else {
      // @ts-ignore
      windowHeight = window.body.clientHeight;
    }
  }
  document
    .getElementsByTagName('body')[0]
    .style.setProperty('--height-primary', `${windowHeight}px`);
};

export const base64ToFile = (base64: string, cb: (file: any) => void) => {
	try {
		fetch(base64)
			.then((r) => r.blob())
			.then((blb) => {
				const file = new File([blb], `${randomId()}.png`, {
					type: 'image/png',
				});
				cb(file);
			});
	} catch (error) {
		cb(null);
	}
};

export const randomId = () => {
	return Math.random().toString(36).substr(2, 9);
};

export const getBase64 = (img: File, callback: (res: string) => void): void => {
	const reader: any = new FileReader();
	reader.readAsDataURL(img);
	reader?.addEventListener('load', () => callback(reader.result));
};

export const setLocalData = (key: string, value: any) => {
	try {
		localStorage.setItem(key, JSON.stringify(value));
	} catch (error) {}
};

export const getLocalData = (key: string) => {
	try {
		const value = localStorage.getItem(key);
		return value ? JSON.parse(value) : null;
	} catch (error) {
		return null;
	}
};