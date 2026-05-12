import { CAPTCHA_KEY } from './index';

describe('Constant', () => {
  it('should define CAPTCHA_KEY', () => {
    expect(CAPTCHA_KEY).toBeDefined();
    expect(typeof CAPTCHA_KEY).toBe('string');
    expect(CAPTCHA_KEY.length).toBeGreaterThan(0);
  });
});
