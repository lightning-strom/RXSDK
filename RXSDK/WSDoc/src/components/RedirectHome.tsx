import {useEffect} from 'react';
import {useHistory} from '@docusaurus/router';

export default function RedirectHome() {
  const history = useHistory();
  useEffect(() => {
    history.replace('/');
  }, [history]);
  return null;
}
