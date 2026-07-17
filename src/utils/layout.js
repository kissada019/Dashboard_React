const loading = {
    show: (isShow) => {
        if (isShow && document.querySelector(".loading")) {
            document.querySelector(".loading").classList.add('show');
        }
    },
    hide: (isShow) => {
        if (isShow && document.querySelector(".loading")) {
            document.querySelector(".loading").classList.remove('show');
        }
    }
}

const layout = { loading: loading }

export default layout;
