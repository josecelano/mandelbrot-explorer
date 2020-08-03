export const FORMAT = {
    PPM: 0,
    ASCII_GRAPH: 1
}

export const COLOR_MAP = {
    BLACK_ON_WHITE: 0,
    WHITE_ON_BLACK: 1,
    COLORED_PERIODS: 2
}

export const ASCII_MAP = {
    AT_SIGN: 0,
    ITERATIONS: 1,
    FULL_ITERATIONS: 2,
    PERIODS: 3
}

export default {
    buildTileImageEndpointUrl(tileCommonUrlParams, color_map) {
        const tileUrlParams = {
            ...tileCommonUrlParams,
            format: FORMAT.PPM,
            color_map
        };
        return this.buildTileEndpointUrl(tileUrlParams);
    },

    buildAsciiGraphEndpointUrl(tileCommonUrlParams, ascii_map) {
        const tileUrlParams = {
            ...tileCommonUrlParams,
            format: FORMAT.ASCII_GRAPH,
            ascii_map
        };
        return this.buildTileEndpointUrl(tileUrlParams);
    },    

    buildTileEndpointUrl(params) {
        const tileUrl = new URL(`${process.env.VUE_APP_API_URL}/tiles`);
        tileUrl.search = new URLSearchParams(params);
        return tileUrl.href;
    },

    fetchTile(tileUrl) {
        return new Promise((resolve) => {
            const tileImage = new window.Image();
            tileImage.src = tileUrl;
            tileImage.onload = () => {
                resolve(tileImage);
            };
        })
    },

    buildOrbitImageEndpointUrl(zx, zy) {
        return `${process.env.VUE_APP_API_URL}/orbits?zx=${zx}&zy=${zy}`;
    },

    fetchOrbit(zx, zy, size) {
        return new Promise((resolve) => {
            const orbitImage = new window.Image();
            orbitImage.src = this.buildOrbitImageEndpointUrl(zx, zy);
            orbitImage.width = size.width;
            orbitImage.height = size.height;
            orbitImage.onload = () => {
                resolve(orbitImage);
            };
        })
    }
}