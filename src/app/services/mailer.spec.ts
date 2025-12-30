import { TestBed } from '@angular/core/testing';
import { Mailer } from './mailer';

describe('Mailer', () => {
  let service: Mailer;

  let originalFetch: typeof fetch;
  let fetchSpy: jasmine.Spy;

  const payload = {
    name: 'John Doe',
    email: 'john@example.com',
    message: 'Hello!',
    recaptchaToken: 'token',
    locale: 'es-AR'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Mailer);

    // Mock global fetch
    originalFetch = (globalThis as any).fetch;
    fetchSpy = jasmine.createSpy('fetch');
    (globalThis as any).fetch = fetchSpy;
  });

  afterEach(() => {
    // Restore original fetch
    (globalThis as any).fetch = originalFetch;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('sendContact should POST payload and return JSON on success', async () => {
    const serverResponse = { ok: true, id: '123' };
    fetchSpy.and.resolveTo({
      ok: true,
      json: async () => serverResponse
    } as Response);

    const result = await service.sendContact(payload);

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    const [url, options] = fetchSpy.calls.mostRecent().args as [string, RequestInit];
    expect(url).toBe('/api/contact');
    expect(options?.method).toBe('POST');
    expect(options?.headers).toEqual({ 'Content-Type': 'application/json' });

    const sentBody = JSON.parse(options!.body as string);
    expect(sentBody).toEqual(payload);

    expect(result).toEqual(serverResponse);
  });

  it('sendContact should throw Error with server message when response is not ok', async () => {
    fetchSpy.and.resolveTo({
      ok: false,
      json: async () => ({ message: 'reCAPTCHA verification failed' })
    } as Response);

    await expectAsync(service.sendContact(payload))
      .toBeRejectedWithError('reCAPTCHA verification failed');
  });

  it('sendContact should throw default Error when response is not ok and JSON body is invalid', async () => {
    fetchSpy.and.resolveTo({
      ok: false,
      json: async () => { throw new Error('Invalid JSON'); }
    } as unknown as Response);

    await expectAsync(service.sendContact(payload))
      .toBeRejectedWithError('Contact failed');
  });
});
