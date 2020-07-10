import * as _ from 'lodash';

const pathHasError = ( path, errors ) => !!_.get(errors, path);

export { pathHasError }; 