import { AxiosError } from 'axios';
import React, { useState } from 'react'

import {
	Button,
	InputGroup, 
	Input, 
	Form, 
	FormGroup, 
	InputGroupAddon,
	InputGroupText,
	Alert
} from 'reactstrap'
import { login } from '../auth';

export default function Login() {

	const [isOpen, setisOpen] = useState(false);
	const [text, settext] = useState('');

	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');

	const onSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		document.getElementById("submitbtn")!.classList.add("submitbtn");

		if (username.length === 0 && password.length === 0) {
			settext('Имя и пароль не могут быть пустыми');
			setisOpen(true);
			document.getElementById("submitbtn")!.classList.remove("submitbtn");
			return;
		}
		if (username.length === 0)  {
			settext('Имя не может быть пустым');
			setisOpen(true);
			document.getElementById("submitbtn")!.classList.remove("submitbtn");
			return;
		}
		if (password.length === 0) {
			settext('Пароль не может быть пустым');
			setisOpen(true);
			document.getElementById("submitbtn")!.classList.remove("submitbtn");
			return;
		}
		
		login(username, password)
			.then(res => {
				window.location.reload();
			})
			.catch((err: AxiosError) => {
				if (err.response?.status === 401)
					settext('Неправильный пароль');
				else if (err.response?.status === 404)
					settext('Аккаунт не существует');
				else 
					settext('Ошибка сервера');

				setisOpen(true);
			})
			.finally(() => {
				document.getElementById("submitbtn")!.classList.remove("submitbtn");
			})
		
	}

	return (
		<div className = "flex-container">

			<Form onSubmit = {onSubmit}>
				<h4 style = {{marginBottom: "30px"}}>Авторизация</h4>
				<FormGroup>
					<InputGroup>
						<InputGroupAddon addonType = "append" style = {{width: "90px"}}>
							<InputGroupText>
								Логин
							</InputGroupText>
						</InputGroupAddon>
						<Input type = "text" placeholder = "Логин от администратора" 
						style = {{width: "250px"}} onChange = {(e) => setUsername(e.target.value)}/>
					</InputGroup>
				</FormGroup>
				<FormGroup style = {{marginTop: "30px"}}>
					<InputGroup>
						<InputGroupAddon addonType = "prepend" style = {{width: "90px"}}>
							<InputGroupText>
								Пароль
							</InputGroupText>
						</InputGroupAddon>
						<Input placeholder = "Пароль" style = {{width: "250px"}} 
						onChange = {(e) => setPassword(e.target.value)} type = "password"/>
					</InputGroup>
				</FormGroup>
				{isOpen && 
				<Alert style = {{marginTop: "30px", backgroundColor: "rgba(248, 164, 40, 0.5)", color: 'black'}}
				onClick = {() => setisOpen(false)}>{text}</Alert>}
				<Button style = {{marginTop: "30px",  width: "100%"}}
				type = "submit" id = "submitbtn">Войти</Button>
			</Form>
		</div>
	)
}
