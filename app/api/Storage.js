/**
 * AsyncStorage is a simple, unencrypted, asynchronous,
 * persistent, key-value storage system that is global to the app.
 * It should be used instead of LocalStorage.
 * https://facebook.github.io/react-native/docs/asyncstorage.html
 */
import { AsyncStorage } from 'react-native'

/**
 * the format of these functions should be in the form of ...
 * export const functionName = () => async () => { ... }
 *
 * ... you can then import them as import { storageFn } from './relative/path/to/Storage.js'
 */
const TOKEN_KEY = '@RedditClient:token';
const EXPIRE_KEY = '@RedditClient:expire';

export const getToken = async() => {
  await AsyncStorage.getItem(TOKEN_KEY);
}

export const clearToken = async() => {
  await AsyncStorage.removeItem(TOKEN_KEY);
  await AsyncStorage.removeItem(EXPIRE_KEY);
}

export const setToken = async(token) => {
  await AsyncStorage.setItem(TOKEN_KEY, token);
  await AsyncStorage.setItem(EXPIRE_KEY, Date.now().toString());
}

export const tokenHasExpired = async() => {
  expiration = await AsyncStorage.getItem(EXPIRE_KEY);
  if(!expiration){
    return true;
  }
  return Date.now() - Number(expiration) > 3600;
}
