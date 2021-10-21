import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
//@ts-ignore
import DateTimePicker from 'react-datetime-picker'
import { Col, Row, Table} from 'reactstrap';
import { pc, pcEvent } from '../interfaces'

export default function Pc({isAdmin, pcs, setPcs}: {isAdmin: boolean, pcs: pc[], setPcs: React.Dispatch<React.SetStateAction<pc[]>>}) {
	let {pcid} : {pcid: string} = useParams();
	const [pc, setPc] = useState<pc>();
	const [stats, setStats] = useState<pcEvent[]>([])
	
	const [time1, setTime1] = useState(new Date(0));
	const [time2, setTime2] = useState(new Date());

	useEffect(() => {
		axios.get<pcEvent[]>(`/api/pc/${pcid}`)
			.then(res => setStats(res.data))
			.catch(err => console.log(err));
		
		setPc(pcs.filter(e => e.pcid === parseInt(pcid))[0])
	}, [pcid, pcs])

	return (
		<Row>
			{pc?.note && <p><b>Заметка:</b> {pc.note}</p>}
			<p>Показать результаты с: <DateTimePicker value = {time1} onChange = {setTime1} format = "y-MM-dd HH:mm:ss" disableClock = {true}/></p>
			<p>Показать результаты до: <DateTimePicker value = {time2} onChange = {setTime2} format = "y-MM-dd HH:mm:ss" disableClock = {true}/></p>
			<Col>
				<details>
					<summary>Информация по приложениям</summary>
					<Table>
						<thead>
							<tr>
								<th>Приложение</th>
								<th>Время переключения</th>
							</tr>
						</thead>
						<tbody>
							{stats.map(e => 
							<tr>
								<td>{e.app}</td>
								<td>{new Date(e.time * 1000).toLocaleString()}</td>
							</tr>
						)}	
						</tbody>
					</Table>
				</details>
			</Col>
		</Row>
	)
}
