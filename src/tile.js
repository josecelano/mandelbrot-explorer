export function zoomInByFactor(tile, zoomFactor) {
    const tileCenter = getCenterPoint(tile)
    const tileSize = getTileSize(tile)
    return translateToPoint(
        zoomInByFactorAtOrigin(
            translateToOrigin(
                createTileFromCenterAndSize(tileCenter, tileSize)
            ),
            zoomFactor
        ),
        tileCenter
    )
}

export function zoomOutByFactor(tile, zoomFactor) {
    const tileCenter = getCenterPoint(tile)
    const tileSize = getTileSize(tile)
    return translateToPoint(
        zoomOutByFactorAtOrigin(
            translateToOrigin(
                createTileFromCenterAndSize(tileCenter, tileSize)
            ),
            zoomFactor
        ),
        tileCenter
    )
}

export function zoomInByFactorAtOrigin(tile, zoomFactor) {
    return {
        leftBottomPoint: {
            real: tile.leftBottomPoint.real / zoomFactor,
            imaginary: tile.leftBottomPoint.imaginary / zoomFactor,
        },
        topRightPoint: {
            real: tile.topRightPoint.real / zoomFactor,
            imaginary: tile.topRightPoint.imaginary / zoomFactor,
        }
    };
}

export function zoomOutByFactorAtOrigin(tile, zoomFactor) {
    return {
        leftBottomPoint: {
            real: tile.leftBottomPoint.real * zoomFactor,
            imaginary: tile.leftBottomPoint.imaginary * zoomFactor,
        },
        topRightPoint: {
            real: tile.topRightPoint.real * zoomFactor,
            imaginary: tile.topRightPoint.imaginary * zoomFactor,
        }
    };
}

export function convertFromDomainToAPIFormat(tile) {
    return {
        left_bottom_zx: tile.leftBottomPoint.real,
        left_bottom_zy: tile.leftBottomPoint.imaginary,
        top_right_zx: tile.topRightPoint.real,
        top_right_zy: tile.topRightPoint.imaginary
    };
}

export function convertFromAPIToDomainFormat(tile) {
    return {
        leftBottomPoint: {
            real: tile.left_bottom_zx,
            imaginary: tile.left_bottom_zy,
        },
        topRightPoint: {
            real: tile.top_right_zx,
            imaginary: tile.top_right_zy,
        }
    };
}

export function createTileFromCornerPoints(leftBottomPoint, topRightPoint) {
    return {
        leftBottomPoint,
        topRightPoint
    };
}

export function createTileFromCenterAndSize(center, tileSize) {
    return {
        leftBottomPoint: {
            real: center.real - (tileSize.width / 2),
            imaginary: center.imaginary - (tileSize.height / 2)
        },
        topRightPoint: {
            real: center.real + (tileSize.width / 2),
            imaginary: center.imaginary + (tileSize.height / 2)
        }
    }
}

export function getCenterPoint(tile) {
    return {
        real: tile.leftBottomPoint.real + (tile.topRightPoint.real - tile.leftBottomPoint.real) / 2,
        imaginary: tile.leftBottomPoint.imaginary + (tile.topRightPoint.imaginary - tile.leftBottomPoint.imaginary) / 2
    }
}

export function getTileSize(tile) {
    return {
        width: tile.topRightPoint.real - tile.leftBottomPoint.real,
        height: tile.topRightPoint.imaginary - tile.leftBottomPoint.imaginary
    };
}

export function translateToPoint(tile, newCenter) {
    const center = getCenterPoint(tile)
    const translation = {
        real: newCenter.real - center.real,
        imaginary: newCenter.imaginary - center.imaginary
    }
    return {
        leftBottomPoint: {
            real: tile.leftBottomPoint.real + translation.real,
            imaginary: tile.leftBottomPoint.imaginary + translation.imaginary
        },
        topRightPoint: {
            real: tile.topRightPoint.real + translation.real,
            imaginary: tile.topRightPoint.imaginary + translation.imaginary
        }
    }
}

export function translateToOrigin(tile) {
    const origin = {
        real: 0,
        imaginary: 0
    }
    return translateToPoint(tile, origin)
}

export function getPixelSize(tile, resolution) {
    const tileSize = getTileSize(tile)
    return {
        width: tileSize.width / resolution.width,
        height: tileSize.height / resolution.height
    }
}

export function calculateZPointForPixelCoordinates(tile, resolution, pixelCoordinates) {
    const pixelSize = getPixelSize(tile, resolution)
    return {
        real:
            tile.leftBottomPoint.real +
            pixelCoordinates.x * pixelSize.width,
        imaginary:
            tile.leftBottomPoint.imaginary +
            (resolution.height - pixelCoordinates.y) *
            pixelSize.height
    };
}

export function splitIntoGrid(tile, rows, cols) {

    const size = getTileSize(tile);
    const cellWidth = size.width / cols;
    const cellHeight = size.height / rows;

    const top = tile.topRightPoint.imaginary;
    const left = tile.leftBottomPoint.real;

    let grid = [[]];
    for (var row = 0; row < rows; row++) {
        grid[row] = [];
        for (var col = 0; col < cols; col++) {
            grid[row][col] = {
                leftBottomPoint: {
                    real: left + cellWidth * col,
                    imaginary: top - cellHeight * (row + 1)
                },
                topRightPoint: {
                    real: left + cellWidth * (col + 1),
                    imaginary: top - cellHeight * (row)
                }
            };
        }
    }

    return grid;
}