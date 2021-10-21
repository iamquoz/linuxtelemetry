import { Link } from 'react-router-dom'
import {
	Nav, 
	NavItem, 
} from 'reactstrap'
import Arrow from '../sharedcomponents/arrow'

export default function Mainadmin() {
	return (
		<div>
			<Nav pills style = {{justifyContent: 'space-between'}}>
				<Arrow />
				<div style = {{display: "flex"}}>
					<NavItem>
						<Link to = "/pc" className = "nav-link underlineLink">Устройства</Link>
					</NavItem>
					<NavItem>
						<Link to = "/user" className = "nav-link underlineLink">Пользователи</Link>
					</NavItem>
					<NavItem>
						<Link to = "/permission" className = "nav-link underlineLink">Разрешения</Link>
					</NavItem>
				</div>
			</Nav>
		</div>
	)
}
