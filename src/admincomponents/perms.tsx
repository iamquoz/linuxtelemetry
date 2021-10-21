import { useEffect, useState} from 'react'
import axios from 'axios'
import { Route, Switch, useRouteMatch, Link} from 'react-router-dom';

import {
	Row,
	Col
} from 'reactstrap'

import { permissions, user } from '../interfaces'
import Perm from './perm';
export default function Perms() {
	const [perms, setPerms] = useState<permissions[]>([]);
	const [users, setUsers] = useState<user[]>([]);
	let match = useRouteMatch();
	useEffect(() => {
		axios.get<permissions[]>('/admin/perms')
			.then(res => setPerms(res.data))
			.catch(err => console.log(err));
		axios.get<user[]>('/admin/user')
			.then(res => setUsers(res.data))
			.catch(err => console.log(err));
	}, [])
	return (
		<Row>
			<Col style = {{maxWidth: "300px", borderRightStyle: "solid", borderRightColor: "black"}}>
				<Link to = {`${match.url}/-1`}>
					<p className = "underlineLink">Добавить новое разрешение</p>
				</Link>
				<hr />
				{perms.map(e => 
					<Link to = {`${match.url}/${e.permid}`} key = {e.permid}>
						<p className = "underlineLink">{e.permname}</p>
					</Link>)}
			</Col>
			<Col>
				<Switch>
					<Route path = {`${match.path}/:permid`}>
						<Perm permissions = {perms} users = {users} setPerms = {setPerms}/>
					</Route>
				</Switch>
			</Col>			
		</Row>
	)
}
