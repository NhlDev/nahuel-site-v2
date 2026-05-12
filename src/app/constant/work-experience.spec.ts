import { workExperiences } from './work-experience';

describe('Work Experience', () => {
  it('should define work experiences', () => {
    expect(workExperiences).toBeDefined();
    expect(typeof workExperiences).toBe('object');
  });

  it('should have entries with required fields', () => {
    expect(Object.keys(workExperiences).length).toBeGreaterThan(0);
  });
});
