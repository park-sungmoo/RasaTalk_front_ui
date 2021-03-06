/**
 *
 * Agents
 *
 */

import React from 'react';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import IIcon from 'images/iIcon.png';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import defaultAvatar from 'images/agent.png';
import Wrapper from 'components/Grid/Wrapper';
import { createStructuredSelector } from 'reselect';
import ProfileCard from 'components/Cards/ProfileCard';
import { Route, Link } from 'react-router-dom';

import Intents from 'containers/IntentPage/Loadable';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { Button, Grid } from '@material-ui/core';

import saga from './saga';
import reducer from './reducer';
import makeSelectAgents from './selectors';
import { changeTitle } from '../HomePage/actions';
import { saveAgent, getAgents } from './actions';

import NewAgent from './newAgent';

export class Agents extends React.PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  componentDidMount() {
    this.props.dispatch(changeTitle('Agents'));
    this.props.dispatch(getAgents());
  }

  render() {
    const {
      agents: { agents, loading, edit, saving },
      match,
      dispatch,
    } = this.props;
    return (
      <div>
        <Helmet>
          <title>Agents</title>
          <meta name="description" content="Description of Agents" />
        </Helmet>

        <Route path="/agents/:agent" name="Intents" component={Intents} />

        <Route
          path={match.path}
          exact
          name="Talk Flow"
          render={() => (
            <Wrapper>
              <Grid item xs={8}>
                <Grid container spacing={40}>
                  {loading && (
                    <Grid item xs={12} sm={6} md={4}>
                      <ProfileCard loading />
                    </Grid>
                  )}
                  {!loading &&
                    agents.map(
                      ({
                        agent = '',
                        avatar = defaultAvatar,
                        subtitle = '',
                        description = '',
                        _id,
                      }) => (
                        <Grid key={agent} item xs={12} sm={12} md={4}>
                          <ProfileCard
                            avatar={avatar}
                            subtitle={subtitle}
                            agent={agent}
                            description={description}
                            footer={
                              <Button
                                component={({ ...props }) => (
                                  <Link
                                    to={`/agents/${encodeURIComponent(_id)}`}
                                    {...props}
                                  />
                                )}
                                variant="contained"
                                color="primary"
                                style={{ marginBottom: '15px' }}
                              >
                                View
                              </Button>
                            }
                            classes={this.props.classes}
                          />
                        </Grid>
                      ),
                    )}
                </Grid>
              </Grid>
              <Grid item xs={4}>
                <ProfileCard
                  avatar={IIcon}
                  subtitle="Agents group expressions"
                  agent="Agents"
                  description="Agents help to classify or split up different chatbots."
                />
                <NewAgent
                  edit={edit}
                  saving={saving}
                  submit={(values, reset) => dispatch(saveAgent(values, reset))}
                />
              </Grid>
            </Wrapper>
          )}
        />
      </div>
    );
  }
}

Agents.propTypes = {
  classes: PropTypes.object,
  match: PropTypes.object,
  dispatch: PropTypes.func.isRequired,
  agents: PropTypes.shape({
    oldNode: PropTypes.string,
    saving: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired,
    agents: PropTypes.array.isRequired,
    saveError: PropTypes.string.isRequired,
    loadingError: PropTypes.string.isRequired,
  }),
};

const mapStateToProps = createStructuredSelector({
  agents: makeSelectAgents(),
});

const mapDispatchToProps = dispatch => ({
  dispatch,
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);
const withReducer = injectReducer({ key: 'agents', reducer });
const withSaga = injectSaga({ key: 'agents', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(Agents);
