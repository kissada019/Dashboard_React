const set = (key, data) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(key, JSON.stringify(data));
    }
}

const update = (key, data) => {
    let _data = get(key);
    if (typeof window !== 'undefined') {
        localStorage.setItem(key, JSON.stringify({ ..._data, ...data }));
    }
}

const get = (key) => {
    let _data = null;
    if (typeof window !== 'undefined') {
        _data = JSON.parse(localStorage.getItem(key));
    }
    return _data;
}

const remove = (key, subKey) => {
    if (typeof window !== 'undefined') {
        if (subKey) {
            let _data = get(key);
            delete _data[subKey];
            set(key, _data);
        }
        else {
            localStorage.removeItem(key);
        }
    }
}

const exportObjects = {
    set,
    update,
    get,
    remove
}

export default exportObjects