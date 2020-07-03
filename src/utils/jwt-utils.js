import { KJUR } from 'jsrsasign';

const jwtDecode = (encode) => {
  const decode = KJUR.jws.JWS.verifyJWT(encode, '616161', { alg: ['HS256'] });

  return decode;
};

export { jwtDecode };
