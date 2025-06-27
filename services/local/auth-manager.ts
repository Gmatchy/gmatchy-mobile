let signOutCallback: () => void = () => {};

const AuthManager = {
  setSignOut: (fn: () => void) => {
    signOutCallback = fn;
  },
  triggerSignOut: () => {
    signOutCallback();
  },
};

export default AuthManager;
