import { clean } from '../../../../../../app/api/server/lib/cleanQuery';


describe('clean', () => {
  it('should remove dangerous properties starting with $', () => {
    const query = { $danger: 'malicious', safe: 'value' };
    const result = clean(query);
    expect(result).toEqual({ safe: 'value' });
  });

  it('should keep allowed properties from the allowList', () => {
    const query = { $danger: 'malicious', $allowed: 'safe', safe: 'value' };
    const allowList = ['$allowed'];
    const result = clean(query, allowList);
    expect(result).toEqual({ $allowed: 'safe', safe: 'value' });
  });

  it('should recursively clean nested objects', () => {
    const query = { safe: 'value', nested: { $danger: 'malicious', safe: 'nestedValue' } };
    const result = clean(query);
    expect(result).toEqual({ safe: 'value', nested: { safe: 'nestedValue' } });
  });

  it('should not include properties from the denyList', () => {
    const query = { constructor: 'test', __proto__: 'test', prototype: 'test', safe: 'value' };
    const result = clean(query);
    expect(result).toEqual({ safe: 'value' });
  });
});
