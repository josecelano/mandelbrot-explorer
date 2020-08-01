import {
  zoomInByFactor,
  zoomOutByFactor,
  zoomInByFactorAtOrigin,
  zoomOutByFactorAtOrigin,
  convertFromDomainToAPIFormat,
  convertFromAPIToDomainFormat,
  createTileFromCornerPoints,
  createTileFromCenterAndSize,
  getCenterPoint,
  getTileSize,
  translateToPoint,
  getPixelSize,
  calculateZPointForPixelCoordinates
} from '@/tile'

describe('tile', () => {
  it('should be scaled up by a given factor when centered at origin', () => {
    const tile = {
      leftBottomPoint: {
        real: 0,
        imaginary: 0
      },
      topRightPoint: {
        real: 1,
        imaginary: 1
      }
    };

    const zoomFactor = 2;
    const newTile = zoomInByFactorAtOrigin(tile, zoomFactor);

    expect(newTile).toStrictEqual({
      leftBottomPoint: {
        real: 0,
        imaginary: 0
      },
      topRightPoint: {
        real: 0.5,
        imaginary: 0.5
      }
    });
  })

  it('should be scaled down by a given factor centered at origin', () => {
    const tile = {
      leftBottomPoint: {
        real: 0,
        imaginary: 0
      },
      topRightPoint: {
        real: 0.5,
        imaginary: 0.5
      }
    };

    const zoomFactor = 2;
    const newTile = zoomOutByFactorAtOrigin(tile, zoomFactor);

    expect(newTile).toStrictEqual({
      leftBottomPoint: {
        real: 0,
        imaginary: 0
      },
      topRightPoint: {
        real: 1,
        imaginary: 1
      }
    });
  })

  it('should be scaled up by a given factor when not centered at origin', () => {
    const tile = {
      leftBottomPoint: {
        real: 1,
        imaginary: 1
      },
      topRightPoint: {
        real: 2,
        imaginary: 2
      }
    };

    const zoomFactor = 2;
    const newTile = zoomInByFactor(tile, zoomFactor);

    expect(newTile).toStrictEqual({
      leftBottomPoint: {
        real: 1.25,
        imaginary: 1.25
      },
      topRightPoint: {
        real: 1.75,
        imaginary: 1.75
      }
    });
  })

  it('should be scaled down by a given factor when not centered at origin', () => {
    const tile = {
      leftBottomPoint: {
        real: 1,
        imaginary: 1
      },
      topRightPoint: {
        real: 2,
        imaginary: 2
      }
    };

    const zoomFactor = 2;
    const newTile = zoomOutByFactor(tile, zoomFactor);

    expect(newTile).toStrictEqual({
      leftBottomPoint: {
        real: 0.5,
        imaginary: 0.5
      },
      topRightPoint: {
        real: 2.5,
        imaginary: 2.5
      }
    });
  })

  it('should be converted from domain format to api format', () => {
    const tile = {
      leftBottomPoint: {
        real: 1,
        imaginary: 2
      },
      topRightPoint: {
        real: 3,
        imaginary: 4
      }
    };

    const newTile = convertFromDomainToAPIFormat(tile);

    expect(newTile).toStrictEqual({
      left_bottom_zx: 1,
      left_bottom_zy: 2,
      top_right_zx: 3,
      top_right_zy: 4
    });
  })

  it('should be converted from api format to domain format', () => {
    const tile = {
      left_bottom_zx: 1,
      left_bottom_zy: 2,
      top_right_zx: 3,
      top_right_zy: 4
    };

    const newTile = convertFromAPIToDomainFormat(tile);

    expect(newTile).toStrictEqual({
      leftBottomPoint: {
        real: 1,
        imaginary: 2
      },
      topRightPoint: {
        real: 3,
        imaginary: 4
      }
    });
  })

  it('should be created from left bottom and top right points', () => {
    const leftBottomPoint = {
      real: 1,
      imaginary: 2
    }

    const topRightPoint = {
      real: 3,
      imaginary: 4
    }

    const tile = createTileFromCornerPoints(leftBottomPoint, topRightPoint);

    expect(tile).toStrictEqual({
      leftBottomPoint,
      topRightPoint
    });
  })

  it('should be created from a complex center point and size in real numbers', () => {
    const centerPoint = {
      real: 0,
      imaginary: 0
    }

    const tileSize = {
      width: 4,
      height: 4
    }

    const tile = createTileFromCenterAndSize(centerPoint, tileSize);

    expect(tile).toStrictEqual({
      leftBottomPoint: {
        real: -2,
        imaginary: -2
      },
      topRightPoint: {
        real: 2,
        imaginary: 2
      }
    });
  })

  it('should have a center point', () => {
    const tile = {
      leftBottomPoint: {
        real: 0,
        imaginary: 0
      },
      topRightPoint: {
        real: 2,
        imaginary: 2
      }
    }

    const center = getCenterPoint(tile);

    expect(center).toStrictEqual({
      real: 1,
      imaginary: 1
    });
  })

  it('should have a width and height', () => {
    const tile = {
      leftBottomPoint: {
        real: 0,
        imaginary: 0
      },
      topRightPoint: {
        real: 4,
        imaginary: 2
      }
    }

    const size = getTileSize(tile);

    expect(size).toStrictEqual({
      width: 4,
      height: 2
    });
  })

  it('center could be translated to another point keeping the same width and size', () => {
    const tile = {
      leftBottomPoint: {
        real: 0,
        imaginary: 0
      },
      topRightPoint: {
        real: 2,
        imaginary: 2
      }
    }

    const newCenter = {
      real: 0,
      imaginary: 0
    }

    const transformedTile = translateToPoint(tile, newCenter)

    expect(transformedTile).toStrictEqual({
      leftBottomPoint: {
        real: -1,
        imaginary: -1
      },
      topRightPoint: {
        real: 1,
        imaginary: 1
      }
    });
  })

  it('should have a pixel size for a given resolution', () => {
    const tile = {
      leftBottomPoint: {
        real: 0,
        imaginary: 0
      },
      topRightPoint: {
        real: 1,
        imaginary: 2
      }
    }

    const resolution = {
      width: 512,
      height: 512,
    }

    const pixelSize = getPixelSize(tile, resolution)

    expect(pixelSize).toStrictEqual({
      width: 1 / 512,
      height: 2 / 512,
    });
  })

  it('should calculate the Z point from pixel coordinates', () => {

    // We are not using the pixel center, we are using the Z point in the left top corner of the pixel.

    const tile = {
      leftBottomPoint: {
        real: 0,
        imaginary: 0
      },
      topRightPoint: {
        real: 512,
        imaginary: 512
      }
    }

    const resolution = { width: 512, height: 512, }

    const leftTopPixel = { x: 0, y: 0, }
    const rightTopPixel = { x: 511, y: 0, }
    const rightBottomPixel = { x: 511, y: 511, }
    const leftBottomPixel = { x: 0, y: 511, }

    const zlt = calculateZPointForPixelCoordinates(tile, resolution, leftTopPixel)
    expect(zlt).toStrictEqual({ real: 0, imaginary: 512 });

    const ztp = calculateZPointForPixelCoordinates(tile, resolution, rightTopPixel)
    expect(ztp).toStrictEqual({ real: 511, imaginary: 512 });

    const zrb = calculateZPointForPixelCoordinates(tile, resolution, rightBottomPixel)
    expect(zrb).toStrictEqual({ real: 511, imaginary: 1 });

    const zlb = calculateZPointForPixelCoordinates(tile, resolution, leftBottomPixel)
    expect(zlb).toStrictEqual({ real: 0, imaginary: 1 });
  })

})
