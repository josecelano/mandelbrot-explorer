import { objectsAreEqual } from '@/comparison'

describe('objects', () => {
  it('are equal if they have exactly the same number, type and value for attribues', () => {
    const obj1 = {
      attr1: 1.0,
      attr2: 2.0
    };

    const obj2 = {
      attr1: 1.0,
      attr2: 2.0
    };

    expect(objectsAreEqual(obj1, obj2)).toBeTruthy();
  })

  it('are not equal if they do not have the same amount of attributes', () => {
    const obj1 = {
      attr1: 1.0
    };

    const obj2 = {
      attr1: 1.0,
      attr2: 2.0
    };

    expect(objectsAreEqual(obj1, obj2)).toBeFalsy();
  })

  it('are not equal if they do not have the same type of attributes', () => {
    const obj1 = {
      attr1: 1.0
    };

    const obj2 = {
      attr1: "1.0"
    };

    expect(objectsAreEqual(obj1, obj2)).toBeFalsy();
  })

  it('are not equal if they do not have the same value for each attribute', () => {
    const obj1 = {
      attr1: 1.0
    };

    const obj2 = {
      attr1: 2.0
    };

    expect(objectsAreEqual(obj1, obj2)).toBeFalsy();
  })
})
