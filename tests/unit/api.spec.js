import { default as api, COLOR_MAP } from '@/api'
import { FORMAT } from '../../src/api';

describe('api', () => {
  it('should build the URL for a Mandelbtrot API tile with periods color map', () => {
    const tileCommonUrlParams = {
      left_bottom_zx: -1.5,
      left_bottom_zy: -1,
      top_right_zx: 0.5,
      top_right_zy: 1,
      res_x: 512,
      res_y: 512,
      format: FORMAT.PPM,
      color_map: COLOR_MAP.COLORED_PERIODS
    };

    const url = api.buildTileImageEndpointUrl(tileCommonUrlParams, COLOR_MAP.COLORED_PERIODS);

    expect(url).toBe('http://localhost:8081/tiles?left_bottom_zx=-1.5&left_bottom_zy=-1&top_right_zx=0.5&top_right_zy=1&res_x=512&res_y=512&format=0&color_map=2');
  })
})
