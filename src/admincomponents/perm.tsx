import axios from "axios";
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Button, Input } from "reactstrap";
import { pc, permissions, user } from "../interfaces";

export default function Perm({permissions, users, setPerms} : {permissions: permissions[], users: user[], setPerms: React.Dispatch<React.SetStateAction<permissions[]>>}) {
	let {permid} : {permid: string} = useParams();

	const [perm, setPerm] = useState<permissions>();
	const [permUsers, setpermUsers] = useState<user[]>([]);
	const [pcs, setPcs] = useState<pc[]>([]);

	const [name, setName] = useState('');

	const [status, setStatus] = useState('');

	const add = () => {
		axios.post<permissions[]>('/admin/perms', {permname: name})
			.then(res => {
				setPerms([...permissions, res.data[0]]);
				setStatus('Успешно, доступен выбор пользователей')
				setTimeout(() => setStatus(''), 5000);
			})
			.catch(err => {
				setStatus('Ошибка сервера');
			});
	}

	const del = () => {
		axios.delete<permissions[]>(`/admin/params/${permid}`)
			.then(r => setPerms(permissions.filter(e => e.permid !== parseInt(permid))))
	}
	useEffect(() => {
		if (permid === '-1')
			setPerm({permname: '', permid: permissions[permissions.length - 1].permid + 1})
		else {
			axios.get<user[]>(`/admin/perms/${permid}/user`)
				.then(r => setpermUsers(r.data))
				.catch(err => console.log(err));
			axios.get<pc[]>(`/admin/perms/${permid}/pc`)
				.then(r => setPcs(r.data))
				.catch(err => console.log(err));
			setPerm(permissions.filter(e => e.permid === parseInt(permid))[0]);
		}
	}, [permid, permissions]);
	return (
		<div>
			{permid !== '-1'? 
			<>
				<h4>{perm?.permname}</h4>
				<hr />
				<h6>Пользователи с этим разрешением: </h6>
				<ul>
					{permUsers.map(e => <li>{e.username}</li>)}
				</ul>
				{pcs.length !== 0 && 
					<><hr />
					<h6>Компьютеры, требующие этого разрешения</h6>
					<ul>
						{pcs.map(e => <li><Link to = {`/pc/${e.pcid}`} className = "underlineLink">{e.pcname}</Link></li>)}
					</ul></>
				}
				{permid !== '0' && <Button style = {{backgroundColor: "#ff00008c"}} onClick = {() => del()}>Удалить разрешение</Button>}
			</> :
			<>
				<div style = {{display: 'flex'}}>
					<Input type = 'text' placeholder = 'Название нового разрешения'
				 	onChange = {(e) => setName(e.target.value)} style = {{maxWidth: "300px"}}/>
					<Button onClick = {() => add()} style = {{marginLeft: "25px"}}>Добавить</Button>
				</div>
				<p style = {{marginTop: "10px"}}>{status}</p>
			</>}
		</div>
	)
}
