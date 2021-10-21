import { useEffect, useState } from 'react'
import axios from 'axios'
import { Route, Switch, useRouteMatch, Link} from 'react-router-dom';
import { pc, permissions } from '../interfaces';
import { Col, Row } from 'reactstrap';
import Pc from './pc';

export default function PClist({isAdmin}: {isAdmin: boolean}) {
	let match = useRouteMatch();

	const [perms, setPerms] = useState<permissions[]>([]);
	const [pcs, setPcs] = useState<pc[]>([]);

	useEffect(() => {
		if (isAdmin) {
			axios.get<permissions[]>('/admin/perms')
				.then(res => setPerms(res.data))
				.catch(err => console.log(err));
		}
		axios.get<pc[]>('/api/pc')
			.then(res => setPcs(res.data))
			.catch(err => console.log(err));
	}, [isAdmin])
	return (
		<Row>
			<Col style = {{maxWidth: "300px", borderRightStyle: "solid", borderRightColor: "black"}}>
			{pcs.map(e => 
				<Link to = {`${match.url}/${e.pcid}`} key = {e.pcid}>
					<p className = "underlineLink">{e.pcname}</p>
				</Link>)}
			</Col>
			<Col>
				<Switch>
					<Route path = {`${match.path}/:pcid`}>
						<Pc pcs = {pcs} setPcs = {setPcs} isAdmin = {isAdmin}></Pc>
					</Route>
				</Switch>
			</Col>
		</Row>
	)
}