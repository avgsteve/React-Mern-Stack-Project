import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { action_getGithubRepos } from '../../actions/action_profile';

const ProfileGithub = ({ username, action_getGithubRepos, user_repos }) => {
  useEffect(() => {
    action_getGithubRepos(username);
  }, [action_getGithubRepos, username]);

  return (
    <div className="profile-github">
      <h2 className="text-primary my-1">Github Repos</h2>


      {user_repos.length === 0 ?
        <h3>There's no user's repo has been found!</h3>
        :
        <div>

          <h3>First 5 results of user's repo:</h3>

          {user_repos.map(repoItem => (

            <div key={repoItem.id} className="repo bg-white p-1 my-1">

              <div>
                <h4>
                  <a href={repoItem.html_url} target="_blank" rel="noopener noreferrer">
                    {repoItem.name}
                  </a>
                </h4>
                <p>{repoItem.description}</p>
              </div>


              <div>
                <ul>
                  <li className="badge badge-primary">
                    Stars: {repoItem.stargazers_count}
                  </li>
                  <li className="badge badge-dark">
                    Watchers: {repoItem.watchers_count}
                  </li>
                  <li className="badge badge-light">Forks: {repoItem.forks_count}</li>
                </ul>
              </div>

            </div>
          ))}

        </div>

      }



    </div>
  );
};

ProfileGithub.propTypes = {
  action_getGithubRepos: PropTypes.func.isRequired,
  user_repos: PropTypes.array.isRequired,
  username: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  user_repos: state.profile.user_repos
});

export default connect(mapStateToProps, { action_getGithubRepos })(ProfileGithub);
