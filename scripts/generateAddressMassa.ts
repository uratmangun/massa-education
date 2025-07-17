import { Account } from '@massalabs/massa-web3'

const account = await Account.generate()
console.log("address:", account.address.toString())
console.log("public key:", account.publicKey.toString())
console.log("private key:", account.privateKey.toString())