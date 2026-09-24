import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import { getCheckUnseenPosts, markAllPost } from '../api';

const BulletinCheckContext = createContext();

function BulletinCheckProvider({ children }) {
  const [unseenPostsCount, setUnseenPostsCount] = useState(null);

  const checkUnseenPosts = useCallback(() => {
    return getCheckUnseenPosts()
      .then((res) => {
        const fetchedCount = res.data.result.unseenPostsCount;
        setUnseenPostsCount(fetchedCount);
      })
      .catch(() => {});
  }, []);

  const markCheckUnseenCounter = useCallback(() => {
    return markAllPost().then(checkUnseenPosts);
  }, [checkUnseenPosts]);

  useEffect(() => {
    checkUnseenPosts();
  }, [checkUnseenPosts]);

  const value = useMemo(
    () => ({
      unseenPostsCount,
      checkOnly: checkUnseenPosts,
      markCheckUnseenCounter,
    }),
    [checkUnseenPosts, markCheckUnseenCounter, unseenPostsCount],
  );

  return <BulletinCheckContext.Provider value={value}>{children}</BulletinCheckContext.Provider>;
}

BulletinCheckProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default BulletinCheckProvider;
export { BulletinCheckContext };
