import { bytesToStr, JsonRPCClient } from "@massalabs/massa-web3";
const sc_addr = "AS1ToET5EZszSCzmXpYissThsgfZpwFzgbU67t7bKRWXPJEV42pp"; 
const client = JsonRPCClient.buildnet();
const GREETING_KEY = "name_key";
const dataStoreVal = await client.getDatastoreEntry(GREETING_KEY, sc_addr, false)
if (!dataStoreVal) {
  throw new Error(`datastore key ${GREETING_KEY} doesn't exist`);
}
const greetingDecoded = bytesToStr(dataStoreVal);
console.log(greetingDecoded);

