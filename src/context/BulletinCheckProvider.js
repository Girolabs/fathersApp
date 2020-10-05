import React, { Component, createContext, Fragment } from 'react';
import { getCheckUnseenPosts, markAllPost } from '../api';

const BulletinCheckContext = createContext();

class BulletinCheckProvider extends Component {
  state = {
    unSeenPostsCounter: null,
  };
  componentDidMount() {
    this.checkUnseenPosts();
  }
  checkUnseenPosts() {
    getCheckUnseenPosts()
      .then((res) => {
        const fetchedCount = res.data.result.unseenPostsCount;
        this.setState({ unSeenPostsCounter: fetchedCount });
      })
      .catch(() => {});
  }

  render() {
    return (
      <Fragment>
        <BulletinCheckContext.Provider
          value={{
            unseenPostsCount: this.state.unSeenPostsCounter,
            checkUnseenCounter: () => {
              markAllPost().then((res) => {
                this.checkUnseenPosts();
              });
            },
          }}
        >
          {this.props.children}
        </BulletinCheckContext.Provider>
      </Fragment>
    );
  }
}

export default BulletinCheckProvider;
export { BulletinCheckContext };
