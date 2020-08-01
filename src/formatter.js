export default {
    complexToString(complex) {
        if (!complex.real) return "";
        const real = complex.real != 0 ? complex.real : "";
        const imaginary = complex.imaginary != 0 ? complex.imaginary + "i" : "";
        const add = complex.imaginary > 0 ? "+" : "";
        return `${real}${add}${imaginary}`;
    },

    pixelCoordinatesToString(pixel) {
        if (!pixel.x) return "";
        return "x: " + pixel.x + " y: " + pixel.y;
    },

    resolutionToString(resolution) {
        return resolution.width + "x" + resolution.height + "px";
    }
}