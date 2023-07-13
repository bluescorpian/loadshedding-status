import { useState } from 'react';
import Modal from './Modal';
import './css/AreaSearch.css';

export default function AreaSearch({ show, handleClose, handleAddArea }) {
	const [searchAreas, setSearchAreas] = useState([]);
	const [loading, setLoading] = useState(false);

	const searchArea = (search) => {
		setLoading(true);
		fetch(`https://eskomsepush-api-proxy.dannyk.workers.dev/areas_search?text=${search}`)
			.then((res) => res.json())
			.then((data) => {
				if (data.error) {
					alert('Failed to fetch areas: ' + data.error);
					console.error(data.error);
				} else setSearchAreas(data.areas.slice(0, 5));
			})
			.finally(() => setLoading(false));
	};

	const handleSearchKeyDown = (e) => {
		if (e.key === 'Enter') {
			searchArea(e.target.value);
		}
	};

	return (
		<>
			<Modal show={show} handleClose={handleClose}>
				<input id='searchBox' type='text' placeholder='Search Area' onKeyDown={handleSearchKeyDown} autoComplete='false' disabled={loading}></input>
				{searchAreas.map((area) => {
					return (
						<div
							key={area.id}
							className='Search-area'
							onClick={() => {
								handleAddArea(area.id);
								handleClose();
							}}
						>
							<h2>{area.name}</h2>
							<p>{area.region}</p>
						</div>
					);
				})}
			</Modal>
		</>
	);
}
