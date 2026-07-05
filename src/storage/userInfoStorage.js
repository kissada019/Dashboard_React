import localStorage from './localStorage';

const exportObjects = {
    set: (data) => localStorage.set('userInfo', data),
    update: (data) => localStorage.update('userInfo', data),
    get: () => localStorage.get('userInfo'),
    remove: (subkey) => localStorage.remove('userInfo', subkey)
}

export default exportObjects

