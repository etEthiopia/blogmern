
import './App.css';
import { BrowserRouter, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { connect, useSelector } from "react-redux";
import { Provider } from "react-redux";
import React, { Component } from "react";
import store from "./state/store";
import ArticlesHome from './pages/article/ArticlesHome';
import SingleArticle from './pages/article/SingleArticle';
import { LoadUser } from './state/actions/authActions';
import SignIn from './pages/auth/SignIn';
import Loading from './components/Loading';
import WriteArticle from './pages/article/WriteEditArticle';
import AuthorArticles from './pages/article/AuthorArticles';
import WriteEditArticle from './pages/article/WriteEditArticle';

class App extends Component {

  state = {
    isAuthenticated: false
  }
  componentDidMount() {
    this.props.loadUser();
  }

  componentDidUpdate(previousProps) {
    if (previousProps.auth.isLoading !== this.props.auth.isLoading) {
      if (this.props.auth.isAuthenticated) {
        this.setState({
          isAuthenticated: true
        })
      } else {
        this.setState({
          isAuthenticated: false
        })
      }
    }
  }

  render() {
    return (
      <div className="App">
        <BrowserRouter>
          <ToastContainer autoClose={3000} hideProgressBar={true} />

          {this.props.auth.isLoading ?
            <Loading /> :
            (
              <div>
                <Route path="/read/:slug" component={SingleArticle} />
                <Route path="/login" component={this.state.isAuthenticated ? ArticlesHome : SignIn} />
                <Route path="/write" component={this.state.isAuthenticated ? WriteEditArticle : SignIn} />
                <Route path="/edit/:slug" component={this.state.isAuthenticated ? WriteEditArticle : SignIn} />
                <Route path="/portfolio" component={this.state.isAuthenticated ? AuthorArticles : SignIn} />
                <Route path="/" exact={true} component={ArticlesHome} />
              </div>
            )

          }

        </BrowserRouter>
      </div>

    );
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    loadUser: () => dispatch(LoadUser()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);


// function App() {
//   return (
//     <div>
//       Hello
//     </div>
//   );
// }

// export default App;
