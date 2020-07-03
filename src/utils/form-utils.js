import * as _ from 'lodash';

const pathHasError = ( path, touched, errors ) => !!( _.get(touched, path) && _.get(errors, path));

export { pathHasError }; 