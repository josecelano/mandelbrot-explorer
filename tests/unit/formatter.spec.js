import formatter from '@/formatter'

describe('formatter', () => {
  it('should convert a complex to string', () => {
    const complex = {
      real: 1.0,
      imaginary: 2.0
    };

    const complexString = formatter.complexToString(complex);

    expect(complexString).toBe('1+2i');
  })

  it('should convert pixel coordinates to string', () => {
    const pixel = {
      x: 1,
      y: 2
    };

    const pixelString = formatter.pixelCoordinatesToString(pixel);

    expect(pixelString).toBe('x: 1 y: 2');
  })

  it('should convert resolution to string', () => {
    const resolution = {
      width: 1,
      height: 2
    };

    const resolutionString = formatter.resolutionToString(resolution);

    expect(resolutionString).toBe('1x2px');
  })
})
