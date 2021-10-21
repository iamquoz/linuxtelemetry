import { useEffect, useState } from 'react';
import {
	BrowserRouter as Router,
	Route
} from 'react-router-dom'
import Mainadmin from './admincomponents/mainadmin';
import Perms from './admincomponents/perms';
import { check } from './auth';
import Login from './authcomponents/login';
import User from './regularcomponents/user';
import PClist from './sharedcomponents/pclist';

function App() {

	// -1 = yet unknown (pending promise)
	// 0 - not logged in
	// 1 - logged in as regular user
	// 2 - logged in as admin
	const [account , setAccount] = useState(-1);

	useEffect(() => {
		check()
			.then(r => setAccount(r.data === 'admin' ? 2 : 1))
			.catch(_ => setAccount(0));
	}, []);

	return (
		<div>
			<Router>
				<Route path = '/'>
					<>
					{account === -1 && <></>}
					{account === 0 && <Login />}
					{account === 1 && <User />}
					{account === 2 && <Mainadmin />}
					</>
				</Route>
				<Route path = '/pc'>
					<PClist isAdmin = {account === 2}/>
				</Route>
				<Route path = '/permission'>
					<Perms />
				</Route>
			</Router>
		</div>
  	);
}

export default App;
