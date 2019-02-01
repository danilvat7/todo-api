const {
    SHA256
} = require('crypto-js');
const jwt = require('jsonwebtoken');

const data = {
    id: 10
}
const token = jwt.sign(data, 'secret');

const token1 = jwt.sign({id:1}, 'secret');

const tokenVer = jwt.verify(token + 1, 'secret');
console.log(tokenVer);

// const msg = 'Some string';
// const hash = SHA256(msg).toString();

// const data = {
//     id: 4
// };

// const token = {
//     data,
//     hash: SHA256(JSON.stringify(data) + 'secret').toString()
// }

// token.data.id = 6;
// token.hash =  SHA256(JSON.stringify(token.data) + 'secret').toString()
// const resultHash = SHA256(JSON.stringify(token.data) + 'secret').toString();

// if (resultHash === token.hash) {
//     console.log('Data not change');

// } else {
//     console.log('Data was changed');
// }