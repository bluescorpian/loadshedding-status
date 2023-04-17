import { useState } from 'react';
import Modal from './Modal';
import './css/AreaSearch.css';

export default function AreaSearch({ show, handleClose, handleAddArea }) {
	const [searchAreas, setSearchAreas] = useState([]);

	const searchArea = (search) => {
		fetch('https://eskomsepush-api-proxy.dannyk.workers.dev/areas_search?text=' + search)
			.then((res) => res.json())
			.then((data) => {
				setSearchAreas(data.areas);
			});
	};

	const handleSearchKeyDown = (e) => {
		if (e.code === 'Enter') {
			searchArea(e.target.value);
		}
	};

	return (
		<>
			<Modal show={show} handleClose={handleClose}>
				<input type='text' placeholder='Search Area' onKeyDown={handleSearchKeyDown}></input>
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
