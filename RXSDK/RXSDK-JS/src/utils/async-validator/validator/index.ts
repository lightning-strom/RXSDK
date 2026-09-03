import string from './string'
import number from './number'
import boolean from './boolean'
import array from './array'
import object from './object'
import enumValidator from './enum'
import type from './type'
import required from './required'

export default {
  string,
  number,
  boolean,
  array,
  object,
  enum: enumValidator,
  email: type,
  required,
}
